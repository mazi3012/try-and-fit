import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';
import { createClient } from '@/utils/supabase/server';
import fs from 'fs';
import path from 'path';

// File-based logging for debugging in this environment
const LOG_FILE = path.join(process.cwd(), 'backend_debug.log');
const logToFile = (msg: string) => {
  try {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    fs.appendFileSync(LOG_FILE, line);
  } catch (e) {
    // ignore
  }
  console.log(msg);
};

const tunedModelId = process.env.TUNED_MODEL_ID;
const location = process.env.VERTEX_AI_LOCATION || 'us-central1';
const project = process.env.VERTEX_AI_PROJECT_ID;

logToFile(`ENV CHECK: project=${project}, location=${location}, model=${tunedModelId ? 'TUNED' : 'DEFAULT'}`);

// Auth utility for Google AI
const { GoogleAuth } = require('google-auth-library');

let authOptions: any = {
  scopes: ['https://www.googleapis.com/auth/generative-language']
};

if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  try {
    authOptions.credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    logToFile('Using Service Account from environment variable');
  } catch (e) {
    logToFile('Error parsing GOOGLE_SERVICE_ACCOUNT_JSON env var');
  }
} else {
  const saPath = path.join(process.cwd(), 'service_account.json');
  if (fs.existsSync(saPath)) {
    authOptions.keyFile = saPath;
    logToFile('Using Service Account from local file');
  } else {
    logToFile('WARNING: No service account found (neither env nor file)');
  }
}

const auth = new GoogleAuth(authOptions);


export async function POST(req: NextRequest) {
  let jobId: string | null = null;
  logToFile('>>> POST /api/tryon start');
  
  try {
    const body = await req.json();
    jobId = body.jobId;
    logToFile(`Processing Job ID: ${jobId}`);
    
    if (!jobId) throw new Error('Missing jobId');

    const supabase = await createClient();

    // 1. Get Job Details
    logToFile('Fetching job details from DB...');
    const { data: job, error: jobError } = await supabase
      .from('tryon_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) throw new Error(`Job not found: ${jobError?.message}`);
    logToFile(`Found Job status: ${job.status}`);

    // Update to processing
    await supabase.from('tryon_jobs').update({ status: 'processing' }).eq('id', jobId);

    // 2. Prepare Images
    const getSignedUrl = async (path: string) => {
      // If it's already a full URL, return it as is
      if (path.startsWith('http')) return path;
      
      const { data, error } = await supabase.storage.from('user-images').createSignedUrl(path, 60);
      if (error || !data) throw new Error(`Failed to sign URL for ${path}: ${error?.message}`);
      return data.signedUrl;
    };
    
    logToFile('Generating signed URLs...');
    const personUrl = await getSignedUrl(job.person_image_url);
    const garmentUrl = await getSignedUrl(job.garment_image_url);
    
    logToFile('Fetching Person Image from signed URL...');
    const personImageBase64 = await fetchImageAsBase64(personUrl);
    
    logToFile('Fetching Garment Image from signed URL...');
    const garmentImageBase64 = await fetchImageAsBase64(garmentUrl);

    // 3. Get Auth Token
    logToFile('Acquiring Google Access Token...');
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;
    if (!token) throw new Error('Failed to acquire Google access token');

    // 4. Call Gemini 3.1 Flash Image Preview
    // Using the verified Google AI endpoint and model ID
    const modelName = 'gemini-3.1-flash-image-preview'; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
    
    logToFile(`Sending request to Google AI: ${modelName}`);
    
    const prompt = `
      Perform a virtual try-on.
      The first image is a person. 
      The second image is a clothing garment.
      Task: Render the person wearing the specific clothing garment.
      Maintain the person's identity and posture. Fit the garment perfectly.
      Return the final image in high-quality.
    `;

    const aiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { mimeType: 'image/jpeg', data: personImageBase64 } },
              { inlineData: { mimeType: 'image/jpeg', data: garmentImageBase64 } }
            ]
          }
        ],
        generationConfig: {
           temperature: 1,
           topP: 0.95,
           topK: 64
        }
      })
    });

    if (!aiResponse.ok) {
       const errBody = await aiResponse.text();
       throw new Error(`AI API failed (${aiResponse.status}): ${errBody}`);
    }

    const resultData = await aiResponse.json();
    logToFile('AI request successful. Parsing result...');

    // 5. Process Result
    const candidate = resultData.candidates?.[0];
    if (!candidate) throw new Error('No candidates returned from AI');

    const imagePart = candidate.content.parts.find((p: any) => p.inlineData || p.fileData);

    if (imagePart && imagePart.inlineData) {
      logToFile('Transformation complete. Processing result image...');
      const resultImageBase64 = imagePart.inlineData.data;
      
      // Use user_id as folder name to match the 'Users can view their own results' RLS policy
      const resultImagePath = `${job.user_id}/${jobId}_result.jpg`;

      // Upload to 'results' bucket
      const { error: uploadError } = await supabase.storage
        .from('results')
        .upload(resultImagePath, Buffer.from(resultImageBase64, 'base64'), {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
         logToFile(`Storage Upload Error: ${uploadError.message}`);
         throw new Error(`Failed to upload result: ${uploadError.message}`);
      }

      logToFile('Result saved. Updating job record...');

      // 6. Final Update
      await supabase.from('tryon_jobs').update({
        status: 'completed',
        result_image_url: resultImagePath,
        error_message: null
      }).eq('id', jobId);

    } else {
      const textResponse = candidate.content.parts.map((p: any) => p.text).filter(Boolean).join(' ');
      logToFile(`AI did not return an image. Response: ${textResponse}`);
      throw new Error(`AI failed to generate an image: ${textResponse || 'Unknown reason'}`);
    }

    logToFile('<<< POST /api/tryon success');
    return NextResponse.json({ success: true });

  } catch (error: any) {
    // Log complete error details
    logToFile(`CRITICAL AI ROUTER ERROR: ${error.message}`);
    if (error.stack) logToFile(`Stack: ${error.stack}`);
    try {
       logToFile(`Full Error Detail: ${JSON.stringify(error)}`);
    } catch (e) {
       logToFile('Could not stringify error object');
    }

    // Attempt to update job status to failed
    try {
      if (jobId) {
        const supabase = await createClient();
        await supabase.from('tryon_jobs').update({ 
          status: 'failed', 
          error_message: error.message || 'Unknown processing error'
        }).eq('id', jobId);
      }
    } catch (dbErr) {
      logToFile('Meta-error: Failed to update job status in DB');
    }
    
    return NextResponse.json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}

async function fetchImageAsBase64(url: string): Promise<string> {
  logToFile(`fetchImageAsBase64: ${url.substring(0, 100)}...`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

import { createClient } from "@/utils/supabase/client";
import { TryOnJob, JobStatus } from "./types";
import { compressImage } from "./compress-image";

const supabase = createClient();

export async function uploadImage(file: File, bucket: 'user-images' | 'results') {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Please sign in to upload images and use the try-on features.");

  // Compress if it's an image
  let finalFile = file;
  if (file.type.startsWith('image/')) {
    try {
      finalFile = await compressImage(file, 100);
    } catch (e) {
      console.warn("Compression failed, uploading original", e);
    }
  }

  const fileExt = finalFile.name.split('.').pop();
  const fileName = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = fileName;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, finalFile);

  if (error) throw error;

  // Since buckets are private, we need a signed URL or use a proxy. 
  // For this app, let's get a temporary signed URL (valid for 1 hour) 
  // or return the path to be used with supabase.storage.from(bucket).getPublicUrl(path)
  // if we decide to make them public. 
  // Let's assume we want to store the path in the DB.
  return data.path;
}

export async function getImageUrl(path: string, bucket: 'user-images' | 'results') {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function createTryOnJob(payload: {
  personImagePath: string;
  garmentImagePath: string;
  sourceUrl?: string;
  buyUrl?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from('tryon_jobs')
    .insert({
      user_id: user.id,
      person_image_url: payload.personImagePath,
      garment_image_url: payload.garmentImagePath,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;

  // Trigger the AI processing via our internal API
  // We don't await here because we want to return to the processing page
  fetch('/api/tryon', {
    method: 'POST',
    body: JSON.stringify({ jobId: data.id }),
    headers: { 'Content-Type': 'application/json' }
  }).catch(console.error);

  return {
    id: data.id,
    status: data.status as JobStatus,
    createdAt: new Date(data.created_at).getTime(),
    userImage: data.person_image_url,
    outfitImage: data.garment_image_url
  } as TryOnJob;
}

export async function getTryOnJob(jobId: string): Promise<TryOnJob | null> {
  const { data, error } = await supabase
    .from('tryon_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    status: data.status as JobStatus,
    createdAt: new Date(data.created_at).getTime(),
    userImage: data.person_image_url,
    outfitImage: data.garment_image_url,
    resultImage: data.result_image_url,
    errorMessage: data.error_message
  };
}

export async function listRecentJobs(): Promise<TryOnJob[]> {
  const { data, error } = await supabase
    .from('tryon_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) return [];

  return data.map(job => ({
    id: job.id,
    status: job.status as JobStatus,
    createdAt: new Date(job.created_at).getTime(),
    userImage: job.person_image_url,
    outfitImage: job.garment_image_url,
    resultImage: job.result_image_url,
    errorMessage: job.error_message
  }));
}

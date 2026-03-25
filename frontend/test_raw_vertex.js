const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

async function testRawVertex() {
  const credentialsPath = 'e:/tryandfit/frontend/service_account.json';
  const project = 'peppy-avatar-429012-q2';
  const location = 'us-central1';

  console.log('Using credentials from:', credentialsPath);
  const auth = new GoogleAuth({
    keyFile: credentialsPath,
    scopes: [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/generative-language'
    ],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const token = tokenResponse.token;
  
  if (!token) {
    console.error('Failed to get access token');
    return;
  }
  console.log('Access token acquired');

  // Test Google AI with Gemini 3.1 Flash
  const tunedModel = '3919177311370346496@1';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${tunedModel}:generateContent`;

  console.log('Fetching from URL:', url);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'say hello' }] }]
      })
    });

    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Response Body:', text);
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

testRawVertex().catch(console.error);

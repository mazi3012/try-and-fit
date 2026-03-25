# Vercel Deployment Guide: TryAndFit


Follow these steps to deploy your AI-powered Virtual Try-On studio to Vercel.

## 1. Environment Variables
In your Vercel Project Settings, add the following environment variables:

| Key | Value Source |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret |
| `TUNED_MODEL_ID` | Your Gemini Tuned Model ID |
| `VERTEX_AI_PROJECT_ID` | Your Google Cloud Project ID |
| `VERTEX_AI_LOCATION` | `us-central1` (usually) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | See Step 2 below |

## 2. Setting up Google Service Account
Vercel does not allow uploading binary/JSON files as environment variables directly. We use a special variable called `GOOGLE_SERVICE_ACCOUNT_JSON`.

1. Open your `service_account.json` file.
2. Copy the **ENTIRE** content of the file.
3. In Vercel, create a new environment variable named `GOOGLE_SERVICE_ACCOUNT_JSON`.
4. Paste the JSON content as the value.

> [!IMPORTANT]
> Do NOT commit `service_account.json` to your GitHub repository. Ensure it is listed in `.gitignore`.

## 3. Supabase Redirects
Ensure your Supabase Auth settings allow the Vercel deployment URL in the "Redirect URLs" list:
- `https://your-app-name.vercel.app/auth/callback`

## 4. Deployment
Once the variables are set, simply push your code to GitHub or run:
```bash
vercel deploy --prod
```

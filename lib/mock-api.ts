"use client";

import { Feedback, TryOnJob, WardrobeItem } from "./types";

const JOBS_KEY = "tryandfit_jobs";
const WARDROBE_KEY = "tryandfit_wardrobe";
const FEEDBACK_KEY = "tryandfit_feedback";

function readJobs(): TryOnJob[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(JOBS_KEY);
  return raw ? (JSON.parse(raw) as TryOnJob[]) : [];
}

function writeJobs(jobs: TryOnJob[]) {
  window.localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

function readWardrobe(): WardrobeItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(WARDROBE_KEY);
  return raw ? (JSON.parse(raw) as WardrobeItem[]) : [];
}

function writeWardrobe(items: WardrobeItem[]) {
  window.localStorage.setItem(WARDROBE_KEY, JSON.stringify(items));
}

function readFeedback(): Feedback[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(FEEDBACK_KEY);
  return raw ? (JSON.parse(raw) as Feedback[]) : [];
}

function writeFeedback(items: Feedback[]) {
  window.localStorage.setItem(FEEDBACK_KEY, JSON.stringify(items));
}

function detectPlatform(url: string) {
  const lower = url.toLowerCase();
  if (lower.includes("myntra")) return "Myntra";
  if (lower.includes("flipkart")) return "Flipkart";
  if (lower.includes("amazon")) return "Amazon";
  if (lower.includes("meesho")) return "Meesho";
  if (lower.includes("ajio")) return "AJIO";
  if (lower.includes("instagram")) return "Instagram";
  return "Website";
}

export async function scrapeProductImage(url: string) {
  await new Promise((resolve) => setTimeout(resolve, 900));
  const platform = detectPlatform(url);
  const seed = encodeURIComponent(url);

  return {
    platform,
    outfitImage: `https://picsum.photos/seed/outfit-${seed}/900/1200`,
    productName: `${platform} Outfit`,
    buyUrl: url,
  };
}

export async function createTryOnJob(payload: {
  userImage: string;
  outfitImage: string;
  sourceUrl?: string;
  buyUrl?: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const id = `job_${Date.now()}`;
  const job: TryOnJob = {
    id,
    userImage: payload.userImage,
    outfitImage: payload.outfitImage,
    sourceUrl: payload.sourceUrl,
    buyUrl: payload.buyUrl,
    status: "pending",
    createdAt: Date.now(),
  };

  const jobs = [job, ...readJobs()];
  writeJobs(jobs);
  return job;
}

export async function getTryOnJob(jobId: string) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const jobs = readJobs();
  const idx = jobs.findIndex((job) => job.id === jobId);
  if (idx === -1) return null;

  const job = jobs[idx];
  const age = Date.now() - job.createdAt;

  if (job.status !== "failed") {
    if (age < 4000) {
      job.status = "pending";
    } else if (age < 10000) {
      job.status = "processing";
    } else {
      job.status = "completed";
      if (!job.resultImage) {
        job.resultImage = `https://picsum.photos/seed/result-${encodeURIComponent(job.id)}/900/1200`;
      }
    }
  }

  jobs[idx] = job;
  writeJobs(jobs);
  return job;
}

export function listRecentJobs() {
  return readJobs().sort((a, b) => b.createdAt - a.createdAt);
}

export function saveWardrobeFromJob(job: TryOnJob) {
  if (!job.resultImage) return null;

  const existing = readWardrobe();
  const item: WardrobeItem = {
    id: `wardrobe_${Date.now()}`,
    jobId: job.id,
    outfitName: "Saved outfit",
    resultImage: job.resultImage,
    buyUrl: job.buyUrl,
    createdAt: Date.now(),
  };

  writeWardrobe([item, ...existing]);
  return item;
}

export function listWardrobe() {
  return readWardrobe().sort((a, b) => b.createdAt - a.createdAt);
}

export function removeWardrobe(id: string) {
  const next = readWardrobe().filter((item) => item.id !== id);
  writeWardrobe(next);
}

export function submitFeedback(payload: Feedback) {
  const current = readFeedback().filter((item) => item.jobId !== payload.jobId);
  writeFeedback([payload, ...current]);
}

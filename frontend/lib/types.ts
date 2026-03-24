export type InputMode = "photo" | "product_url" | "social_url";

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export type TryOnJob = {
  id: string;
  userImage: string;
  outfitImage: string;
  sourceUrl?: string;
  buyUrl?: string;
  status: JobStatus;
  createdAt: number;
  resultImage?: string;
  errorMessage?: string;
};

export type WardrobeItem = {
  id: string;
  jobId: string;
  outfitName: string;
  resultImage: string;
  buyUrl?: string;
  createdAt: number;
};

export type Feedback = {
  jobId: string;
  rating: number;
  liked?: boolean;
  comment?: string;
};

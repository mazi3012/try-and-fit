export type Category = { id: string; name: string; slug: string; description?: string; image_url?: string; };
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

export type SellerStatus = "none" | "pending" | "approved" | "rejected";

export type UserProfile = {
  id: string;
  role: "buyer" | "seller" | "admin";
  full_name?: string;
  phone?: string;
  base_avatar_url?: string;
  onboarded: boolean;
  seller_status: SellerStatus;
};

export type Feedback = {
  jobId: string;
  rating: number;
  liked?: boolean;
  comment?: string;
};

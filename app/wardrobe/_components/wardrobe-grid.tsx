"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, ShoppingBag, Share2, Sparkles, Tag, Eye, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  result_image_url?: string;
  garment_image_url?: string;
  outfit_name?: string;
  category?: string;
  created_at: string;
  buy_url?: string;
  saved_to_wardrobe?: boolean;
}

interface WardrobeGridProps {
  jobs: Job[];
  mode: "saved" | "history";
}

const CATEGORY_COLORS: Record<string, string> = {
  Tops: "bg-blue-50 text-blue-600 border-blue-100",
  Dresses: "bg-pink-50 text-pink-600 border-pink-100",
  Ethnic: "bg-amber-50 text-amber-700 border-amber-100",
  Denim: "bg-indigo-50 text-indigo-600 border-indigo-100",
  Casual: "bg-green-50 text-green-600 border-green-100",
  Formal: "bg-gray-100 text-gray-700 border-gray-200",
  Sports: "bg-orange-50 text-orange-600 border-orange-100",
  Accessories: "bg-purple-50 text-purple-600 border-purple-100",
  general: "bg-[#F7F7F7] text-[#888] border-black/5",
};

export default function WardrobeGrid({ jobs, mode }: WardrobeGridProps) {
  const router = useRouter();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleUnsave = async (jobId: string) => {
    setRemovingId(jobId);
    try {
      await fetch("/api/wardrobe/save", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setRemovingId(null);
    }
  };

  const handleShare = async (jobId: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/result/${jobId}`);
    alert("Look link copied!");
  };

  if (jobs.length === 0) {
    return (
      <p className="text-center text-sm text-[#888] font-medium py-12">
        No {mode === "saved" ? "saved looks" : "try-on history"} yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {jobs.map((job) => {
        const catColor = CATEGORY_COLORS[job.category ?? ""] ?? CATEGORY_COLORS.general;
        const isRemoving = removingId === job.id;

        return (
          <div
            key={job.id}
            className={cn(
              "group bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300",
              isRemoving && "opacity-40 scale-95"
            )}
          >
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#F0F0F0]">
              {job.result_image_url ? (
                <img
                  src={job.result_image_url}
                  alt={job.outfit_name || "AI Look"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Sparkles size={24} className="text-[#ddd]" />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Link href={`/result/${job.id}`}>
                  <button className="h-10 w-10 rounded-full bg-white text-[#111] flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Eye size={15} />
                  </button>
                </Link>
                {mode === "saved" && (
                  <button
                    onClick={() => handleUnsave(job.id)}
                    className="h-10 w-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {/* Category badge */}
              {job.category && (
                <div className="absolute top-2 left-2">
                  <span className={cn("text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border", catColor)}>
                    {job.category}
                  </span>
                </div>
              )}

              {/* Saved badge for history mode */}
              {mode === "history" && job.saved_to_wardrobe && (
                <div className="absolute top-2 right-2">
                  <span className="h-5 w-5 bg-brand rounded-full flex items-center justify-center shadow">
                    <Tag size={10} className="text-white" />
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-2">
              <div>
                <h3 className="text-[10px] font-black text-[#111] uppercase tracking-tight line-clamp-1 group-hover:text-brand transition-colors">
                  {job.outfit_name || "AI Look"}
                </h3>
                <p className="text-[8px] text-[#bbb] font-mono mt-0.5">
                  {new Date(job.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </p>
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={() => handleShare(job.id)}
                  className="flex-1 h-7 rounded-lg border border-black/8 text-[8px] font-black text-[#888] uppercase tracking-widest flex items-center justify-center gap-1 hover:border-brand/30 hover:text-brand transition-all"
                >
                  <Share2 size={9} /> Share
                </button>
                {job.buy_url && (
                  <a href={job.buy_url} target="_blank" rel="noreferrer" className="flex-1">
                    <button className="w-full h-7 rounded-lg bg-brand/10 text-brand text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-1 hover:bg-brand hover:text-white transition-all">
                      <ShoppingBag size={9} /> Buy
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

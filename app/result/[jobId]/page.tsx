"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Download, Share2, ShoppingBag, ArrowLeft,
  Star, Heart, CheckCircle2, Shirt, Sparkles, Loader2
} from "lucide-react";
import { getTryOnJob, getImageUrl } from "@/lib/supabase-api";
import { cn } from "@/lib/utils";
import type { TryOnJob } from "@/lib/types";

const CATEGORIES = [
  "Tops", "Dresses", "Ethnic", "Denim", "Casual", "Formal", "Sports", "Accessories"
];

export default function ResultPage() {
  const params = useParams<{ jobId: string }>();
  const [job, setJob] = useState<TryOnJob | null>(null);
  const [userImageUrl, setUserImageUrl] = useState("");
  const [resultImageUrl, setResultImageUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [outfitName, setOutfitName] = useState("My Look");
  const [category, setCategory] = useState("Casual");
  const [rating, setRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    getTryOnJob(params.jobId).then(async (current) => {
      if (!current) return;
      setJob(current);
      setSaved(!!(current as any).saved_to_wardrobe);
      if ((current as any).outfit_name) setOutfitName((current as any).outfit_name);

      const u1 = await getImageUrl(current.userImage, "user-images");
      setUserImageUrl(u1);
      if (current.resultImage) {
        const u2 = await getImageUrl(current.resultImage, "results");
        setResultImageUrl(u2);
      }
    });
  }, [params.jobId]);

  const onSave = async () => {
    if (saved || saving || !job) return;
    setSaving(true);
    try {
      const res = await fetch("/api/wardrobe/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, outfitName, category }),
      });
      if (res.ok) setSaved(true);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const onShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const onDownload = () => {
    if (!resultImageUrl) return;
    const a = document.createElement("a");
    a.href = resultImageUrl;
    a.download = `tryandfit-${job?.id}.jpg`;
    a.click();
  };

  if (!job) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        <p className="text-sm font-bold text-[#888]">Retrieving your look...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full bg-white border-b border-black/5 px-4 sm:px-8 lg:px-12 xl:px-16 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <Link href="/try-on" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#888] hover:text-brand transition-colors">
            <ArrowLeft size={13} /> Back to Studio
          </Link>
          <div className="flex items-center gap-2 text-brand">
            <Sparkles size={13} />
            <span className="text-[10px] font-black uppercase tracking-widest">AI Result</span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 lg:px-12 xl:px-16 py-8 max-w-screen-2xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-5">

          {/* Result Image — 3 cols */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-xl bg-[#F0F0F0]">
              {resultImageUrl ? (
                <img src={resultImageUrl} alt="AI Result" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Loader2 className="animate-spin text-brand" size={32} />
                </div>
              )}
              {/* Overlay badge */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-black text-[#111] uppercase tracking-wider">AI Rendered</span>
              </div>
            </div>

            {/* Before / After mini cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-black/5 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
                {userImageUrl && (
                  <img src={userImageUrl} className="h-14 w-12 object-cover rounded-xl shrink-0" alt="You" />
                )}
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#888]">Your Photo</p>
                  <p className="text-xs font-black text-[#111]">Original</p>
                </div>
              </div>
              <div className="bg-white border border-black/5 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
                {job.outfitImage && job.outfitImage.startsWith("http") && (
                  <img src={job.outfitImage} className="h-14 w-12 object-cover rounded-xl shrink-0" alt="Outfit" />
                )}
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#888]">Outfit Used</p>
                  <p className="text-xs font-black text-[#111]">Selected Item</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions — 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Save to Wardrobe card */}
            <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand mb-1">Save this Look</p>
                <h2 className="text-xl font-black text-[#111] uppercase tracking-tight">Love it? Keep it.</h2>
                <p className="text-xs text-[#888] font-medium mt-1">Name your outfit and save it to your digital wardrobe.</p>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#888] block mb-1">Outfit Name</label>
                  <input
                    value={outfitName}
                    onChange={e => setOutfitName(e.target.value)}
                    disabled={saved}
                    className="input text-sm h-10"
                    placeholder="e.g. Date Night Look"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#888] block mb-1">Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map(c => (
                      <button
                        key={c}
                        disabled={saved}
                        onClick={() => setCategory(c)}
                        className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                          category === c
                            ? "bg-brand text-white border-brand"
                            : "border-black/10 text-[#888] hover:border-brand/40"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onSave}
                  disabled={saved || saving}
                  className={cn(
                    "w-full h-12 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                    saved
                      ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
                      : "bg-brand text-white hover:bg-brand/90 shadow-xl shadow-brand/20"
                  )}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> :
                    saved ? <><CheckCircle2 size={16} /> Saved to Wardrobe</> :
                    <><Heart size={16} /> Save to Wardrobe</>}
                </button>

                {saved && (
                  <Link href="/wardrobe" className="text-center text-[10px] font-black uppercase tracking-widest text-brand hover:underline">
                    View My Wardrobe →
                  </Link>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white border border-black/5 rounded-3xl p-5 shadow-sm flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={onDownload} className="h-11 rounded-xl border border-black/10 text-xs font-black uppercase tracking-widest text-[#555] flex items-center justify-center gap-2 hover:border-brand hover:text-brand transition-all">
                  <Download size={14} /> Download
                </button>
                <button onClick={onShare} className="h-11 rounded-xl border border-black/10 text-xs font-black uppercase tracking-widest text-[#555] flex items-center justify-center gap-2 hover:border-brand hover:text-brand transition-all">
                  <Share2 size={14} /> Share
                </button>
              </div>
              {job.buyUrl && (
                <a href={job.buyUrl} target="_blank" rel="noreferrer">
                  <button className="w-full h-11 rounded-xl border border-dashed border-brand/30 text-brand text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand/5 transition-all">
                    <ShoppingBag size={14} /> Shop This Outfit
                  </button>
                </a>
              )}
            </div>

            {/* Rating */}
            <div className="bg-white border border-black/5 rounded-3xl p-5 shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#888] mb-3">Rate this AI Result</p>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s}
                    disabled={ratingSubmitted}
                    onClick={() => { setRating(s); setRatingSubmitted(true); }}
                    className={cn(
                      "h-10 w-10 rounded-xl transition-all",
                      s <= rating ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-[#F7F7F7] text-[#aaa] hover:bg-brand/10"
                    )}
                  >
                    <Star className={cn("mx-auto h-4 w-4", s <= rating && "fill-current")} />
                  </button>
                ))}
                {ratingSubmitted && <span className="text-[10px] font-black text-green-500 uppercase tracking-widest ml-1">Thanks!</span>}
              </div>
            </div>

            {/* Try again */}
            <Link href="/try-on" className="group bg-[#111] rounded-3xl p-5 flex items-center gap-4 hover:bg-brand transition-colors">
              <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Shirt size={20} />
              </div>
              <div className="text-white">
                <p className="text-sm font-black uppercase tracking-tight">Try Another Outfit</p>
                <p className="text-[10px] text-white/50 font-medium">Swap any garment instantly</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

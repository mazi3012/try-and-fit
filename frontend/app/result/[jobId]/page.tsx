"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, Share2, ShoppingBag, ArrowLeft, Star, Heart, CheckCircle2, Shirt } from "lucide-react";
import { getTryOnJob, getImageUrl } from "@/lib/supabase-api";
import { GlassCard } from "@/components/ui/glass-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { cn } from "@/lib/utils";
import type { TryOnJob } from "@/lib/types";

export default function ResultPage() {
  const params = useParams<{ jobId: string }>();
  const [job, setJob] = useState<TryOnJob | null>(null);
  const [userImageUrl, setUserImageUrl] = useState("");
  const [resultImageUrl, setResultImageUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [rating, setRating] = useState(4);

  useEffect(() => {
    getTryOnJob(params.jobId).then(async (current) => {
      if (!current) return;
      setJob(current);
      
      const u1 = await getImageUrl(current.userImage, 'user-images');
      setUserImageUrl(u1);
      
      if (current.resultImage) {
        const u2 = await getImageUrl(current.resultImage, 'results');
        setResultImageUrl(u2);
      }
    });
  }, [params.jobId]);

  if (!job) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        <p className="text-sm font-medium text-muted">Retrieving your masterpiece...</p>
      </div>
    );
  }

  const onSave = () => {
    setSaved(true);
    // Real logic would update wardrobe in Supabase
  };

  const onShare = async () => {
    const shareUrl = window.location.href;
    await navigator.clipboard.writeText(shareUrl);
    alert("Share link copied to clipboard!");
  };

  const onDownload = () => {
    if (!resultImageUrl) return;
    const link = document.createElement("a");
    link.href = resultImageUrl;
    link.download = `tryandfit-${job.id}.jpg`;
    link.click();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10 py-10">
      <header className="flex flex-col items-center gap-4 text-center">
        <Link 
          href="/try-on" 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-brand transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to studio
        </Link>
        <h1 className="text-4xl font-black tracking-tight text-gradient sm:text-6xl">Your Transformation</h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Comparison Section */}
        <div className="space-y-4">
           <div className="relative aspect-[3/4] overflow-hidden rounded-[32px] shadow-2xl group">
              <img 
                src={resultImageUrl || job.resultImage || job.outfitImage} 
                alt="Transformation" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                 <div className="flex items-center gap-2 rounded-full bg-brand px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                    <CheckCircle2 className="h-3 w-3" />
                    AI Rendered
                 </div>
                 <h2 className="mt-2 text-2xl font-black text-white">Final Look</h2>
              </div>
           </div>
           
           <div className="flex gap-4">
              <GlassCard className="flex flex-1 items-center gap-4 p-4">
                 <img src={userImageUrl || job.userImage} className="h-12 w-12 rounded-lg object-cover" alt="Source" />
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted font-black">Source Portrait</p>
                    <p className="text-xs font-medium text-white/80">Captured Profile</p>
                 </div>
              </GlassCard>
              <GlassCard className="flex flex-1 items-center gap-4 p-4">
                 <img src={job.outfitImage} className="h-12 w-12 rounded-lg object-cover border border-white/10" alt="Garment" />
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted font-black">Target Garment</p>
                    <p className="text-xs font-medium text-white/80">Selected Item</p>
                 </div>
              </GlassCard>
           </div>
        </div>

        {/* Actions Section */}
        <div className="flex flex-col gap-6">
           <GlassCard className="flex flex-col gap-6 p-8">
              <div className="space-y-4">
                 <h3 className="text-xl font-bold">Love this look?</h3>
                 <p className="text-sm leading-relaxed text-muted">
                   Our Gemini AI has seamlessly merged the selected outfit with your portrait. You can now save it to your virtual wardrobe or share it with friends.
                 </p>
              </div>

              <div className="flex flex-col gap-3">
                 <PremiumButton onClick={onSave} className="w-full justify-between" icon={saved ? <CheckCircle2 className="h-5 w-5" /> : <Heart className="h-5 w-5" />}>
                   {saved ? "Added to Wardrobe" : "Save to Wardrobe"}
                 </PremiumButton>
                 <div className="flex gap-3">
                    <PremiumButton variant="outline" className="flex-1" icon={<Download className="h-4 w-4" />} onClick={onDownload}>
                      Download
                    </PremiumButton>
                    <PremiumButton variant="outline" className="flex-1" icon={<Share2 className="h-4 w-4" />} onClick={onShare}>
                      Share
                    </PremiumButton>
                 </div>
              </div>

              {job.buyUrl && (
                <a href={job.buyUrl} target="_blank" rel="noreferrer" className="block">
                  <PremiumButton variant="ghost" className="w-full border border-dashed border-white/10 text-brand" icon={<ShoppingBag className="h-4 w-4" />}>
                    Shop this Outfit
                  </PremiumButton>
                </a>
              )}
           </GlassCard>

           <GlassCard className="p-8">
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted">Quality Feedback</h4>
              <p className="mt-2 text-xs text-muted">Help us improve the AI by rating this generation.</p>
              
              <div className="mt-6 flex items-center justify-between">
                 <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                       <button
                         key={s}
                         onClick={() => setRating(s)}
                         className={cn(
                           "h-10 w-10 rounded-xl transition-all",
                           s <= rating ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-white/5 text-muted hover:bg-white/10"
                         )}
                       >
                          <Star className={cn("mx-auto h-4 w-4", s <= rating && "fill-current")} />
                       </button>
                    ))}
                 </div>
                 <PremiumButton variant="outline" size="sm">Submit</PremiumButton>
              </div>
           </GlassCard>

           <Link href="/try-on" className="group flex items-center justify-center gap-4 rounded-3xl bg-white/5 p-6 transition-all hover:bg-white/10 border border-white/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white group-hover:scale-110 transition-transform">
                 <Shirt className="h-6 w-6" />
              </div>
              <div className="text-left">
                 <p className="text-sm font-bold">Try another outfit</p>
                 <p className="text-xs text-muted">Instantly swap garments on your photo</p>
              </div>
           </Link>
        </div>
      </div>
    </div>
  );
}

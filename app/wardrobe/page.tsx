import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, ShoppingBag, Zap, Grid3X3, Calendar, Tag } from "lucide-react";
import WardrobeGrid from "./_components/wardrobe-grid";

export default async function WardrobePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  // Fetch all completed tryon_jobs for this user — wardrobe = saved ones
  const { data: allJobs } = await supabase
    .from("tryon_jobs")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  const mappedJobs = (allJobs ?? []).map((job: any) => ({
    ...job,
    result_image_url: job.result_image_url 
      ? supabase.storage.from("results").getPublicUrl(job.result_image_url).data.publicUrl 
      : null,
    garment_image_url: job.garment_image_url && !job.garment_image_url.startsWith("http")
      ? supabase.storage.from("user-images").getPublicUrl(job.garment_image_url).data.publicUrl
      : job.garment_image_url,
  }));

  const wardrobe = mappedJobs.filter((j: any) => j.saved_to_wardrobe);
  const history = mappedJobs;

  // Stats
  const categories = [...new Set(wardrobe.map((j: any) => j.category).filter(Boolean))];
  const totalTryOns = history.length;
  const saved = wardrobe.length;

  return (
    <div className="w-full">
      {/* ── HERO HEADER — dark full-bleed ─────────────────────── */}
      <div className="w-full bg-[#0A0A0A] relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-brand/20 blur-[80px] pointer-events-none" />
        <div className="absolute top-0 right-1/3 h-48 w-48 rounded-full bg-purple-500/10 blur-[60px] pointer-events-none" />

        <div className="px-4 sm:px-8 lg:px-12 xl:px-16 py-10 max-w-screen-2xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-brand/20 flex items-center justify-center">
                  <Sparkles size={12} className="text-brand" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.35em] text-brand">Digital Closet · AI Edition</span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-[0.85]">
                MY<br /><span className="text-brand">WARDROBE</span>
              </h1>
              <p className="text-sm text-white/40 font-medium mt-2 max-w-xs">
                Your AI-curated digital closet. Every look you've tried and loved, organized for you.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex gap-4">
              {[
                { icon: <Sparkles size={14} />, val: saved, label: "Saved Looks" },
                { icon: <Zap size={14} />, val: totalTryOns, label: "Try-Ons" },
                { icon: <Tag size={14} />, val: categories.length, label: "Categories" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="flex items-center justify-center gap-1 text-brand mb-0.5">{s.icon}</div>
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Category chips */}
          {categories.length > 0 && (
            <div className="flex gap-2 mt-5 overflow-x-auto scrollbar-hide">
              {categories.map(cat => (
                <span key={cat} className="flex-shrink-0 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white/60 uppercase tracking-widest">
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── TABS ───────────────────────────────────────────────── */}
      <div className="w-full bg-white border-b border-black/5 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-screen-2xl mx-auto flex gap-1 py-2">
          {[
            { id: "saved", icon: <Grid3X3 size={12} />, label: `Saved (${saved})` },
            { id: "history", icon: <Calendar size={12} />, label: `History (${totalTryOns})` },
          ].map(tab => (
            <div key={tab.id} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand text-white text-[10px] font-black uppercase tracking-widest first:bg-brand first:text-white [&:not(:first-child)]:bg-transparent [&:not(:first-child)]:text-[#888]">
              {tab.icon} {tab.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────────── */}
      <div className="px-4 sm:px-8 lg:px-12 xl:px-16 py-8 max-w-screen-2xl mx-auto">
        {wardrobe.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-3xl bg-[#F0F0F0] flex items-center justify-center">
                <ShoppingBag size={36} className="text-[#ccc]" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 bg-brand rounded-full flex items-center justify-center shadow-lg shadow-brand/30">
                <Sparkles size={14} className="text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#111] uppercase tracking-tighter mb-2">
                Your Digital Closet is Empty
              </h2>
              <p className="text-sm text-[#888] font-medium max-w-xs mx-auto">
                Try on any outfit in the Studio. When you love a look, save it — it'll appear here.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/try-on">
                <button className="h-12 px-8 rounded-xl bg-brand text-white text-sm font-black uppercase tracking-widest hover:bg-brand/90 transition-colors shadow-xl shadow-brand/20 flex items-center gap-2">
                  <Sparkles size={16} /> Open Studio
                </button>
              </Link>
              <Link href="/shop">
                <button className="h-12 px-8 rounded-xl border border-black/10 text-[#555] text-sm font-black uppercase tracking-widest hover:border-brand hover:text-brand transition-all">
                  Browse Shop
                </button>
              </Link>
            </div>

            {/* History still shown if try-ons exist */}
            {history.length > 0 && (
              <div className="w-full mt-8">
                <h3 className="text-left text-xs font-black uppercase tracking-widest text-[#888] mb-4 flex items-center gap-2">
                  <Calendar size={12} /> Recent Try-Ons (unsaved)
                </h3>
                <WardrobeGrid jobs={history} mode="history" />
              </div>
            )}
          </div>
        ) : (
          <WardrobeGrid jobs={wardrobe} mode="saved" />
        )}
      </div>
    </div>
  );
}

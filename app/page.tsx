import Link from "next/link";
import { Sparkles, Zap, ShoppingBag, Star, ArrowRight, TrendingUp, Shield } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getProducts } from "@/lib/ecommerce";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const products = await getProducts(undefined).catch(() => []);
  const featured = products.slice(0, 5);

  return (
    <div className="w-full flex flex-col">

      {/* ── HERO — full bleed ─────────────────────────────────────── */}
      <section className="w-full bg-white border-b border-black/5 px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-screen-2xl mx-auto">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-brand">
              <Sparkles size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI-Powered Fashion</span>
            </div>
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tighter text-[#111] uppercase leading-[0.88]">
              TRY BEFORE<br />
              <span className="text-brand">YOU BUY.</span>
            </h1>
            <p className="text-base text-[#888] font-medium max-w-md leading-relaxed">
              Upload your photo. Pick any outfit from our catalog. Our AI shows you exactly how it looks on you — in seconds. No fitting room needed.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {!user ? (
                <Link href="/auth/login">
                  <button className="h-13 px-8 py-3.5 rounded-xl bg-brand text-white text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:bg-brand/90 transition-all shadow-xl shadow-brand/20">
                    Get Started Free <ArrowRight size={16} />
                  </button>
                </Link>
              ) : (
                <Link href="/try-on">
                  <button className="h-13 px-8 py-3.5 rounded-xl bg-brand text-white text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:bg-brand/90 transition-all shadow-xl shadow-brand/20">
                    <Sparkles size={16} /> Open Studio
                  </button>
                </Link>
              )}
              <Link href="/shop">
                <button className="h-13 px-8 py-3.5 rounded-xl border-2 border-black/10 text-[#111] text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:border-brand hover:text-brand transition-all">
                  Browse Shop <ShoppingBag size={16} />
                </button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 pt-2">
              {[
                { icon: <Zap size={13} />, text: "Results in under 10 seconds" },
                { icon: <Shield size={13} />, text: "Your photos stay private" },
                { icon: <Star size={13} />, text: "100+ brands available" },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-1.5 text-[10px] font-bold text-[#888] uppercase tracking-widest">
                  <span className="text-brand">{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual — 3-image mosaic */}
          <div className="hidden lg:grid grid-cols-2 gap-3 h-[480px]">
            <div className="rounded-2xl overflow-hidden bg-[#F0F0F0] row-span-2">
              {featured[0]?.image_url && (
                <img src={featured[0].image_url} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="rounded-2xl overflow-hidden bg-[#F0F0F0]">
              {featured[1]?.image_url && (
                <img src={featured[1].image_url} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="rounded-2xl overflow-hidden bg-brand/10 flex items-end p-4">
              <div className="bg-white rounded-xl p-3 w-full shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-6 w-6 rounded-full bg-brand flex items-center justify-center">
                    <Sparkles size={12} className="text-white" />
                  </div>
                  <span className="text-[10px] font-black text-brand uppercase tracking-widest">AI Result</span>
                </div>
                <p className="text-xs font-black text-[#111]">Looking amazing! 🎉</p>
                <p className="text-[9px] text-[#888] font-medium">Ready to buy this look?</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR — full bleed ────────────────────────────────── */}
      <section className="w-full bg-[#111] text-white">
        <div className="px-4 sm:px-8 lg:px-12 xl:px-16 py-4 max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-x divide-white/10">
            {[
              { val: "10K+", label: "Try-Ons Daily" },
              { val: "500+", label: "Brands Listed" },
              { val: "40%", label: "Higher Conversions" },
              { val: "< 10s", label: "AI Processing" },
            ].map(s => (
              <div key={s.label} className="px-4 first:pl-0 text-center sm:text-left">
                <p className="text-xl sm:text-2xl font-black text-brand">{s.val}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-12 max-w-screen-2xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand mb-1">Simple as 1-2-3</p>
            <h2 className="text-3xl font-black text-[#111] uppercase tracking-tighter">How It Works</h2>
          </div>
          <Link href="/try-on" className="hidden sm:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand hover:underline">
            Try Now <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { num: "01", icon: <ShoppingBag size={24} />, title: "Pick an Outfit", desc: "Browse our catalog and choose any item you love. Or paste a product URL from any store." },
            { num: "02", icon: <Sparkles size={24} />, title: "Upload Your Photo", desc: "Take or upload a clear front-facing photo. Your data stays private and is never shared." },
            { num: "03", icon: <Star size={24} />, title: "See the Result", desc: "Our AI renders the outfit on you in under 10 seconds. Save looks and buy what fits." },
          ].map(step => (
            <div key={step.num} className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
                  {step.icon}
                </div>
                <span className="text-4xl font-black text-black/5">{step.num}</span>
              </div>
              <h3 className="text-sm font-black text-[#111] uppercase tracking-tight mb-2">{step.title}</h3>
              <p className="text-xs text-[#888] font-medium leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS — full bleed ───────────────────────── */}
      {featured.length > 0 && (
        <section className="w-full bg-white border-y border-black/5">
          <div className="px-4 sm:px-8 lg:px-12 xl:px-16 py-10 max-w-screen-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand mb-1 flex items-center gap-1.5">
                  <TrendingUp size={12} /> Trending Now
                </p>
                <h2 className="text-3xl font-black text-[#111] uppercase tracking-tighter">Featured Picks</h2>
              </div>
              <Link href="/shop" className="hidden sm:flex items-center gap-1.5 h-10 px-5 rounded-full border border-black/10 text-[10px] font-black uppercase tracking-widest text-[#555] hover:border-brand hover:text-brand transition-all">
                View All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {featured.map(p => (
                <Link key={p.id} href={`/shop/${p.id}`} className="group bg-[#F7F7F7] rounded-2xl overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#888]">{p.brand}</p>
                    <p className="text-xs font-black text-[#111] uppercase tracking-tight line-clamp-1">{p.name}</p>
                    <p className="text-sm font-black text-brand mt-1">₹{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SELLER CTA — full bleed ───────────────────────────────── */}
      <section className="w-full bg-[#111]">
        <div className="px-4 sm:px-8 lg:px-12 xl:px-16 py-12 max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand mb-2">For Brands & Designers</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">
              Sell on TryAndFit
            </h2>
            <p className="text-sm text-white/50 font-medium mt-1">
              Give your customers AI try-on and increase conversions by up to 40%.
            </p>
          </div>
          <Link href="/seller/apply">
            <button className="shrink-0 h-12 px-8 rounded-xl bg-brand text-white text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:bg-brand/90 transition-colors shadow-xl shadow-brand/20">
              Start Selling <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}

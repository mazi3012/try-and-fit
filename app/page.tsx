"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Sparkles, ShoppingBag, ArrowRight, Lock, ShieldCheck, Wand2, Bot, Zap, Star, TrendingUp, Camera } from "lucide-react";
import { PremiumButton } from "@/components/ui/premium-button";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, [supabase]);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center overflow-x-hidden bg-white min-h-screen">

      {/* ─── HERO ─── */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-6 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-brand/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-brand">
            <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
            AI Fashion · Try Before Buy
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-[#111111] leading-[0.9] uppercase">
            TRY IT.<br />
            <span className="text-brand">BUY IT.</span><br />
            OWN IT.
          </h1>

          <p className="text-base sm:text-lg text-[#888888] leading-relaxed font-medium max-w-md">
            India's first AI-powered try-on fashion store. Visualize any outfit on yourself before you buy — powered by Gemini AI.
          </p>

          {!user ? (
            <div className="flex flex-col gap-3 max-w-sm">
              <PremiumButton size="lg" className="w-full h-14 text-sm" onClick={handleSignIn} icon={<ArrowRight size={18} />}>
                Sign In with Google
              </PremiumButton>
              <p className="text-[10px] text-center font-bold uppercase tracking-widest text-[#aaa]">
                Free to join · 50k+ fashion lovers
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/shop">
                <PremiumButton size="lg" className="h-14 px-8" icon={<ShoppingBag size={18} />}>
                  Shop Now
                </PremiumButton>
              </Link>
              <Link href="/try-on">
                <PremiumButton variant="outline" size="lg" className="h-14 px-8" icon={<Wand2 size={18} />}>
                  Try-On Studio
                </PremiumButton>
              </Link>
            </div>
          )}

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { label: "10s AI Render", icon: <Zap size={12} /> },
              { label: "Zero Risk Returns", icon: <ShieldCheck size={12} /> },
              { label: "Curated Brands", icon: <Star size={12} /> },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#888]">
                <span className="text-brand">{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>
        </div>

        {/* Hero Images Panel */}
        <div className="relative hidden lg:grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4 pt-12">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400" className="rounded-2xl object-cover aspect-[4/5] w-full shadow-xl" alt="fashion model" />
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400" className="rounded-2xl object-cover aspect-[4/5] w-full shadow-xl" alt="fashion model 2" />
          </div>
          <div className="flex flex-col gap-4">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400" className="rounded-2xl object-cover aspect-[4/5] w-full shadow-xl" alt="fashion model 3" />
            <img src="https://images.unsplash.com/photo-1539109132304-39155021aa24?auto=format&fit=crop&q=80&w=400" className="rounded-2xl object-cover aspect-[4/5] w-full shadow-xl" alt="fashion model 4" />
          </div>
          {/* Floating label */}
          <div className="absolute top-6 -left-4 bg-white rounded-2xl px-4 py-2 shadow-xl border border-black/5 flex items-center gap-2">
            <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#111]">AI Try-On Live</span>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="w-full bg-[#F7F7F7] border-t border-black/5 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand">Try Before You Buy</span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-[#111] uppercase mt-2">
              How It <span className="text-brand">Works</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            {[
              { step: "01", icon: <Camera size={28} />, title: "Upload Your Photo", desc: "Take or upload a clear portrait of yourself." },
              { step: "02", icon: <ShoppingBag size={28} />, title: "Pick an Outfit", desc: "Browse our curated collection or paste any URL." },
              { step: "03", icon: <Sparkles size={28} />, title: "See the Magic", desc: "Our AI renders the outfit on you in under 10 seconds." },
            ].map(s => (
              <div key={s.step} className="bg-white rounded-2xl border border-black/5 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                    {s.icon}
                  </div>
                  <span className="text-4xl font-black text-black/5 italic">{s.step}</span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-[#111]">{s.title}</h3>
                <p className="text-xs text-[#888] leading-relaxed font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
          <Link href={user ? "/try-on" : "#"} onClick={!user ? handleSignIn : undefined}>
            <PremiumButton size="lg" className="h-14 px-10" icon={<ArrowRight size={18} />}>
              Start Your Try-On
            </PremiumButton>
          </Link>
        </div>
      </section>

      {/* ─── MEET FRANKY AI ─── */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-black/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand flex items-center justify-center text-white">
                <Bot size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-brand">Your Personal AI Stylist</p>
                <h2 className="text-2xl font-black text-[#111] uppercase tracking-tighter">Meet Franky</h2>
              </div>
            </div>
            <p className="text-base text-[#888] leading-relaxed font-medium">
              Franky is our in-house AI stylist, trained on thousands of fashion trends. Ask Franky for style advice, size recommendations, or trending looks — get personalized answers in seconds.
            </p>
            <Link href="/advisor">
              <PremiumButton variant="outline" size="md" className="self-start h-12 px-8" icon={<Bot size={16} />}>
                Chat with Franky
              </PremiumButton>
            </Link>
          </div>
          <div className="bg-[#F7F7F7] rounded-3xl border border-black/5 p-6 flex flex-col gap-4 shadow-sm">
            {/* Mock Chat Preview */}
            {[
              { from: "user", text: "I need an outfit for a wedding this weekend." },
              { from: "ai", text: "Absolutely! For a wedding, I'd suggest our Midnight Blue Sherwani for a classic look, or the Rose Anarkali for something contemporary. Both are in stock. Want me to pull them up for an instant try-on?" },
            ].map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-[10px] font-black ${m.from === "ai" ? "bg-brand text-white" : "bg-black/10 text-[#111]"}`}>
                  {m.from === "ai" ? "F" : "U"}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed font-medium ${m.from === "ai" ? "bg-white border border-black/5 text-[#111] shadow-sm" : "bg-brand text-white"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="w-full bg-brand py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
          {[
            { val: "50K+", label: "Happy Shoppers" },
            { val: "1000+", label: "Styles Available" },
            { val: "0%", label: "Return Rate" },
            { val: "10s", label: "AI Render Time" },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl sm:text-4xl font-black tracking-tighter">{s.val}</span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="w-full py-12 px-6 border-t border-black/5 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-black tracking-tighter text-[#111] uppercase">TRYANDFIT<span className="text-brand">.</span></h3>
            <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-[#888]">
              <Link href="/shop" className="hover:text-brand transition-colors">Shop</Link>
              <Link href="/try-on" className="hover:text-brand transition-colors">Studio</Link>
              <Link href="/advisor" className="hover:text-brand transition-colors">Style AI</Link>
              <Link href="/wardrobe" className="hover:text-brand transition-colors">Wardrobe</Link>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex gap-3">
              <div className="h-9 w-9 rounded-full border border-black/10 flex items-center justify-center text-[#888] hover:bg-[#111] hover:text-white transition-all cursor-pointer">
                <Lock size={14} />
              </div>
              <div className="h-9 w-9 rounded-full border border-black/10 flex items-center justify-center text-[#888] hover:bg-[#111] hover:text-white transition-all cursor-pointer">
                <ShieldCheck size={14} />
              </div>
              <div className="h-9 w-9 rounded-full border border-black/10 flex items-center justify-center text-[#888] hover:bg-[#111] hover:text-white transition-all cursor-pointer">
                <TrendingUp size={14} />
              </div>
            </div>
            <p className="text-[9px] font-bold text-[#bbb] uppercase tracking-widest">© 2026 Franky Fashion Core</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

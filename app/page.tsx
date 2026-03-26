"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Sparkles, ShoppingBag, ArrowRight, Lock, ShieldCheck, Wand2, Bot, Zap, Shirt, Heart, Star } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

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
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center overflow-x-hidden bg-white">
      {/* Dynamic Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,77,77,0.05),transparent_70%)]" />
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-brand/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="group mb-8 inline-flex items-center gap-3 rounded-full border border-black/5 bg-white px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-black shadow-xl shadow-black/5 transition-all hover:border-brand/30">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand"></span>
          </div>
          VIRTUAL FASHION REVOLUTION 2.0
        </div>
        
        <h1 className="text-[14vw] sm:text-[12vw] font-black tracking-tighter text-[#0A0A0A] leading-[0.85] uppercase italic mb-10">
          TRY IT. <span className="text-brand">GET IT.</span> <br /> 
          <span className="text-accent underline decoration-accent/20">OWN IT.</span>
        </h1>
        
        <p className="max-w-xl text-lg text-muted leading-relaxed sm:text-xl font-bold mb-12">
          The future of shopping is here. Don't just browse — <span className="text-black">visualize your style</span> with AI-powered realism.
        </p>

        {!user ? (
          <div className="w-full max-w-sm">
            <PremiumButton size="lg" className="w-full h-18 text-base shadow-2xl shadow-brand/20 bg-black text-white hover:bg-black/90" onClick={handleSignIn} icon={<ArrowRight size={20} />}>
               SIGN IN TO ENTER STORE
            </PremiumButton>
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-muted/60">
               Join 50k+ fashion early adopters
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/shop">
              <PremiumButton size="lg" className="h-18 px-12 text-lg shadow-2xl shadow-brand/20" icon={<ShoppingBag className="h-6 w-6" />}>
                SHOP COLLECTION
              </PremiumButton>
            </Link>
            <Link href="/try-on">
              <PremiumButton variant="outline" size="lg" className="h-18 px-12 text-lg border-2" icon={<Wand2 className="h-6 w-6" />}>
                OPEN STUDIO
              </PremiumButton>
            </Link>
          </div>
        )}
      </section>

      {/* Structured Interactive Grid */}
      <section className="w-full max-w-7xl px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
         <div className="flex flex-col gap-8 text-left">
            <div className="flex items-center gap-3 text-brand">
               <Zap size={24} fill="currentColor" />
               <span className="text-xs font-black uppercase tracking-[0.3em]">Technical Excellence</span>
            </div>
            <h2 className="text-5xl sm:text-7xl font-black text-black leading-none uppercase tracking-tighter">
               SMARTER <br /> <span className="text-brand">SHOPPING.</span>
            </h2>
            <p className="text-lg text-muted font-medium max-w-md">
               Our proprietary AI engine maps garments to your physical form with pixel-perfect accuracy. No more returns, just pure confidence.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
               <GlassCard className="p-6 border-black/5 shadow-none bg-accent/5">
                  <Heart className="text-accent mb-3" size={20} />
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1">98% Accuracy</p>
                  <p className="text-[9px] text-muted leading-tight font-bold">In fit & drape simulation</p>
               </GlassCard>
               <GlassCard className="p-6 border-black/5 shadow-none bg-brand/5">
                  <Star className="text-brand mb-3" size={18} />
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1">Instant Results</p>
                  <p className="text-[9px] text-muted leading-tight font-bold">Rendered in under 10 seconds</p>
               </GlassCard>
            </div>
         </div>

         <div className="relative">
            <div className="absolute -inset-4 bg-accent/20 blur-3xl opacity-30 rounded-full" />
            <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-4 pt-10">
                  <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400" className="rounded-2xl border-4 border-white shadow-2xl" />
                  <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400" className="rounded-2xl border-4 border-white shadow-2xl" />
               </div>
               <div className="flex flex-col gap-4">
                  <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400" className="rounded-2xl border-4 border-white shadow-2xl" />
                  <img src="https://images.unsplash.com/photo-1539109132304-39155021aa24?auto=format&fit=crop&q=80&w=400" className="rounded-2xl border-4 border-white shadow-2xl" />
               </div>
            </div>
         </div>
      </section>

      {/* Style AI Preview */}
      <section className="w-full bg-[#0A0A0A] py-32 text-center text-white overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent" />
         <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-10">
            <div className="h-16 w-16 rounded-full bg-brand flex items-center justify-center text-white shadow-3xl shadow-brand/20">
               <Bot size={32} />
            </div>
            <h2 className="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter">
               MEET <span className="text-brand">FRANKY.</span>
            </h2>
            <p className="text-xl text-muted font-medium max-w-2xl px-6">
               Your personal AI stylist who knows every thread in our collection. From date nights to boardrooms, Franky finds your perfect fit.
            </p>
            <Link href="/advisor">
               <PremiumButton size="lg" className="h-16 px-12 bg-white text-black hover:bg-white/90 shadow-xl shadow-brand/5">
                  CHAT WITH FRANKY
               </PremiumButton>
            </Link>
         </div>
         {/* Marquee Background */}
         <div className="absolute bottom-10 left-0 w-full opacity-5 pointer-events-none select-none">
            <h2 className="text-[20vw] font-black tracking-tighter leading-none text-white whitespace-nowrap">
               AI STYLE ADVISOR • AI STYLE ADVISOR • AI STYLE ADVISOR
            </h2>
         </div>
      </section>

      {/* Footer Branding */}
      <footer className="w-full py-20 px-6 border-t border-black/5 bg-[#F8F9FA]">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="flex flex-col gap-6">
               <h3 className="text-4xl font-black tracking-tighter text-black uppercase italic">TRYANDFIT<span className="text-brand">.</span></h3>
               <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-[#0A0A0A]">
                  <Link href="/shop" className="hover:text-brand transition-colors">Shop</Link>
                  <Link href="/try-on" className="hover:text-brand transition-colors">Studio</Link>
                  <Link href="/advisor" className="hover:text-brand transition-colors">Style AI</Link>
               </div>
            </div>
            <div className="text-right flex flex-col items-end gap-4">
               <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full border border-black/5 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all cursor-pointer">
                     <Lock size={16} />
                  </div>
                  <div className="h-10 w-10 rounded-full border border-black/5 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all cursor-pointer">
                     <ShieldCheck size={16} />
                  </div>
               </div>
               <p className="text-[9px] font-bold text-muted uppercase tracking-[0.2em]">© 2026 Franky Fashion Core. All Rights Reserved.</p>
            </div>
         </div>
      </footer>
    </div>
  );
}

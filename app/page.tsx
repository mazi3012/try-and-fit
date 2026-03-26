"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Sparkles, Shirt, Zap, ShoppingBag, ArrowRight, Lock, ShieldCheck, Wand2, Bot } from "lucide-react";
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
        <div className="flex h-screen items-center justify-center bg-black">
           <div className="h-12 w-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
     );
  }

  return (
    <div className="flex flex-col items-center space-y-32 py-10 pb-24 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center px-4 w-full max-w-5xl">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="h-3 w-3" />
          The CTO Vision: AI Integrated Commerce
        </div>
        
        <h1 className="text-6xl font-black tracking-tighter text-cream sm:text-8xl lg:text-9xl leading-[0.9] uppercase italic mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          TRY <span className="text-brand">BEFORE</span> <br /> 
          YOU <span className="text-white underline decoration-brand/30">BUY.</span>
        </h1>
        
        <p className="max-w-2xl text-lg text-muted/80 leading-relaxed sm:text-2xl font-medium animate-in fade-in slide-in-from-top-4 duration-1000 delay-300">
          Experience the world's most advanced AI Fashion Engine. Upload your photo and see how any outfit fits <span className="text-cream font-bold">you</span> instantly.
        </p>

        {!user ? (
          <div className="mt-16 w-full max-w-md animate-in fade-in zoom-in duration-1000 delay-500">
            <GlassCard className="p-8 bg-brand/5 border-brand/20 flex flex-col gap-6 scale-110 shadow-2xl shadow-brand/10">
               <div className="flex justify-center -mt-16">
                  <div className="h-16 w-16 rounded-full bg-brand flex items-center justify-center text-white shadow-xl shadow-brand/20 animate-bounce">
                     <Lock size={24} />
                  </div>
               </div>
               <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-cream uppercase">ACCESS REQUIRED</h2>
                  <p className="text-xs text-muted font-bold tracking-tight px-4 leading-relaxed">
                     Sign in with Google to enter the Franky Fashion Studio and start your virtual try-on journey.
                  </p>
               </div>
               <PremiumButton size="lg" className="w-full h-16 text-sm" onClick={handleSignIn} icon={<ArrowRight size={20} />}>
                  Join the Fashion Elite
               </PremiumButton>
               <div className="flex items-center justify-center gap-4 text-[9px] font-black text-muted/40 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><ShieldCheck size={10} /> Secure Auth</span>
                  <span className="flex items-center gap-1"><Zap size={10} /> Instant Sync</span>
               </div>
            </GlassCard>
          </div>
        ) : (
          <div className="mt-12 flex flex-col gap-6 sm:flex-row animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <Link href="/shop" className="group">
              <PremiumButton size="lg" className="h-18 px-12 text-lg shadow-xl shadow-brand/20" icon={<ShoppingBag className="h-6 w-6" />}>
                Browse Collections
              </PremiumButton>
            </Link>
            <Link href="/try-on">
              <PremiumButton variant="outline" size="lg" className="h-18 px-12 text-lg" icon={<Sparkles className="h-6 w-6" />}>
                AI Studio
              </PremiumButton>
            </Link>
          </div>
        )}

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[150px] opacity-50" />
      </section>

      {/* Philosophy Section */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl px-6">
         {[
           {
             label: "01 / TECHNOLOGY",
             title: "AI Precision",
             desc: "Our Vertex AI core ensures your garments drape perfectly over your posture.",
             icon: <Wand2 size={24} className="text-brand" />
           },
           {
             label: "02 / CONVENIENCE",
             title: "Try & Buy",
             desc: "No more sizing guesswork. See it, try it, love it, then own it.",
             icon: <ShoppingBag size={24} className="text-accent" />
           },
           {
             label: "03 / PERSONALIZATION",
             title: "Style AI",
             desc: "Franky, our conversational fashion agent, curates looks just for you.",
             icon: <Bot size={24} className="text-brand" />
           }
         ].map(feature => (
            <div key={feature.title} className="flex flex-col gap-6 p-8 border-l border-white/5 hover:bg-white/5 transition-colors group">
               <p className="text-[10px] font-black text-muted tracking-[0.3em]">{feature.label}</p>
               <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
               </div>
               <h3 className="text-2xl font-black text-cream uppercase">{feature.title}</h3>
               <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
            </div>
         ))}
      </section>

      {/* CTA Section */}
      {user && (
        <section className="w-full max-w-5xl px-4 animate-in fade-in slide-in-from-bottom-12 duration-1000">
           <GlassCard className="flex flex-col md:flex-row items-center justify-between gap-10 p-12 text-left bg-gradient-to-br from-brand/10 to-transparent border-brand/20">
              <div className="flex flex-col gap-4">
                 <h2 className="text-4xl font-black text-cream sm:text-5xl uppercase tracking-tighter italic">Ready for <br /><span className="text-brand">The Change?</span></h2>
                 <p className="max-w-md text-muted font-medium">Step into the studio and witness the fusion of deep learning and high-fashion.</p>
              </div>
              <Link href="/try-on">
                 <PremiumButton size="lg" className="px-16 h-16 uppercase italic font-black text-lg">Enter Studio</PremiumButton>
              </Link>
           </GlassCard>
        </section>
      )}

      {/* Footer Branding */}
      <div className="pt-20 opacity-20 pointer-events-none select-none">
         <h2 className="text-[15vw] font-black tracking-tighter leading-none text-white whitespace-nowrap overflow-hidden">
            FRANKY FASHION • TRY AND BUY • FRANKY FASHION • TRY AND BUY
         </h2>
      </div>
    </div>
  );
}

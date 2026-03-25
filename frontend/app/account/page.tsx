"use client";

import { useMemo, useEffect, useState } from "react";
import { SectionTitle } from "@/components/section-title";
import { listRecentJobs } from "@/lib/mock-api";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { User as UserIcon, LogIn, CreditCard, CheckCircle2, History, Zap, Sparkles, Shirt } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [supabase.auth]);

  const jobs = useMemo(() => listRecentJobs(), []);
  const completedCount = jobs.filter((job) => job.status === "completed").length;

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
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        <p className="text-sm font-medium text-muted">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <section className="flex flex-col items-center justify-center space-y-8 py-20 text-center">
        <div className="relative">
           <div className="absolute inset-0 bg-brand/20 blur-3xl rounded-full" />
           <GlassCard className="relative p-12 max-w-lg border-brand/20">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                 <UserIcon className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-black text-white">Your Wardrobe Awaits</h1>
              <p className="mt-4 text-muted leading-relaxed">
                Unlock the full power of TryAndFit AI by signing in. Save your creations, track your history, and manage your virtual garment collection.
              </p>
              <PremiumButton onClick={handleSignIn} size="lg" className="mt-8 w-full" icon={<LogIn className="h-5 w-5" />}>
                Continue with Google
              </PremiumButton>
           </GlassCard>
        </div>
      </section>
    );
  }

  const stats = [
    { label: "Account Plan", value: "Premium Early", icon: <Zap className="h-4 w-4 text-brand" /> },
    { label: "Daily Credits", value: "Unlimited", icon: <CreditCard className="h-4 w-4 text-accent" /> },
    { label: "Completed Looks", value: completedCount.toString(), icon: <CheckCircle2 className="h-4 w-4 text-brand" /> },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-10 py-10">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
           <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted">
              Member Portal
           </div>
           <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Dashboard</h1>
        </div>
        
        <GlassCard className="flex items-center gap-4 p-4 border-white/10">
          <div className="relative">
            {user.user_metadata?.avatar_url ? (
              <Image
                src={user.user_metadata.avatar_url}
                alt="Profile"
                width={56}
                height={56}
                className="rounded-full border-2 border-brand"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/20 text-brand border-2 border-brand/50">
                <UserIcon className="h-6 w-6" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white ring-2 ring-background">
               <Sparkles className="h-3 w-3" />
            </div>
          </div>
          <div>
            <p className="text-lg font-black text-white leading-tight">{user.user_metadata?.full_name || "Style Enthusiast"}</p>
            <p className="text-xs font-medium text-muted">{user.email}</p>
          </div>
        </GlassCard>
      </header>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <GlassCard key={stat.label} className="space-y-3 p-6 border-white/5">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black uppercase tracking-widest text-muted">{stat.label}</span>
               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">{stat.icon}</div>
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
         {/* Usage History */}
         <GlassCard className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <History className="h-4 w-4" />
               </div>
               <h3 className="text-xl font-bold">Activity Feed</h3>
            </div>
            
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                 <History className="mb-2 h-10 w-10 text-muted" />
                 <p className="text-sm font-medium">No activity yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="group flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-5 py-4 transition-all hover:bg-white/10">
                    <div className="flex items-center gap-4">
                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                          <Shirt className="h-5 w-5 text-muted opacity-50" />
                       </div>
                       <div>
                          <p className="text-xs font-black text-white uppercase tracking-tighter">AI Generation</p>
                          <p className="text-[10px] font-medium text-muted">ID: {job.id.slice(0, 8)}...</p>
                       </div>
                    </div>
                    <div className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                      job.status === 'completed' ? "bg-green-500/10 text-green-400" : "bg-brand/10 text-brand"
                    )}>
                       {job.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
         </GlassCard>

         {/* Pro Tips / Sidebar */}
         <div className="space-y-6">
            <GlassCard className="bg-gradient-to-br from-accent/20 to-transparent border-accent/20">
               <h4 className="text-sm font-black uppercase tracking-widest text-accent">Pro Tip</h4>
               <p className="mt-3 text-sm leading-relaxed text-white/80 font-medium">
                  Try using images with solid backgrounds for even sharper AI edge detection.
               </p>
            </GlassCard>

            <GlassCard className="space-y-4">
               <h4 className="text-sm font-black uppercase tracking-widest text-muted">Storage Usage</h4>
               <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-[15%] bg-brand" />
               </div>
               <p className="text-[10px] font-bold text-muted">0.1 GB of 1.0 GB used</p>
            </GlassCard>
         </div>
      </div>
    </div>
  );
}

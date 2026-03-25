"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, Loader2, CheckCircle2, Cpu, Zap, Wand2 } from "lucide-react";
import { getTryOnJob } from "@/lib/supabase-api";
import { GlassCard } from "@/components/ui/glass-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { cn } from "@/lib/utils";
import type { TryOnJob } from "@/lib/types";

export default function ProcessingPage() {
  const params = useParams<{ jobId: string }>();
  const router = useRouter();
  const [job, setJob] = useState<TryOnJob | null>(null);

  const steps = [
    { label: "Queuing Request", icon: <Zap className="h-4 w-4" /> },
    { label: "AI Pre-processing", icon: <Cpu className="h-4 w-4" /> },
    { label: "Gemini 3.1 Synthesis", icon: <Sparkles className="h-4 w-4" /> },
    { label: "Finalizing Render", icon: <Wand2 className="h-4 w-4" /> },
  ];

  const currentStepIndex = useMemo(() => {
    if (!job) return 0;
    if (job.status === "pending") return 1;
    if (job.status === "processing") return 2;
    if (job.status === "completed") return 4;
    return 0;
  }, [job]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    const poll = async () => {
      try {
        const current = await getTryOnJob(params.jobId);
        if (!current) return;
        setJob(current);
        if (current.status === "completed") {
          router.push(`/result/${params.jobId}`);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    poll();
    timer = setInterval(poll, 2500);

    return () => clearInterval(timer);
  }, [params.jobId, router]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center space-y-10 py-20 text-center">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-brand/20 blur-2xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[32px] bg-brand text-white shadow-2xl">
          <Sparkles className="h-10 w-10 animate-pulse" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tight text-gradient">Magic is happening...</h1>
        <p className="max-w-md text-muted">
          Our specialized AI is merging your outfit. This usually takes around 15-25 seconds for a high-fidelity result.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {steps.map((step, i) => {
          const isCompleted = i < currentStepIndex;
          const isActive = i === currentStepIndex;

          return (
            <div
              key={step.label}
              className={cn(
                "flex items-center gap-4 rounded-2xl border px-5 py-3 transition-all duration-500",
                isCompleted ? "border-brand/20 bg-brand/5 opacity-60" : 
                isActive ? "border-brand bg-brand/10 scale-[1.02] shadow-sm" : 
                "border-white/5 bg-white/5 opacity-30"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                isCompleted ? "bg-brand text-white" : isActive ? "bg-brand/20 text-brand" : "bg-white/10 text-muted"
              )}>
                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : isActive ? <Loader2 className="h-4 w-4 animate-spin" /> : step.icon}
              </div>
              <span className={cn("text-sm font-bold", isActive ? "text-white" : "text-muted")}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {job?.status === "failed" && (
        <GlassCard className="border-red-500/20 bg-red-500/10 text-left">
           <h3 className="text-sm font-bold text-red-400">Generation Failed</h3>
           <p className="mt-1 text-xs text-red-300 opacity-80">{job.errorMessage || "An unexpected error occurred. Please try again."}</p>
           <Link href="/try-on" className="mt-4 inline-block text-xs font-bold text-red-400 underline decoration-red-400/30 underline-offset-4 hover:text-red-300">
             Try another photo
           </Link>
        </GlassCard>
      )}

      <div className="pt-6">
         <Link href="/wardrobe" className="text-xs font-bold text-muted hover:text-white transition-colors">
            Check recent history
         </Link>
      </div>
    </div>
  );
}

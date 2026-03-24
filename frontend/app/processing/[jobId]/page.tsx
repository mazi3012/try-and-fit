"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SectionTitle } from "@/components/section-title";
import { getTryOnJob } from "@/lib/mock-api";
import type { TryOnJob } from "@/lib/types";

export default function ProcessingPage() {
  const params = useParams<{ jobId: string }>();
  const router = useRouter();
  const [job, setJob] = useState<TryOnJob | null>(null);

  const steps = useMemo(() => {
    if (!job) return ["Queued", "Pre-processing", "AI try-on", "Finalizing"];
    if (job.status === "pending") return ["Queued", "Pre-processing", "AI try-on", "Finalizing"];
    if (job.status === "processing") return ["Completed queue", "Pre-processing", "AI try-on", "Finalizing"];
    return ["Completed queue", "Pre-processing", "AI try-on", "Finalizing"];
  }, [job]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    const poll = async () => {
      const current = await getTryOnJob(params.jobId);
      setJob(current);
      if (current?.status === "completed") {
        router.push(`/result/${params.jobId}`);
      }
    };

    poll();
    timer = setInterval(poll, 2000);

    return () => clearInterval(timer);
  }, [params.jobId, router]);

  if (!job) {
    return (
      <section className="space-y-4">
        <SectionTitle title="Preparing your try-on" subtitle="Loading job details..." />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <SectionTitle
        title="Processing Your Try-On"
        subtitle="We are generating your virtual outfit. This usually takes 15–30 seconds."
      />

      <article className="card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-3 w-3 animate-pulse rounded-full bg-brand" />
          <p className="text-sm font-medium capitalize">Status: {job.status}</p>
        </div>

        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-light text-xs font-semibold text-brand">
                {i + 1}
              </span>
              <span className="text-sm">{step}</span>
            </div>
          ))}
        </div>
      </article>

      <div className="flex flex-wrap gap-3">
        <Link href="/try-on" className="btn-outline rounded-xl px-4 py-2 text-sm font-medium">
          Start new try-on
        </Link>
      </div>
    </section>
  );
}

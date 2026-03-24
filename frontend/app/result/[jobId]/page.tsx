"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/section-title";
import { getTryOnJob, saveWardrobeFromJob, submitFeedback } from "@/lib/mock-api";
import type { TryOnJob } from "@/lib/types";

export default function ResultPage() {
  const params = useParams<{ jobId: string }>();
  const [job, setJob] = useState<TryOnJob | null>(null);
  const [saved, setSaved] = useState(false);
  const [rating, setRating] = useState(4);

  useEffect(() => {
    getTryOnJob(params.jobId).then(setJob);
  }, [params.jobId]);

  if (!job) {
    return <SectionTitle title="Result not found" subtitle="This job may have expired." />;
  }

  const onSave = () => {
    if (!job) return;
    saveWardrobeFromJob(job);
    setSaved(true);
  };

  const onShare = async () => {
    const shareUrl = `${window.location.origin}/result/${job.id}`;
    await navigator.clipboard.writeText(shareUrl);
    alert("Share link copied.");
  };

  const onDownload = () => {
    if (!job.resultImage) return;
    const link = document.createElement("a");
    link.href = job.resultImage;
    link.download = `tryandfit-${job.id}.jpg`;
    link.click();
  };

  const onFeedback = (liked?: boolean) => {
    submitFeedback({
      jobId: job.id,
      rating,
      liked,
    });
    alert("Thanks for your feedback!");
  };

  return (
    <section className="space-y-6">
      <SectionTitle title="Your Try-On Result" subtitle="Compare, save, and share your look." />

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="card p-4">
          <h2 className="mb-2 text-sm font-semibold text-muted">Original photo</h2>
          <img src={job.userImage} alt="Original" className="h-[420px] w-full rounded-xl object-cover" />
        </article>
        <article className="card p-4">
          <h2 className="mb-2 text-sm font-semibold text-muted">Try-on result</h2>
          <img
            src={job.resultImage || job.outfitImage}
            alt="Try-on"
            className="h-[420px] w-full rounded-xl object-cover"
          />
        </article>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={onSave} className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold" type="button">
          {saved ? "Saved" : "Save to Wardrobe"}
        </button>
        <button onClick={onDownload} className="btn-outline rounded-xl px-4 py-2 text-sm font-medium" type="button">
          Download
        </button>
        <button onClick={onShare} className="btn-outline rounded-xl px-4 py-2 text-sm font-medium" type="button">
          Share
        </button>
        {job.buyUrl ? (
          <a
            href={job.buyUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-outline rounded-xl px-4 py-2 text-sm font-medium"
          >
            Buy Product
          </a>
        ) : null}
      </div>

      <article className="card p-5">
        <h3 className="text-sm font-semibold">Rate Quality</h3>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => setRating(value)}
              className={`rounded-lg px-3 py-1 text-sm ${
                value <= rating ? "bg-brand text-white" : "btn-outline"
              }`}
            >
              {value}
            </button>
          ))}
          <button type="button" onClick={() => onFeedback(true)} className="btn-outline rounded-lg px-3 py-1 text-sm">
            👍
          </button>
          <button type="button" onClick={() => onFeedback(false)} className="btn-outline rounded-lg px-3 py-1 text-sm">
            👎
          </button>
        </div>
      </article>

      <Link href="/try-on" className="inline-flex rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white">
        Try another outfit
      </Link>
    </section>
  );
}

"use client";

import { useMemo } from "react";
import { SectionTitle } from "@/components/section-title";
import { listRecentJobs } from "@/lib/mock-api";

export default function AccountPage() {
  const jobs = useMemo(() => listRecentJobs(), []);
  const completed = jobs.filter((job) => job.status === "completed").length;

  return (
    <section className="space-y-6">
      <SectionTitle
        title="Account & Usage"
        subtitle="MVP account dashboard with credits and try-on history snapshot."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="card p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Plan</p>
          <p className="mt-2 text-xl font-bold">Free</p>
        </article>
        <article className="card p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Daily credits left</p>
          <p className="mt-2 text-xl font-bold">3</p>
        </article>
        <article className="card p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Completed try-ons</p>
          <p className="mt-2 text-xl font-bold">{completed}</p>
        </article>
      </div>

      <article className="card p-5">
        <h2 className="text-sm font-semibold">Recent Jobs</h2>
        {jobs.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No jobs yet. Start your first try-on.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {jobs.slice(0, 8).map((job) => (
              <div key={job.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-xs sm:text-sm">
                <span>{job.id}</span>
                <span className="capitalize text-muted">{job.status}</span>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}

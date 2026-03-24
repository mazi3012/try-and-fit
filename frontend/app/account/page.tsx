"use client";

import { useMemo, useEffect, useState } from "react";
import { SectionTitle } from "@/components/section-title";
import { listRecentJobs } from "@/lib/mock-api";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
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
  const completed = jobs.filter((job) => job.status === "completed").length;

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
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <section className="flex flex-col items-center justify-center space-y-6 py-20 text-center">
        <div className="rounded-2xl bg-slate-50 p-8 sm:p-12">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Your Wardrobe Awaits</h1>
          <p className="mt-4 max-w-md text-slate-600">
            Sign in with Google to save your try-ons, manage your wardrobe, and view your account details.
          </p>
          <button
            onClick={handleSignIn}
            className="mt-8 rounded-full bg-brand px-8 py-3 text-lg font-semibold text-white transition hover:bg-brand/90"
          >
            Sign in with Google
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle
          title="Account & Usage"
          subtitle="MVP account dashboard with credits and try-on history snapshot."
        />
        <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-4 shadow-sm">
          {user.user_metadata?.avatar_url && (
            <Image
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata?.full_name || "User"}
              width={48}
              height={48}
              className="rounded-full border border-slate-100"
            />
          )}
          <div>
            <p className="font-bold text-slate-900">{user.user_metadata?.full_name || user.email}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      </div>

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

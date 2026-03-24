"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionTitle } from "@/components/section-title";
import { createTryOnJob, scrapeProductImage } from "@/lib/mock-api";
import type { InputMode } from "@/lib/types";

export default function TryOnPage() {
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>("photo");
  const [personImage, setPersonImage] = useState("");
  const [outfitImage, setOutfitImage] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [buyUrl, setBuyUrl] = useState("");
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const modeLabel = useMemo(() => {
    if (mode === "product_url") return "Product URL";
    if (mode === "social_url") return "Instagram / Social URL";
    return "Photo Upload";
  }, [mode]);

  const onUploadPerson = (file: File | null) => {
    if (!file) return;
    setPersonImage(URL.createObjectURL(file));
  };

  const onUploadOutfit = (file: File | null) => {
    if (!file) return;
    setOutfitImage(URL.createObjectURL(file));
  };

  const handleScrape = async () => {
    if (!urlInput.trim()) {
      setError("Please paste a valid URL.");
      return;
    }

    setError("");
    setScrapeLoading(true);
    try {
      const result = await scrapeProductImage(urlInput.trim());
      setOutfitImage(result.outfitImage);
      setBuyUrl(result.buyUrl);
    } catch {
      setError("Unable to extract outfit image. Try another URL or upload manually.");
    } finally {
      setScrapeLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!personImage) {
      setError("Upload your photo first.");
      return;
    }

    if (!outfitImage) {
      setError("Add or extract an outfit image before generating.");
      return;
    }

    setError("");
    setSubmitLoading(true);
    try {
      const job = await createTryOnJob({
        userImage: personImage,
        outfitImage,
        sourceUrl: urlInput || undefined,
        buyUrl: buyUrl || undefined,
      });
      router.push(`/processing/${job.id}`);
    } catch {
      setError("Try-on submission failed. Please retry.");
      setSubmitLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <SectionTitle
        title="Create Your Try-On"
        subtitle="Upload your photo, choose input mode, and generate your virtual outfit preview."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="card p-5 sm:p-6">
          <h2 className="text-lg font-semibold">1) Upload Your Photo</h2>
          <p className="mt-1 text-sm text-muted">Use a clear selfie or full-body photo for best output quality.</p>
          <input
            type="file"
            accept="image/*"
            className="mt-4 block w-full text-sm"
            onChange={(e) => onUploadPerson(e.target.files?.[0] || null)}
          />

          {personImage ? (
            <img
              src={personImage}
              alt="User preview"
              className="mt-4 h-64 w-full rounded-xl object-cover"
            />
          ) : (
            <div className="mt-4 flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted">
              Your photo preview will appear here
            </div>
          )}
        </article>

        <article className="card p-5 sm:p-6">
          <h2 className="text-lg font-semibold">2) Choose Outfit Input</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { id: "photo", label: "Photo" },
              { id: "product_url", label: "Product URL" },
              { id: "social_url", label: "Social URL" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id as InputMode)}
                className={`rounded-full px-3 py-2 text-sm font-medium ${
                  mode === item.id ? "bg-brand text-white" : "btn-outline"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm font-medium">Current mode: {modeLabel}</p>

          {mode === "photo" ? (
            <div className="mt-3">
              <label className="text-sm text-muted">Upload outfit image</label>
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-sm"
                onChange={(e) => onUploadOutfit(e.target.files?.[0] || null)}
              />
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste product / social URL"
                className="input"
              />
              <button
                type="button"
                onClick={handleScrape}
                disabled={scrapeLoading}
                className="btn-outline w-full rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                {scrapeLoading ? "Extracting image..." : "Extract outfit image"}
              </button>
            </div>
          )}

          {outfitImage ? (
            <img
              src={outfitImage}
              alt="Outfit preview"
              className="mt-4 h-64 w-full rounded-xl object-cover"
            />
          ) : (
            <div className="mt-4 flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted">
              Outfit preview will appear here
            </div>
          )}
        </article>
      </div>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitLoading}
          className="btn-primary rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-50"
        >
          {submitLoading ? "Submitting..." : "Generate Try-On"}
        </button>
      </div>
    </section>
  );
}

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProfile, createTryOnJob, uploadImage, getImageUrl } from "@/lib/supabase-api";
import { getProductById } from "@/lib/ecommerce";
import { scrapeProductImage } from "@/lib/mock-api";
import { Camera, Shirt, Link as LinkIcon, Share2 as Instagram, Sparkles, Info, LogIn } from "lucide-react";
import { Dropzone } from "@/components/ui/dropzone";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import type { InputMode } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

function TryOnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<InputMode>("photo");
  const [personImage, setPersonImage] = useState("");
  const [personFile, setPersonFile] = useState<File | null>(null);
  const [outfitImage, setOutfitImage] = useState("");
  const [outfitFile, setOutfitFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [buyUrl, setBuyUrl] = useState("");
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        getProfile().then(profile => {
          if (profile?.base_avatar_url) {
            getImageUrl(profile.base_avatar_url, 'user-images').then(url => {
              setPersonImage(url);
            });
          }
        });
      }
      setAuthLoading(false);
    });
  }, [supabase]);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  useEffect(() => {
    const productId = searchParams.get("productId");
    if (productId) {
      getProductById(productId).then(product => {
        setOutfitImage(product.image_url);
        setBuyUrl(`/shop/${product.id}`);
        setMode("photo");
      }).catch(err => console.error("Failed to load pre-filled product", err));
    }
  }, [searchParams]);

  const onUploadPerson = (file: File | null) => {
    if (!file) { setPersonFile(null); setPersonImage(""); return; }
    setPersonFile(file);
    setPersonImage(URL.createObjectURL(file));
  };

  const onUploadOutfit = (file: File | null) => {
    if (!file) { setOutfitFile(null); setOutfitImage(""); return; }
    setOutfitFile(file);
    setOutfitImage(URL.createObjectURL(file));
  };

  const handleScrape = async () => {
    if (!urlInput.trim()) { setError("Please paste a valid URL."); return; }
    setError(""); setScrapeLoading(true);
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
    if (!personImage) { setError("Please upload your photo first."); return; }
    if (!outfitImage) { setError("Please add an outfit image."); return; }

    setError(""); setSubmitLoading(true);
    try {
      let personPath = personImage;
      let outfitPath = outfitImage;
      if (personFile) personPath = await uploadImage(personFile, 'user-images');
      if (outfitFile) outfitPath = await uploadImage(outfitFile, 'user-images');

      const job = await createTryOnJob({
        personImagePath: personPath,
        garmentImagePath: outfitPath,
        sourceUrl: urlInput || undefined,
        buyUrl: buyUrl || undefined,
      });

      router.push(`/processing/${job.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to start try-on. Please try again.");
      setSubmitLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl py-4 px-0 sm:px-0">
      {/* Header */}
      <header className="flex items-center justify-between mb-4 px-0">
        <div>
          <div className="flex items-center gap-2 text-brand mb-1">
            <Sparkles size={14} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">AI Powered</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-[#111] uppercase">
            Try-On <span className="text-brand">Studio</span>
          </h1>
        </div>
        <p className="text-[10px] text-[#888] font-bold uppercase tracking-tight text-right hidden sm:block max-w-[140px]">
          Portrait + Outfit = AI Magic
        </p>
      </header>

      {/* Main Grid */}
      <div className="grid gap-3 lg:grid-cols-3">
        {/* Step 1: Your Photo */}
        <div className="bg-white border border-black/5 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-[#111] flex items-center gap-1.5">
              <Camera size={14} className="text-brand" /> Your Photo
            </h2>
            <span className="text-[9px] font-black text-[#bbb] uppercase tracking-widest">Step 01</span>
          </div>
          <Dropzone
            label="Portrait"
            previewUrl={personImage}
            onFileSelect={onUploadPerson}
            className="flex-1 min-h-[200px] sm:min-h-[280px]"
          />
        </div>

        {/* Step 2: The Outfit */}
        <div className="bg-white border border-black/5 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-[#111] flex items-center gap-1.5">
              <Shirt size={14} className="text-brand" /> The Outfit
            </h2>
            <span className="text-[9px] font-black text-[#bbb] uppercase tracking-widest">Step 02</span>
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-1 rounded-xl bg-[#F7F7F7] p-1">
            {[
              { id: "photo", icon: <Camera size={13} />, label: "Upload" },
              { id: "product_url", icon: <LinkIcon size={13} />, label: "URL" },
              { id: "social_url", icon: <Instagram size={13} />, label: "Social" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setMode(item.id as InputMode)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[9px] font-black uppercase tracking-widest transition-all",
                  mode === item.id
                    ? "bg-white text-[#111] shadow-sm border border-black/5"
                    : "text-[#888] hover:text-[#555]"
                )}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col gap-2">
            {mode === "photo" ? (
              <Dropzone
                label="Outfit"
                previewUrl={outfitImage}
                onFileSelect={onUploadOutfit}
                className="flex-1 min-h-[200px] sm:min-h-[220px]"
              />
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste product link..."
                  className="input text-xs h-10"
                />
                <button
                  onClick={handleScrape}
                  disabled={scrapeLoading}
                  className="h-9 rounded-xl bg-[#111] text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand transition-colors disabled:opacity-50"
                >
                  {scrapeLoading ? "Extracting..." : "Extract Image"}
                </button>
                {outfitImage && (
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                    <img src={outfitImage} alt="Outfit" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Create Magic */}
        <div className="bg-white border border-black/5 rounded-2xl p-4 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-1.5">
            <Info size={14} className="text-brand" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-[#111]">Guide</h3>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { id: "01", title: "Upload Photo", desc: "Clear front-facing portrait." },
              { id: "02", title: "Add Outfit", desc: "Upload, URL, or from shop." },
              { id: "03", title: "AI Renders", desc: "Your look in under 10 seconds." },
            ].map(step => (
              <div key={step.id} className="flex gap-3 items-start">
                <div className="h-5 w-5 shrink-0 flex items-center justify-center rounded-full bg-brand/10 text-[8px] font-black text-brand">{step.id}</div>
                <div>
                  <h4 className="text-[10px] font-black text-[#111] uppercase tracking-tight">{step.title}</h4>
                  <p className="text-[9px] text-[#888] font-medium leading-tight">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3">
              <p className="text-[10px] font-bold text-red-500 leading-tight">{error}</p>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-2">
            {!authLoading && !user ? (
              <button
                onClick={handleSignIn}
                className="w-full h-12 rounded-xl bg-[#111] text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand transition-colors shadow-sm"
              >
                <LogIn size={15} /> Sign in to Create Magic
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitLoading || authLoading}
                className="relative w-full h-14 rounded-xl bg-brand text-white text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand/90 transition-all shadow-xl shadow-brand/20 disabled:opacity-60 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Sparkles size={16} />
                {submitLoading ? "Processing..." : "Create Magic"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TryOnPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[11px] font-black uppercase tracking-widest text-[#888] animate-pulse">
          Loading Studio...
        </div>
      </div>
    }>
      <TryOnContent />
    </Suspense>
  );
}

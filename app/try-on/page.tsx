"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SectionTitle } from "@/components/section-title";
import { createTryOnJob, uploadImage } from "@/lib/supabase-api";
import { getProductById } from "@/lib/ecommerce";
import { scrapeProductImage } from "@/lib/mock-api";
import { Camera, Shirt, Link as LinkIcon, Share2 as Instagram, Sparkles, Wand2, Info } from "lucide-react";
import { Dropzone } from "@/components/ui/dropzone";
import { PremiumButton } from "@/components/ui/premium-button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import type { InputMode } from "@/lib/types";
import type { User } from "@supabase/supabase-js";
import { LogIn } from "lucide-react";

export default function TryOnPage() {
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
      setAuthLoading(false);
    });
  }, [supabase]);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  // Handle pre-filled product from shop
  useEffect(() => {
    const productId = searchParams.get("productId");
    if (productId) {
      getProductById(productId).then(product => {
        setOutfitImage(product.image_url);
        setBuyUrl(`/shop/${product.id}`);
        setMode("photo"); // Ensure we show the image
      }).catch(err => {
        console.error("Failed to load pre-filled product", err);
      });
    }
  }, [searchParams]);

  const onUploadPerson = (file: File | null) => {
    if (!file) {
      setPersonFile(null);
      setPersonImage("");
      return;
    }
    setPersonFile(file);
    setPersonImage(URL.createObjectURL(file));
  };

  const onUploadOutfit = (file: File | null) => {
    if (!file) {
      setOutfitFile(null);
      setOutfitImage("");
      return;
    }
    setOutfitFile(file);
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
      setError("Please upload your photo first.");
      return;
    }
    if (!outfitImage) {
      setError("Please add an outfit image.");
      return;
    }

    setError("");
    setSubmitLoading(true);
    try {
      let personPath = personImage;
      let outfitPath = outfitImage;

      if (personFile) {
        personPath = await uploadImage(personFile, 'user-images');
      }
      if (outfitFile) {
        outfitPath = await uploadImage(outfitFile, 'user-images');
      }

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
    <div className="mx-auto max-w-6xl h-screen flex flex-col p-2 lg:p-4 overflow-hidden">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-2 shrink-0">
        <div className="text-left">
          <div className="mb-0.5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand">
            <Sparkles className="h-2 w-2" />
            AI Powered
          </div>
        <h1 className="text-xl font-black tracking-tight text-black leading-none uppercase italic">Try-On <span className="text-brand">Studio</span></h1>
        </div>
        <p className="max-w-xs text-right text-[10px] text-muted font-bold uppercase tracking-tight hidden md:block">
          Portrait + Outfit = Professional AI Synthesis.
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-3 flex-1 min-h-0 overflow-hidden">
        {/* Step 1: User Photo */}
        <GlassCard className="flex flex-col gap-2 p-3 min-h-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold flex items-center gap-1.5">
              <Camera className="h-3.5 w-3.5 text-brand" />
              Your Photo
            </h2>
            <span className="text-[9px] font-bold text-muted uppercase">Step 1</span>
          </div>
          <Dropzone
            label="Portrait"
            previewUrl={personImage}
            onFileSelect={onUploadPerson}
            className="flex-1 min-h-0 aspect-[1/1] sm:aspect-[4/5]"
          />
        </GlassCard>

        {/* Step 2: Outfit */}
        <GlassCard className="flex flex-col gap-2 p-3 min-h-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold flex items-center gap-1.5">
              <Shirt className="h-3.5 w-3.5 text-accent" />
              The Outfit
            </h2>
            <span className="text-[9px] font-bold text-muted uppercase">Step 2</span>
          </div>
          
          <div className="flex gap-1 rounded-lg bg-black/5 p-1 shrink-0">
            {[
              { id: "photo", icon: <Camera className="h-3 w-3" /> },
              { id: "product_url", icon: <LinkIcon className="h-3 w-3" /> },
              { id: "social_url", icon: <Instagram className="h-3 w-3" /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setMode(item.id as InputMode)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 transition-all text-[10px] font-black uppercase tracking-widest",
                  mode === item.id ? "bg-black text-white shadow-sm" : "text-muted hover:text-black hover:bg-black/5"
                )}
              >
                {item.icon}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0 flex flex-col gap-2">
            {mode === "photo" ? (
              <Dropzone
                label="Outfit"
                previewUrl={outfitImage}
                onFileSelect={onUploadOutfit}
                className="flex-1 min-h-0 aspect-[4/5]"
              />
            ) : (
              <div className="flex h-full flex-col gap-2 overflow-auto pr-1">
                 <input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste link..."
                    className="input py-2 text-xs"
                  />
                 <PremiumButton 
                   variant="outline" 
                   className="w-full h-8 text-xs" 
                   onClick={handleScrape}
                   loading={scrapeLoading}
                 >
                   Extract
                 </PremiumButton>
                 {outfitImage && (
                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl shrink-0">
                       <img src={outfitImage} alt="Outfit" className="h-full w-full object-cover" />
                    </div>
                 )}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Action & Info (Step 3) */}
        <div className="flex flex-col gap-3 min-h-0">
          <GlassCard className="flex flex-col gap-3 p-3 flex-1 min-h-0 overflow-auto">
            <h3 className="text-xs font-bold flex items-center gap-1.5">
               <Info className="h-3.5 w-3.5 text-brand" />
               Guide
            </h3>
            <div className="space-y-2">
               {[
                 { id: "01", title: "Photo", desc: "Clear portrait." },
                 { id: "02", title: "Outfit", desc: "URL or File." },
                 { id: "03", title: "Magic", desc: "AI render." }
               ].map(step => (
                 <div key={step.id} className="flex gap-2">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/20 text-[8px] font-black text-brand">{step.id}</div>
                    <div>
                       <h4 className="text-[9px] font-bold">{step.title}</h4>
                       <p className="text-[8px] text-muted leading-tight">{step.desc}</p>
                    </div>
                 </div>
               ))}
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400">
                <p className="text-[8px] font-medium leading-tight">{error}</p>
              </div>
            )}

            <div className="mt-auto pt-2 flex flex-col gap-2">
              {!authLoading && !user ? (
                <PremiumButton 
                  size="lg" 
                  className="w-full h-12 text-sm bg-black text-white hover:bg-black/90"
                  onClick={handleSignIn}
                  icon={<LogIn className="h-4 w-4" />}
                >
                  Sign in to Create Magic
                </PremiumButton>
              ) : (
                <PremiumButton 
                  size="lg" 
                  className="w-full h-12 text-xs overflow-hidden group shadow-xl shadow-brand/20"
                  onClick={handleSubmit}
                  loading={submitLoading || authLoading}
                  icon={<Sparkles className="h-4 w-4" />}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  Create Magic
                </PremiumButton>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Camera, Phone, User as UserIcon, ArrowRight, Check } from "lucide-react";
import { Dropzone } from "@/components/ui/dropzone";
import { updateProfile, uploadImage, getProfile } from "@/lib/supabase-api";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  
  // Step 1 data
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Step 2 data
  const [avatarImage, setAvatarImage] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile().then(profile => {
      if (profile?.onboarded) {
        router.replace("/");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  const handleNext = async () => {
    if (step === 1) {
      if (!fullName.trim() || !phone.trim()) {
        setError("Please fill in your name and phone number.");
        return;
      }
      setError("");
      setStep(2);
    } else {
      if (!avatarImage) {
        setError("Please upload a photo to continue.");
        return;
      }
      
      setLoading(true);
      setError("");
      
      try {
        let avatarUrl = "";
        if (avatarFile) {
          avatarUrl = await uploadImage(avatarFile, 'user-images');
        }
        
        await updateProfile({
          full_name: fullName,
          phone: phone,
          base_avatar_url: avatarUrl,
          onboarded: true
        });
        
        router.push("/");
      } catch (err: any) {
        setError(err.message || "Something went wrong. Please try again.");
        setLoading(false);
      }
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-black/5 rounded-[32px] p-8 shadow-xl shadow-black/[0.02]">
        
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-brand">
            <Sparkles size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Welcome</span>
          </div>
          <div className="flex gap-1.5">
            <div className={cn("h-1.5 w-6 rounded-full transition-all duration-500", step >= 1 ? "bg-brand" : "bg-black/5")} />
            <div className={cn("h-1.5 w-6 rounded-full transition-all duration-500", step >= 2 ? "bg-brand" : "bg-black/5")} />
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[#111] uppercase leading-none">
                Let's get <br/><span className="text-brand">Started</span>
              </h1>
              <p className="text-sm text-[#888] font-medium mt-2">Personalize your shop experience</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#111] flex items-center gap-2">
                  <UserIcon size={12} className="text-brand" /> Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full h-12 bg-[#F7F7F7] border border-black/5 rounded-2xl px-4 text-sm font-bold placeholder:text-[#ccc] focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#111] flex items-center gap-2">
                  <Phone size={12} className="text-brand" /> Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full h-12 bg-[#F7F7F7] border border-black/5 rounded-2xl px-4 text-sm font-bold placeholder:text-[#ccc] focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand transition-all"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[#111] uppercase leading-none">
                Set your <br/><span className="text-brand">Avatar</span>
              </h1>
              <p className="text-sm text-[#888] font-medium mt-2">This photo will be used for your AI Try-Ons</p>
            </div>

            <div className="aspect-[4/5] w-full">
              <Dropzone
                label="Portrait"
                previewUrl={avatarImage}
                onFileSelect={(file) => {
                  if (file) {
                    setAvatarFile(file);
                    setAvatarImage(URL.createObjectURL(file));
                  } else {
                    setAvatarFile(null);
                    setAvatarImage("");
                  }
                }}
                className="h-full rounded-2xl"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-[10px] font-bold text-red-500 text-center leading-tight uppercase tracking-tight">{error}</p>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={loading}
          className="w-full h-14 bg-brand text-white rounded-2xl mt-8 flex items-center justify-center gap-2 font-black uppercase tracking-widest hover:bg-brand/90 transition-all shadow-xl shadow-brand/20 disabled:opacity-50"
        >
          {loading ? "Saving..." : (
            <>
              {step === 1 ? "Next Step" : "Complete Onboarding"} 
              {step === 1 ? <ArrowRight size={18} /> : <Check size={18} />}
            </>
          )}
        </button>

        <p className="text-[9px] text-center text-[#bbb] font-black uppercase tracking-[0.2em] mt-6">
          TryAndFit &copy; 2026 AI Fashion
        </p>
      </div>
    </div>
  );
}

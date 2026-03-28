"use client";

import { useState } from "react";
import { Sparkles, LogIn, Globe, ArrowRight, ShieldCheck } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white border border-black/5 p-10 rounded-[40px] shadow-sm">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-brand/10 rounded-3xl flex items-center justify-center text-brand mb-6">
            <Sparkles size={32} />
          </div>
          <h2 className="text-3xl font-black text-[#111] uppercase tracking-tighter">
            Welcome <span className="text-brand">Back</span>
          </h2>
          <p className="mt-2 text-sm text-[#888] font-medium tracking-tight uppercase">
            Sign in to start your AI try-on journey
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#111] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-brand transition-all shadow-xl shadow-black/10 disabled:opacity-50 group"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />
            ) : (
              <>
                <Globe size={18} />
                Continue with Google
                <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <p className="text-[9px] text-center text-[#bbb] font-black uppercase tracking-widest px-8 leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <div className="pt-8 border-t border-black/5">
          <div className="flex items-center gap-3 text-green-600 bg-green-50/50 p-4 rounded-2xl border border-green-100/50">
            <ShieldCheck size={20} className="shrink-0" />
            <p className="text-[10px] font-bold uppercase leading-tight">
              Secure authentication powered by Supabase Auth and Google Identity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

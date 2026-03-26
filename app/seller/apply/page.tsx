"use client";

import { useState, useMemo } from "react";
import { Store, CheckCircle, Clock, XCircle, ChevronRight, Building2, Mail, Phone, Tag, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SellerApplyPage() {
  const [step, setStep] = useState<"intro" | "form" | "submitted">("intro");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    store_name: "",
    email: "",
    phone: "",
    category: "",
    description: "",
    gst_number: "",
  });

  const slug = useMemo(
    () => form.store_name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    [form.store_name]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/seller/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setStep("submitted");
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "submitted") {
    return (
      <div className="max-w-xl mx-auto py-20 flex flex-col items-center text-center gap-6">
        <div className="h-20 w-20 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
          <CheckCircle className="text-green-500" size={36} />
        </div>
        <h1 className="text-3xl font-black text-[#111] uppercase tracking-tighter">Application Sent!</h1>
        <p className="text-[#888] font-medium max-w-sm">
          Your seller application is under review. We'll notify you by email within 24–48 hours once approved.
        </p>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-5 py-3 text-sm font-bold text-amber-700">
          <Clock size={16} /> Under review — usually 24–48h
        </div>
        <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-[#888] hover:text-brand transition-colors">
          Back to shopping →
        </Link>
      </div>
    );
  }

  if (step === "intro") {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 flex flex-col gap-12">
        {/* Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-brand">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.25em]">Sell on TryAndFit</span>
            </div>
            <h1 className="text-5xl font-black text-[#111] uppercase tracking-tighter leading-[0.9]">
              Your Brand.<br /><span className="text-brand">Our Platform.</span>
            </h1>
            <p className="text-[#888] font-medium text-base leading-relaxed max-w-md">
              Join thousands of fashion brands on TryAndFit. Your customers will see your products with AI-powered try-on — increasing conversions by up to 40%.
            </p>
            <button
              onClick={() => setStep("form")}
              className="self-start h-13 px-8 py-3 rounded-xl bg-brand text-white text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:bg-brand/90 transition-colors shadow-xl shadow-brand/20"
            >
              Start Selling <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Store size={20} />, title: "Your Own Store", desc: "Custom store page with logo and banner." },
              { icon: <Tag size={20} />, title: "Manage Products", desc: "Add, edit, and track your listings." },
              { icon: <Sparkles size={20} />, title: "AI Try-On", desc: "Customers try before they buy." },
              { icon: <CheckCircle size={20} />, title: "Easy Payouts", desc: "Weekly settlements to your account." },
            ].map(f => (
              <div key={f.title} className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                <div className="h-10 w-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center">{f.icon}</div>
                <h3 className="text-xs font-black text-[#111] uppercase tracking-tight">{f.title}</h3>
                <p className="text-[10px] text-[#888] font-medium leading-tight">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-brand">
          <Store size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.25em]">Seller Onboarding</span>
        </div>
        <h1 className="text-4xl font-black text-[#111] uppercase tracking-tighter">Set Up <span className="text-brand">Your Store</span></h1>
        <p className="text-sm text-[#888] font-medium">Fill in the details below. Our team will review and approve within 24–48 hours.</p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Store Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#888] flex items-center gap-1.5">
            <Building2 size={11} /> Store Name *
          </label>
          <input required name="store_name" value={form.store_name} onChange={handleChange}
            className="input" placeholder="e.g. Zara India" />
          {slug && (
            <p className="text-[10px] text-[#aaa] font-mono">
              Store URL: <span className="text-brand font-bold">tryandfit.in/store/{slug}</span>
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#888] flex items-center gap-1.5">
              <Mail size={11} /> Business Email *
            </label>
            <input required name="email" type="email" value={form.email} onChange={handleChange}
              className="input" placeholder="hello@yourbrand.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#888] flex items-center gap-1.5">
              <Phone size={11} /> Phone Number
            </label>
            <input name="phone" value={form.phone} onChange={handleChange}
              className="input" placeholder="+91 98765 43210" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#888] flex items-center gap-1.5">
            <Tag size={11} /> Product Category *
          </label>
          <select required name="category" value={form.category} onChange={handleChange} className="input">
            <option value="">Select a category</option>
            <option value="womens">Women's Fashion</option>
            <option value="mens">Men's Fashion</option>
            <option value="kids">Kids</option>
            <option value="accessories">Accessories</option>
            <option value="footwear">Footwear</option>
            <option value="ethnic">Ethnic Wear</option>
            <option value="sportswear">Sportswear</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#888] flex items-center gap-1.5">
            <FileText size={11} /> About Your Brand
          </label>
          <textarea name="description" value={form.description} onChange={handleChange}
            className="input min-h-[90px]" placeholder="Tell us about your brand, what you sell, your story..." />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">GST Number (Optional)</label>
          <input name="gst_number" value={form.gst_number} onChange={handleChange}
            className="input font-mono" placeholder="22AAAAA0000A1Z5" />
        </div>

        {/* Terms */}
        <div className="bg-[#F7F7F7] border border-black/5 rounded-xl p-4 text-[10px] text-[#888] font-medium leading-relaxed">
          By submitting, you agree to TryAndFit's Seller Marketplace Agreement. Your application will be reviewed by our team.
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => setStep("intro")}
            className="h-13 px-6 py-3 rounded-xl border border-black/10 text-[#888] text-xs font-black uppercase tracking-widest hover:border-black/30 transition-colors">
            Back
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 h-13 py-3 rounded-xl bg-brand text-white text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand/90 transition-all shadow-xl shadow-brand/20 disabled:opacity-60">
            {loading ? "Submitting..." : <><CheckCircle size={16} /> Submit Application</>}
          </button>
        </div>
      </form>
    </div>
  );
}

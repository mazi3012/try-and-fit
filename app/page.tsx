import Link from "next/link";
import { Sparkles, Shirt, Zap, Share2, Camera, Wand2, Globe } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { PremiumButton } from "@/components/ui/premium-button";

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-24 py-12">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center px-4">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand">
          <Sparkles className="h-3 w-3" />
          The Future of Shopping
        </div>
        
        <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl">
          Try <span className="text-gradient">Anything</span> <br /> 
          on <span className="text-gradient">Anyone</span>.
        </h1>
        
        <p className="mt-8 max-w-2xl text-lg text-muted leading-relaxed sm:text-xl">
          Experience the most advanced AI virtual try-on studio. Upload your portrait and instantly swap garments from any store, social post, or photo.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/try-on">
            <PremiumButton size="lg" icon={<Zap className="h-5 w-5" />}>
              Open Studio
            </PremiumButton>
          </Link>
          <Link href="/wardrobe">
            <PremiumButton variant="outline" size="lg" icon={<Shirt className="h-5 w-5" />}>
              My Wardrobe
            </PremiumButton>
          </Link>
        </div>

        {/* Floating elements decoration */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-[120px]" />
      </section>

      {/* Features Grid */}
      <section className="grid w-full max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Advanced Photo Upload",
            desc: "Ultra-high fidelity processing for portraits and selfies.",
            icon: <Camera className="h-6 w-6 text-brand" />,
          },
          {
            title: "Multi-Store Extraction",
            desc: "Extract outfits from Myntra, Amazon, Instagram, and more.",
            icon: <Globe className="h-6 w-6 text-accent" />,
          },
          {
            title: "Gemini 3.1 Flash",
            desc: "Powered by the latest 2026 multimodal AI synthesis.",
            icon: <Wand2 className="h-6 w-6 text-brand" />,
          },
          {
            title: "Seamless Sharing",
            desc: "Instantly share your new looks with friends and stylists.",
            icon: <Share2 className="h-6 w-6 text-accent" />,
          },
        ].map((item) => (
          <GlassCard key={item.title} className="flex flex-col gap-4 border-white/[0.05] p-8 hover:scale-[1.02] transition-transform">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
              {item.icon}
            </div>
            <h2 className="text-xl font-bold text-white">{item.title}</h2>
            <p className="text-sm leading-relaxed text-muted">{item.desc}</p>
          </GlassCard>
        ))}
      </section>

      {/* Social Proof / Call to Action */}
      <section className="w-full max-w-5xl px-4">
         <GlassCard className="flex flex-col items-center space-y-8 py-16 text-center bg-gradient-to-br from-brand/10 to-transparent border-brand/20">
            <h2 className="text-3xl font-black text-white sm:text-4xl">Ready to transform your style?</h2>
            <p className="max-w-md text-muted">Join thousands of stylists using TryAndFit to visualize their next purchase.</p>
            <Link href="/try-on">
               <PremiumButton size="lg" className="px-12">Get Started Now</PremiumButton>
            </Link>
         </GlassCard>
      </section>
    </div>
  );
}

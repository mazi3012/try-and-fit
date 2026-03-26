"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Package, ArrowRight, ShoppingBag, Home } from "lucide-react";
import { PremiumButton } from "@/components/ui/premium-button";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-10 text-center">
       {/* Animated Success Icon */}
       <div className="relative">
          <div className="absolute inset-0 bg-brand/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative h-24 w-24 flex items-center justify-center rounded-full bg-brand text-white shadow-2xl shadow-brand/40 animate-in zoom-in duration-500">
             <CheckCircle size={48} />
          </div>
       </div>

       <div className="flex flex-col gap-4 max-w-xl">
          <div className="flex flex-col gap-1">
             <p className="text-xs font-black uppercase tracking-widest text-brand">Order Confirmed</p>
             <h1 className="text-4xl sm:text-6xl font-black text-cream tracking-tighter">THANK <span className="text-brand">YOU.</span></h1>
          </div>
          <p className="text-muted text-sm sm:text-base px-6">
             Your order <span className="text-accent font-bold">#{id}</span> has been placed successfully. 
             Franky is already preparing your selection for shipment.
          </p>
       </div>

       <div className="grid sm:grid-cols-2 gap-4 w-full max-w-md px-4">
          <Link href="/shop" className="w-full">
             <PremiumButton variant="outline" size="lg" className="w-full h-14" icon={<ShoppingBag size={18} />}>
                Continue Shop
             </PremiumButton>
          </Link>
          <Link href="/" className="w-full">
             <PremiumButton size="lg" className="w-full h-14" icon={<Home size={18} />}>
                Home Base
             </PremiumButton>
          </Link>
       </div>

       <GlassCard className="p-6 bg-white/5 border-white/10 flex flex-col gap-4 max-w-sm w-full">
          <div className="flex items-center gap-3 text-left">
             <Package className="text-brand" size={20} />
             <div>
                <p className="text-xs font-bold text-cream">Next Steps</p>
                <p className="text-[10px] text-muted font-medium">You'll receive a confirmation email shortly with tracking details.</p>
             </div>
          </div>
       </GlassCard>

       <div className="mt-10 font-display text-[8px] font-black uppercase tracking-[0.5em] text-muted/20">
          FRANKY FASHION • TOKYO • MUMBAI • MILAN
       </div>
    </div>
  );
}

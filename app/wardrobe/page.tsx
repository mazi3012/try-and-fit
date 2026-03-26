"use client";

import { useEffect, useState } from "react";
import { Sparkles, Trash2, ShoppingBag, ArrowUpRight } from "lucide-react";
import { PremiumButton } from "@/components/ui/premium-button";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { listWardrobe, removeWardrobe } from "@/lib/mock-api";
import type { WardrobeItem } from "@/lib/types";

export default function WardrobePage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);

  useEffect(() => {
    setItems(listWardrobe());
  }, []);

  const onDelete = (id: string) => {
    removeWardrobe(id);
    setItems(listWardrobe());
  };

  return (
    <div className="flex flex-col gap-10 py-6">
      <header className="flex flex-col gap-4 text-left">
        <div className="flex items-center gap-2 text-brand">
          <Sparkles size={18} />
          <span className="text-xs font-black uppercase tracking-widest">Your Private Gallery</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-cream">
          THE <span className="text-brand">WARDROBE</span>
        </h1>
        <p className="max-w-xl text-muted text-sm sm:text-base">
          All your AI-rendered looks are stored here. Revisit your trials, share them, or buy the ones that fit your vibe.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="py-24 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-6 text-center">
           <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center text-muted">
              <ShoppingBag size={24} />
           </div>
           <div className="flex flex-col gap-1">
              <p className="text-cream font-bold">No saved looks yet.</p>
              <p className="text-xs text-muted">Head to the studio to create some magic.</p>
           </div>
           <Link href="/try-on">
              <PremiumButton size="md">Go to Studio</PremiumButton>
           </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item: WardrobeItem) => (
            <GlassCard key={item.id} className="p-0 overflow-hidden bg-[#141414] border-white/5 hover:border-brand/40 group">
              <div className="relative aspect-[4/5]">
                <img src={item.resultImage} alt={item.outfitName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-muted hover:text-red-500 border border-white/10 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="p-4 flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-cream group-hover:text-brand transition-colors">{item.outfitName}</h3>
                    <span className="text-[8px] font-black text-muted uppercase tracking-widest">{new Date(item.createdAt).toLocaleDateString()}</span>
                 </div>
                 
                 <div className="mt-4 flex gap-2">
                   {item.buyUrl && (
                     <Link href={item.buyUrl} className="flex-1">
                       <PremiumButton variant="outline" size="sm" className="w-full h-10 text-[10px]" icon={<ArrowUpRight size={12} />}>
                         Buy Item
                       </PremiumButton>
                     </Link>
                   )}
                   <PremiumButton variant="outline" size="sm" className="w-full h-10 text-[10px]">
                      Share
                   </PremiumButton>
                 </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

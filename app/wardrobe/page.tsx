"use client";

import { useEffect, useState } from "react";
import { Sparkles, Trash2, ShoppingBag, ArrowUpRight } from "lucide-react";
import { PremiumButton } from "@/components/ui/premium-button";
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
    <div className="flex flex-col gap-8 py-6">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-brand">
          <Sparkles size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.25em]">Your Private Gallery</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-[#111] uppercase">
          THE <span className="text-brand">WARDROBE</span>
        </h1>
        <p className="max-w-xl text-[#888] text-sm font-medium">
          All your AI-rendered looks are stored here. Revisit your trials, share them, or buy the ones that fit your vibe.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="py-24 border border-dashed border-black/10 rounded-2xl bg-white flex flex-col items-center justify-center gap-6 text-center">
          <div className="h-16 w-16 bg-[#F7F7F7] rounded-full flex items-center justify-center text-[#888] border border-black/5">
            <ShoppingBag size={24} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-black text-[#111] uppercase text-sm">No saved looks yet.</p>
            <p className="text-xs text-[#888] font-medium">Head to the studio to create some magic.</p>
          </div>
          <Link href="/try-on">
            <PremiumButton size="md" className="h-11 px-8">Go to Studio</PremiumButton>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item: WardrobeItem) => (
            <div key={item.id} className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="relative aspect-[4/5]">
                <img src={item.resultImage} alt={item.outfitName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-[#888] hover:text-red-500 border border-black/5 shadow-sm transition-all"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="p-3 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-black text-[#111] uppercase tracking-tight group-hover:text-brand transition-colors">{item.outfitName}</h3>
                  <span className="text-[8px] font-bold text-[#888] uppercase tracking-widest">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  {item.buyUrl && (
                    <Link href={item.buyUrl} className="flex-1">
                      <PremiumButton variant="outline" size="sm" className="w-full h-9 text-[10px]" icon={<ArrowUpRight size={12} />}>
                        Buy
                      </PremiumButton>
                    </Link>
                  )}
                  <PremiumButton variant="outline" size="sm" className="flex-1 h-9 text-[10px]">
                    Share
                  </PremiumButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

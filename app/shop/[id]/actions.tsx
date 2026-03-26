"use client";

import { useState } from "react";
import { PremiumButton } from "@/components/ui/premium-button";
import { Sparkles, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/ecommerce";

export function ProductActions({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addItem(product.id, selectedSize);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Sizes */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted">
          <span>Pick Your Size</span>
          <a href="#" className="underline text-brand">Size Guide</a>
        </div>
        <div className="flex flex-wrap gap-3">
          {product.sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`h-12 w-16 flex items-center justify-center border rounded-lg text-xs font-bold transition-all ${
                selectedSize === size 
                ? "border-brand bg-brand/10 text-brand" 
                : "border-white/10 hover:border-white/30 text-cream"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-6">
        <Link href={`/try-on?productId=${product.id}`}>
          <PremiumButton size="lg" className="w-full h-16 text-sm" icon={<Sparkles size={18} />}>
            Try Before Buy (AI)
          </PremiumButton>
        </Link>
        <PremiumButton
          variant="outline"
          size="lg"
          className="w-full h-16 text-sm"
          onClick={handleAddToCart}
          loading={adding}
          icon={adding ? <Loader2 size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
        >
          Add to Cart
        </PremiumButton>
      </div>
    </div>
  );
}

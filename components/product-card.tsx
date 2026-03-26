/**
 * Premium Product Card component for the "Franky Fashion" theme.
 * Features a bold editorial look with gold accents.
 */
"use client";

import Link from "next/link";
import { Sparkles, ShoppingCart, ArrowUpRight, Loader2 } from "lucide-react";
import { PremiumButton } from "./ui/premium-button";
import { Product, Category } from "@/lib/ecommerce";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

interface ProductCardProps {
  product: Product & { categories: Category };
  showTryOn?: boolean;
}

export function ProductCard({ product, showTryOn = true }: ProductCardProps) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addItem(product.id, product.sizes[0] || "M");
    } finally {
      setAdding(false);
    }
  };
  return (
    <div className="card group overflow-hidden flex flex-col h-full bg-[#141414] border-white/5 hover:border-brand/40">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-black">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-black/80 backdrop-blur-md text-[10px] font-bold text-cream px-2 py-1 rounded-sm border border-accent/20">
            {product.categories.name}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          {showTryOn && (
            <Link href={`/try-on?productId=${product.id}`}>
              <button className="h-10 w-10 flex items-center justify-center rounded-full bg-brand text-white shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                <Sparkles size={20} />
              </button>
            </Link>
          )}
          <Link href={`/shop/${product.id}`}>
            <button className="h-10 w-10 flex items-center justify-center rounded-full bg-cream text-black shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              <ArrowUpRight size={20} />
            </button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">{product.brand}</p>
          {product.compare_price && (
            <span className="text-[10px] line-through text-muted">₹{product.compare_price}</span>
          )}
        </div>
        <h3 className="text-sm font-bold text-cream line-clamp-1 mb-2 group-hover:text-brand transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-base font-black text-cream">₹{product.price}</span>
          <button 
            onClick={handleAdd}
            disabled={adding}
            className="text-[10px] font-bold text-accent uppercase tracking-tighter flex items-center gap-1 hover:text-brand transition-colors disabled:opacity-50"
          >
            {adding ? <Loader2 size={12} className="animate-spin" /> : <ShoppingCart size={12} />} Add
          </button>
        </div>
      </div>
    </div>
  );
}

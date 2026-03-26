/**
 * ProductCard — Myntra-style light theme card.
 */
"use client";

import Link from "next/link";
import { Sparkles, ShoppingCart, ArrowUpRight, Loader2, Tag } from "lucide-react";
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

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null;

  return (
    <div className="group bg-white border border-black/5 rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F7F7F7]">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 backdrop-blur-sm text-[9px] font-black text-[#555] px-2 py-0.5 rounded-full border border-black/5 uppercase tracking-widest">
            {product.categories.name}
          </span>
        </div>

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-2 right-2">
            <span className="bg-brand text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              {discount}% OFF
            </span>
          </div>
        )}

        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {showTryOn && (
            <Link href={`/try-on?productId=${product.id}`}>
              <button className="h-10 w-10 flex items-center justify-center rounded-full bg-brand text-white shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 hover:scale-110">
                <Sparkles size={17} />
              </button>
            </Link>
          )}
          <Link href={`/shop/${product.id}`}>
            <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-[#111] shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110">
              <ArrowUpRight size={17} />
            </button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#888]">{product.brand}</p>
        <h3 className="text-xs font-black text-[#111] line-clamp-1 uppercase tracking-tight group-hover:text-brand transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-2 border-t border-black/5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-[#111]">₹{product.price}</span>
            {product.compare_price && (
              <span className="text-[10px] line-through text-[#aaa]">₹{product.compare_price}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="flex items-center gap-1 text-[10px] font-black text-brand uppercase tracking-widest hover:underline underline-offset-2 transition-all disabled:opacity-40"
          >
            {adding ? <Loader2 size={11} className="animate-spin" /> : <ShoppingCart size={11} />}
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

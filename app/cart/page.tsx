"use client";

import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus, ShoppingCart } from "lucide-react";
import { PremiumButton } from "@/components/ui/premium-button";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, total, loading, addItem } = useCart();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="h-10 w-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        <p className="text-muted font-bold uppercase tracking-widest text-xs">Loading Bag...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
        <div className="h-20 w-20 flex items-center justify-center rounded-full bg-white/5 text-muted">
           <ShoppingBag size={40} />
        </div>
        <div className="flex flex-col gap-2">
           <h1 className="text-3xl font-black text-black uppercase italic tracking-tighter">YOUR BAG IS <span className="text-brand">EMPTY</span></h1>
           <p className="text-muted text-xs font-bold uppercase tracking-widest px-10">Looks like you haven't added any heat to your wardrobe yet.</p>
        </div>
        <Link href="/shop">
           <PremiumButton size="lg" className="px-10">Start Shopping</PremiumButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 py-6 pb-20">
      <header className="flex flex-col gap-2">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand">Your Selection</p>
         <h1 className="text-4xl sm:text-6xl font-black text-black uppercase italic tracking-tighter">SHOPPING <span className="text-brand">BAG</span></h1>
      </header>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {items.map((item) => (
            <GlassCard key={item.id} className="p-4 bg-white border-black/5 flex gap-4 sm:gap-6">
              <div className="h-24 w-20 sm:h-32 sm:w-28 shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-black/5">
                <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-brand mb-1">{item.product.brand}</p>
                    <h3 className="text-sm sm:text-base font-black text-black uppercase italic tracking-tight">{item.product.name}</h3>
                    <p className="text-[9px] font-black text-muted uppercase tracking-widest mt-1">Size: {item.size}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-muted hover:text-red-500 transition-colors p-1">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-black/5">
                    <button 
                      onClick={() => item.quantity > 1 && addItem(item.product_id, item.size, item.quantity - 1)}
                      className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-black/5 text-muted hover:text-black"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-black text-black w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => addItem(item.product_id, item.size, item.quantity + 1)}
                      className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-black/5 text-muted hover:text-black"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-sm sm:text-base font-black text-black">₹{item.product.price * item.quantity}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-6">
           <GlassCard className="p-6 bg-brand/5 border-brand/20 flex flex-col gap-6 sticky top-24">
              <h2 className="text-xl font-black text-cream uppercase tracking-tight">Order Summary</h2>
              
              <div className="flex flex-col gap-3 pb-6 border-b border-white/10">
                 <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-cream font-bold">₹{total}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-muted">Shipping</span>
                    <span className="text-accent font-bold uppercase text-[10px]">Calculated at next step</span>
                 </div>
              </div>

              <div className="flex justify-between items-baseline">
                 <span className="text-sm font-bold text-muted uppercase">Estimated Total</span>
                 <span className="text-2xl font-black text-brand">₹{total}</span>
              </div>

              <Link href="/checkout">
                 <PremiumButton size="lg" className="w-full h-14" icon={<ArrowRight size={18} />}>
                    Checkout Now
                 </PremiumButton>
              </Link>

              <p className="text-[10px] text-center text-muted font-medium">
                 Secure checkout powered by Franky Commerce Engine. Returns within 30 days.
              </p>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}

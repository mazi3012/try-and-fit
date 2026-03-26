"use client";

import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { PremiumButton } from "@/components/ui/premium-button";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, total, loading, addItem } = useCart();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="h-8 w-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        <p className="text-[#888] font-bold uppercase tracking-widest text-xs">Loading Bag...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
        <div className="h-20 w-20 flex items-center justify-center rounded-full bg-[#F7F7F7] text-[#888] border border-black/5">
          <ShoppingBag size={36} />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-[#111] uppercase tracking-tighter">
            Your Bag is <span className="text-brand">Empty</span>
          </h1>
          <p className="text-[#888] text-sm font-medium px-10 max-w-xs">
            Looks like you haven't added any heat to your wardrobe yet.
          </p>
        </div>
        <Link href="/shop">
          <PremiumButton size="lg" className="h-12 px-10">Start Shopping</PremiumButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-6 pb-24">
      <header className="flex flex-col gap-1">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand">Your Selection</p>
        <h1 className="text-4xl sm:text-5xl font-black text-[#111] uppercase tracking-tighter">
          Shopping <span className="text-brand">Bag</span>
        </h1>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-black/5 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-24 w-20 sm:h-32 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-[#F7F7F7] border border-black/5">
                <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover" />
              </div>

              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-brand mb-1">{item.product.brand}</p>
                    <h3 className="text-sm font-black text-[#111] uppercase tracking-tight leading-tight">{item.product.name}</h3>
                    <p className="text-[9px] font-bold text-[#888] uppercase tracking-widest mt-1">Size: {item.size}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="shrink-0 text-[#bbb] hover:text-red-500 transition-colors p-1">
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="mt-auto pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-[#F7F7F7] rounded-xl p-1 border border-black/5">
                    <button
                      onClick={() => item.quantity > 1 && addItem(item.product_id, item.size, item.quantity - 1)}
                      className="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-white text-[#888] hover:text-[#111] transition-all"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-black text-[#111] w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => addItem(item.product_id, item.size, item.quantity + 1)}
                      className="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-white text-[#888] hover:text-[#111] transition-all"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-base font-black text-[#111]">₹{item.product.price * item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-black/5 rounded-2xl p-6 flex flex-col gap-5 shadow-sm sticky top-24">
            <h2 className="text-base font-black text-[#111] uppercase tracking-tight border-b border-black/5 pb-4">
              Order Summary
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#888] font-medium">Subtotal</span>
                <span className="text-[#111] font-black">₹{total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#888] font-medium">Shipping</span>
                <span className="text-brand font-black text-xs uppercase">Calculated at next step</span>
              </div>
            </div>
            <div className="flex justify-between items-baseline border-t border-black/5 pt-4">
              <span className="text-xs font-black text-[#888] uppercase tracking-widest">Estimated Total</span>
              <span className="text-2xl font-black text-brand">₹{total}</span>
            </div>

            <Link href="/checkout">
              <PremiumButton size="lg" className="w-full h-14" icon={<ArrowRight size={18} />}>
                Checkout
              </PremiumButton>
            </Link>

            <div className="flex items-center justify-center gap-5 pt-2">
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#bbb]">
                <ShieldCheck size={12} /> Secure SSL
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#bbb]">
                <Truck size={12} /> Fast Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

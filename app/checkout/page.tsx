"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/lib/ecommerce";
import { GlassCard } from "@/components/ui/glass-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { ArrowLeft, CheckCircle, ShieldCheck, Truck, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, total, loading } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const order = await createOrder({
        total,
        shipping: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          phone: formData.phone,
        }
      });
      router.push(`/order-success/${order.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Please check your details.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;
  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="flex flex-col gap-10 py-6 pb-20">
       <header className="flex items-center gap-4">
          <Link href="/cart" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-muted hover:text-cream transition-all">
             <ArrowLeft size={18} />
          </Link>
          <div className="flex flex-col">
             <p className="text-[10px] font-black uppercase tracking-widest text-brand">Final Step</p>
             <h1 className="text-3xl font-black text-cream">SECURE <span className="text-brand">CHECKOUT</span></h1>
          </div>
       </header>

       <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2 flex flex-col gap-8">
             <section className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                   <div className="h-6 w-6 rounded-full bg-brand flex items-center justify-center text-[10px] font-black">01</div>
                   <h2 className="text-lg font-black uppercase tracking-tight text-cream">Shipping Details</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">Full Name</label>
                      <input required name="name" value={formData.name} onChange={handleChange} className="input" placeholder="John Doe" />
                   </div>
                   <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">Phone Number</label>
                      <input required name="phone" value={formData.phone} onChange={handleChange} className="input" placeholder="+91 98765 43210" />
                   </div>
                   <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">Street Address</label>
                      <textarea required name="address" value={formData.address} onChange={handleChange} className="input min-h-[80px]" placeholder="Apt 4, Fashion Street, Sector 12" />
                   </div>
                   <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">City</label>
                      <input required name="city" value={formData.city} onChange={handleChange} className="input" placeholder="Mumbai" />
                   </div>
                   <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted">Pincode</label>
                      <input required name="pincode" value={formData.pincode} onChange={handleChange} className="input" placeholder="400001" />
                   </div>
                </div>
             </section>

             <section className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                   <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-muted">02</div>
                   <h2 className="text-lg font-black uppercase tracking-tight text-cream">Payment Method</h2>
                </div>
                <div className="p-4 border border-brand/40 bg-brand/5 rounded-xl flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <CreditCard className="text-brand" size={24} />
                      <div>
                         <p className="text-sm font-bold text-cream">Cash on Delivery (COD)</p>
                         <p className="text-[10px] text-muted font-medium">Pay securely at your doorstep</p>
                      </div>
                   </div>
                   <CheckCircle className="text-brand" size={20} />
                </div>
                <p className="text-[10px] text-muted leading-relaxed">
                   Looking for online payments? Razorpay integration coming soon in the next collection drop.
                </p>
             </section>
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-6">
             <GlassCard className="p-6 bg-white border-black/5 flex flex-col gap-6 sticky top-24">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted/60 border-b border-black/5 pb-4">Order Summary</h3>
                
                <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                   {items.map(item => (
                      <div key={item.id} className="flex gap-3">
                         <div className="h-14 w-12 rounded bg-black shrink-0 overflow-hidden border border-white/10">
                            <img src={item.product.image_url} className="h-full w-full object-cover" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-cream truncate">{item.product.name}</p>
                            <p className="text-[9px] text-muted uppercase">Size: {item.size} • Qty: {item.quantity}</p>
                            <p className="text-[10px] font-black text-brand mt-1">₹{item.product.price * item.quantity}</p>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                   <div className="flex justify-between text-xs">
                      <span className="text-muted">Subtotal</span>
                      <span className="text-cream font-bold">₹{total}</span>
                   </div>
                   <div className="flex justify-between text-xs">
                      <span className="text-muted">Shipping</span>
                      <span className="text-accent font-bold uppercase text-[9px]">Free</span>
                   </div>
                   <div className="flex justify-between items-baseline mt-4">
                      <span className="text-sm font-black uppercase tracking-widest text-cream">Total</span>
                      <span className="text-2xl font-black text-brand">₹{total}</span>
                   </div>
                </div>

                <PremiumButton type="submit" size="lg" className="w-full h-16 mt-2" loading={submitting} icon={<ChevronRight size={18} />}>
                   Place Order
                </PremiumButton>

                <div className="flex items-center justify-center gap-4 pt-2">
                   <div className="flex items-center gap-1 text-[8px] font-black uppercase text-muted/60">
                      <ShieldCheck size={10} /> Secure SSL
                   </div>
                   <div className="flex items-center gap-1 text-[8px] font-black uppercase text-muted/60">
                      <Truck size={10} /> Fast Ship
                   </div>
                </div>
             </GlassCard>
          </div>
       </form>
    </div>
  );
}

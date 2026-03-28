"use client";

import Link from "next/link";
import { Sparkles, Shield, User, Store, LayoutDashboard } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-black/5 pb-24 md:pb-12">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tighter text-[#111] uppercase">
                TryAndFit<span className="text-brand">.</span>
              </span>
            </Link>
            <p className="text-sm text-[#888] font-medium leading-relaxed max-w-sm">
              Revolutionizing fashion with AI-powered virtual try-ons. See how any outfit looks on you before you buy, reducing returns and boosting confidence.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/seller/apply" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#888] hover:text-brand transition-colors">
                <Store size={12} /> Sell with us
              </Link>
              <Link href="/admin/users" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#888] hover:text-brand transition-colors">
                <LayoutDashboard size={12} /> Admin
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111]">Platform</h4>
            <div className="flex flex-col gap-3">
              <Link href="/shop" className="text-xs font-bold text-[#888] hover:text-brand transition-colors">Shop Catalog</Link>
              <Link href="/try-on" className="text-xs font-bold text-[#888] hover:text-brand transition-colors">Try-On Studio</Link>
              <Link href="/advisor" className="text-xs font-bold text-[#888] hover:text-brand transition-colors">AI Style Advisor</Link>
              <Link href="/wardrobe" className="text-xs font-bold text-[#888] hover:text-brand transition-colors">My Wardrobe</Link>
            </div>
          </div>

          {/* Login Portals */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111]">Portals</h4>
            <div className="flex flex-col gap-3">
              <Link href="/auth/login" className="flex items-center gap-2 text-xs font-bold text-[#888] hover:text-brand transition-colors">
                <User size={14} /> Buyer Login
              </Link>
              <Link href="/seller/apply" className="flex items-center gap-2 text-xs font-bold text-[#888] hover:text-brand transition-colors">
                <Store size={14} /> Seller Portal
              </Link>
              <Link href="/admin/users" className="flex items-center gap-2 text-xs font-bold text-[#888] hover:text-brand transition-colors">
                <Shield size={14} /> Admin Access
              </Link>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest">
            &copy; 2026 TryAndFit AI Labs. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-[#bbb] hover:text-[#555]">Privacy</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-[#bbb] hover:text-[#555]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

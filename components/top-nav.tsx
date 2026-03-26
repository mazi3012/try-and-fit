"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/try-on", label: "Studio" },
  { href: "/advisor", label: "Style AI" },
  { href: "/wardrobe", label: "Wardrobe" },
];

export function TopNav() {
  const pathname = usePathname();
  const cart = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 h-14 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-lg font-black tracking-tighter text-[#111] uppercase">
          TryAndFit<span className="text-brand">.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all",
                  active
                    ? "bg-brand text-white"
                    : "text-[#555] hover:bg-[#F7F7F7] hover:text-[#111]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link href="/cart" className="relative h-9 w-9 flex items-center justify-center rounded-full bg-[#F7F7F7] border border-black/5 text-[#555] hover:border-brand hover:text-brand transition-all">
            <ShoppingBag size={17} />
            {cart.items.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-brand text-[9px] font-black text-white shadow-md">
                {cart.items.length}
              </span>
            )}
          </Link>

          {/* User */}
          {!loading && user ? (
            <div className="hidden sm:flex items-center gap-2">
              {user.user_metadata?.avatar_url && (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-brand/20"
                />
              )}
              <button
                onClick={handleSignOut}
                className="text-[10px] font-black text-[#888] uppercase tracking-widest hover:text-brand transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            !loading && (
              <button
                onClick={handleSignIn}
                className="hidden sm:block rounded-full bg-brand px-5 py-2 text-[10px] font-black text-white uppercase tracking-widest transition-all hover:bg-brand/90 shadow-md shadow-brand/20"
              >
                Sign in
              </button>
            )
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-full bg-[#F7F7F7] border border-black/5 text-[#555]"
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-black/5 bg-white px-4 py-4 flex flex-col gap-1 shadow-lg">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all",
                  active ? "bg-brand text-white" : "text-[#555] hover:bg-[#F7F7F7]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="border-t border-black/5 pt-3 mt-1">
            {!loading && user ? (
              <button onClick={handleSignOut} className="w-full text-left text-[10px] font-black text-[#888] uppercase tracking-widest hover:text-brand px-4 py-2">
                Sign out · {user.user_metadata?.full_name || user.email}
              </button>
            ) : (
              <button onClick={handleSignIn} className="w-full rounded-xl bg-brand px-4 py-3 text-[11px] font-black text-white uppercase tracking-widest">
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

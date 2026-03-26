"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";
import { ShoppingBag } from "lucide-react";
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
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-brand">
          TryAndFit
        </Link>

        <nav className="hidden items-center gap-1 overflow-x-auto md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition",
                  active ? "bg-brand text-white" : "text-muted hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-cream hover:border-brand transition-all">
             <ShoppingBag size={20} />
             {cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-brand text-[10px] font-black text-white shadow-lg animate-in zoom-in">
                   {cart.items.length}
                </span>
             )}
          </Link>

          {!loading && user ? (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-white">{user.user_metadata?.full_name || user.email}</p>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-muted hover:text-brand"
                >
                  Sign out
                </button>
              </div>
              {user.user_metadata?.avatar_url && (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full border border-white/10"
                />
              )}
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand/90 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Sign in"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}


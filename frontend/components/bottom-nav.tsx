"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Shirt, User, Library } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/try-on", label: "Studio", icon: Sparkles },
  { href: "/wardrobe", label: "Wardrobe", icon: Library },
  { href: "/account", label: "Account", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-black/60 p-1.5 backdrop-blur-xl md:hidden shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-full px-5 py-2.5 transition-all duration-300",
              active ? "bg-white/10 text-white" : "text-muted hover:text-white/60"
            )}
          >
            <Icon className={cn("h-5 w-5 transition-transform duration-300", active && "scale-110")} />
            {active && (
              <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-brand shadow-[0_0_8px_var(--brand)]" />
            )}
            <span className="sr-only">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, ShoppingBag, MessageSquare, Library } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/try-on", label: "Studio", icon: Sparkles },
  { href: "/advisor", label: "Style AI", icon: MessageSquare },
  { href: "/wardrobe", label: "Wardrobe", icon: Library },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/5 md:hidden shadow-2xl shadow-black/5">
      <div className="flex items-stretch">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-2 gap-0.5 transition-colors",
                active ? "text-brand" : "text-[#aaa] hover:text-[#555]"
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform duration-200", active && "scale-110")} />
              <span className={cn("text-[9px] font-black uppercase tracking-widest", active ? "text-brand" : "text-[#bbb]")}>
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-0 h-0.5 w-8 bg-brand rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

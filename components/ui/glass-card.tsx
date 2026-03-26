import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div className={cn("rounded-xl border border-black/5 bg-white shadow-xl shadow-black/[0.02] transition-all", className)}>
      {children}
    </div>
  );
}

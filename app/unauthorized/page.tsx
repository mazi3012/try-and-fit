import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="h-20 w-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
        <ShieldAlert className="text-red-400" size={36} />
      </div>
      <h1 className="text-3xl font-black text-[#111] uppercase tracking-tighter">Access Denied</h1>
      <p className="text-[#888] font-medium max-w-xs">
        You don't have permission to access this page.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/" className="h-11 px-8 rounded-xl bg-[#111] text-white text-xs font-black uppercase tracking-widest flex items-center hover:bg-brand transition-colors">
          Go Home
        </Link>
        <Link href="/seller/apply" className="h-11 px-8 rounded-xl border border-black/10 text-xs font-black uppercase tracking-widest text-[#555] flex items-center hover:border-black/30 transition-colors">
          Become a Seller
        </Link>
      </div>
    </div>
  );
}

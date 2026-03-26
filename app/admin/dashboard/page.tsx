import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Shield, Users, Store, Package, Clock, CheckCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import ActionButtons from "./_components/action-buttons";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles").select("role, full_name").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/unauthorized");

  const [
    { count: buyerCount },
    { count: sellerCount },
    { count: pendingCount },
    { count: productCount },
    { count: orderCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact" }).eq("role", "buyer"),
    supabase.from("profiles").select("*", { count: "exact" }).eq("role", "seller"),
    supabase.from("seller_applications").select("*", { count: "exact" }).eq("status", "pending"),
    supabase.from("products").select("*", { count: "exact" }),
    supabase.from("orders").select("*", { count: "exact" }),
  ]);

  const { data: pendingApps } = await supabase
    .from("seller_applications")
    .select("*, profiles(full_name, avatar_url, email)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const { data: sellers } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, updated_at")
    .eq("role", "seller")
    .order("updated_at", { ascending: false })
    .limit(10);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 flex flex-col gap-8">
      {/* Header */}
      <header className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[#111] text-white flex items-center justify-center">
          <Shield size={20} />
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-brand">Platform Control</p>
          <h1 className="text-3xl font-black text-[#111] uppercase tracking-tighter">Admin Panel</h1>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Buyers", val: buyerCount ?? 0, icon: <Users size={18} />, color: "text-blue-500 bg-blue-50" },
          { label: "Sellers", val: sellerCount ?? 0, icon: <Store size={18} />, color: "text-green-500 bg-green-50" },
          { label: "Pending", val: pendingCount ?? 0, icon: <Clock size={18} />, color: "text-amber-500 bg-amber-50" },
          { label: "Products", val: productCount ?? 0, icon: <Package size={18} />, color: "text-purple-500 bg-purple-50" },
          { label: "Orders", val: orderCount ?? 0, icon: <ShoppingBag size={18} />, color: "text-brand bg-brand/10" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-black/5 rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-black text-[#111]">{s.val}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-[#888]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending Applications */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#111] uppercase tracking-tight flex items-center gap-2">
            <Clock size={16} className="text-amber-500" />
            Pending Seller Applications
            {(pendingCount ?? 0) > 0 && (
              <span className="h-5 px-2 flex items-center bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase">
                {pendingCount}
              </span>
            )}
          </h2>
        </div>

        {!pendingApps || pendingApps.length === 0 ? (
          <div className="bg-white border border-black/5 rounded-2xl p-8 text-center shadow-sm">
            <CheckCircle className="mx-auto text-green-400 mb-3" size={28} />
            <p className="text-sm font-black text-[#888] uppercase tracking-tight">All caught up! No pending applications.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {(pendingApps as any[]).map((app) => (
              <div key={app.id} className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {app.profiles?.avatar_url ? (
                    <img src={app.profiles.avatar_url} alt="" className="h-10 w-10 rounded-full border border-black/5" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-[#F7F7F7] border border-black/5 flex items-center justify-center text-[#888] font-black text-sm">
                      {app.store_name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-[#111] uppercase tracking-tight truncate">{app.store_name}</h3>
                    <p className="text-[10px] text-[#888] font-medium">{app.email} · {app.category || "General"}</p>
                    {app.description && (
                      <p className="text-[9px] text-[#aaa] mt-0.5 line-clamp-1">{app.description}</p>
                    )}
                    <p className="text-[9px] text-[#bbb] font-mono">{new Date(app.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <ActionButtons appId={app.id} userId={app.user_id} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Sellers */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-black text-[#111] uppercase tracking-tight flex items-center gap-2">
          <Store size={16} className="text-green-500" /> Active Sellers
        </h2>
        {!sellers || sellers.length === 0 ? (
          <p className="text-sm text-[#888] font-medium">No active sellers yet.</p>
        ) : (
          <div className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-black/5">
              {(sellers as any[]).map((seller) => (
                <div key={seller.id} className="flex items-center gap-4 px-5 py-3 hover:bg-[#F7F7F7] transition-colors">
                  {seller.avatar_url ? (
                    <img src={seller.avatar_url} alt="" className="h-8 w-8 rounded-full border border-black/5" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-black">
                      {seller.full_name?.[0]?.toUpperCase() ?? "S"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-[#111]">{seller.full_name || "Unnamed Seller"}</p>
                    <p className="text-[9px] text-[#888]">{seller.email}</p>
                  </div>
                  <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Nav */}
      <div className="flex gap-3 flex-wrap">
        <Link href="/admin/sellers" className="h-10 px-5 rounded-xl border border-black/10 text-xs font-black uppercase tracking-widest text-[#555] flex items-center gap-2 hover:border-black/30 transition-colors">
          <Store size={14} /> Manage Sellers
        </Link>
        <Link href="/admin/buyers" className="h-10 px-5 rounded-xl border border-black/10 text-xs font-black uppercase tracking-widest text-[#555] flex items-center gap-2 hover:border-black/30 transition-colors">
          <Users size={14} /> Manage Buyers
        </Link>
      </div>
    </div>
  );
}

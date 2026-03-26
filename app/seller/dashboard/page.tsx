import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Store, Package, ShoppingBag, Settings, Sparkles, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export default async function SellerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase.from("profiles").select("role, full_name, avatar_url").eq("id", user.id).single();
  if (!profile) redirect("/");

  // Check application status for pending sellers
  const { data: application } = await supabase
    .from("seller_applications")
    .select("status, store_name, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // If still a buyer/pending, show pending state
  if (profile.role !== "seller" && profile.role !== "admin") {
    if (application?.status === "pending") {
      return (
        <div className="max-w-xl mx-auto py-20 flex flex-col items-center text-center gap-6 px-4">
          <div className="h-20 w-20 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
            <Clock className="text-amber-500" size={36} />
          </div>
          <h1 className="text-3xl font-black text-[#111] uppercase tracking-tighter">Application Pending</h1>
          <p className="text-[#888] font-medium max-w-xs">
            Your application for <span className="font-black text-[#111]">"{application.store_name}"</span> is under review. We'll notify you soon.
          </p>
          <div className="bg-[#F7F7F7] border border-black/5 rounded-2xl p-4 w-full text-left flex flex-col gap-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-[#888]">Application Status</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm font-black text-amber-600 uppercase tracking-wide">Under Review</span>
            </div>
            <p className="text-[10px] text-[#aaa]">Submitted: {new Date(application.created_at).toLocaleDateString()}</p>
          </div>
          <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-[#888] hover:text-brand transition-colors">
            Continue Shopping →
          </Link>
        </div>
      );
    }

    redirect("/seller/apply");
  }

  // Fetch store stats
  const { data: store } = await supabase
    .from("vendor_stores").select("*").eq("owner_id", user.id).maybeSingle();

  const { count: productCount } = await supabase
    .from("products").select("*", { count: "exact" })
    .eq("vendor_store_id", store?.id ?? "");

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 flex flex-col gap-8">
      {/* Header */}
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand flex items-center gap-1.5 mb-1">
            <Sparkles size={12} /> Seller Dashboard
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-[#111] uppercase tracking-tighter">
            {store?.store_name || "My Store"}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className={`h-2 w-2 rounded-full ${store?.status === "approved" ? "bg-green-400" : "bg-amber-400 animate-pulse"}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#888]">
              {store?.status === "approved" ? "Store Live" : "Pending Approval"}
            </span>
          </div>
        </div>
        <Link href="/seller/products/new">
          <button className="h-11 px-6 rounded-xl bg-brand text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-brand/90 transition-colors shadow-lg shadow-brand/20">
            + New Product
          </button>
        </Link>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Products", val: productCount ?? 0, icon: <Package size={20} /> },
          { label: "Orders", val: 0, icon: <ShoppingBag size={20} /> },
          { label: "Revenue", val: "₹0", icon: <ArrowRight size={20} /> },
          { label: "Store Status", val: store?.status ?? "—", icon: <Store size={20} /> },
        ].map(s => (
          <div key={s.label} className="bg-white border border-black/5 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
            <div className="h-10 w-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center">{s.icon}</div>
            <div>
              <p className="text-2xl font-black text-[#111]">{s.val}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#888]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { href: "/seller/products", icon: <Package size={22} />, label: "Manage Products", desc: "View, add, edit or remove your listings." },
          { href: "/seller/orders", icon: <ShoppingBag size={22} />, label: "View Orders", desc: "Track incoming orders and fulfillment." },
          { href: "/seller/settings", icon: <Settings size={22} />, label: "Store Settings", desc: "Update logo, description, and details." },
        ].map(item => (
          <Link key={item.href} href={item.href} className="group bg-white border border-black/5 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-brand/30 transition-all">
            <div className="h-11 w-11 bg-[#F7F7F7] text-[#555] rounded-xl flex items-center justify-center group-hover:bg-brand/10 group-hover:text-brand transition-colors">
              {item.icon}
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111] uppercase tracking-tight group-hover:text-brand transition-colors">{item.label}</h3>
              <p className="text-[10px] text-[#888] font-medium mt-0.5">{item.desc}</p>
            </div>
            <ArrowRight size={14} className="text-[#ccc] group-hover:text-brand transition-colors ml-auto" />
          </Link>
        ))}
      </div>

      {/* Store Info */}
      {store && (
        <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-black uppercase tracking-tight text-[#111] mb-4 pb-3 border-b border-black/5">Store Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Store Name", val: store.store_name },
              { label: "Email", val: store.email },
              { label: "Category", val: store.category || "—" },
              { label: "Store URL", val: `tryandfit.in/store/${store.store_slug}` },
              { label: "GST", val: store.gst_number || "—" },
              { label: "Phone", val: store.phone || "—" },
            ].map(f => (
              <div key={f.label}>
                <p className="text-[9px] font-black uppercase tracking-widest text-[#aaa]">{f.label}</p>
                <p className="text-sm font-bold text-[#111] mt-0.5 font-mono">{f.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { createClient } from "@/utils/supabase/server";

// ─── Vendor Store APIs ────────────────────────────────────────

export async function getMyStore() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("vendor_stores")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  return data;
}

export async function createStore(payload: {
  store_name: string;
  store_slug: string;
  email: string;
  phone?: string;
  description?: string;
  category?: string;
  gst_number?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("vendor_stores")
    .insert({ ...payload, owner_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateStore(storeId: string, payload: Partial<{
  store_name: string;
  description: string;
  phone: string;
  email: string;
  category: string;
  gst_number: string;
  logo_url: string;
  banner_url: string;
}>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendor_stores")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", storeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Seller Application APIs ──────────────────────────────────

export async function submitSellerApplication(payload: {
  store_name: string;
  email: string;
  phone?: string;
  description?: string;
  category?: string;
  gst_number?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("seller_applications")
    .insert({ ...payload, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMyApplication() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("seller_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

// ─── Seller Product APIs ──────────────────────────────────────

export async function getMyStoreProducts(storeId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("vendor_store_id", storeId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createSellerProduct(storeId: string, payload: {
  name: string;
  description?: string;
  price: number;
  compare_price?: number;
  category_id?: string;
  image_url: string;
  sizes?: string[];
  brand?: string;
  tags?: string[];
  status?: "active" | "draft";
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({ ...payload, vendor_store_id: storeId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSellerProduct(productId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);
  if (error) throw error;
}

// ─── Admin APIs ───────────────────────────────────────────────

export async function getAllApplications() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("seller_applications")
    .select("*, profiles(full_name, avatar_url, email)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function approveApplication(appId: string, userId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Update application status
  const { data: app, error: appError } = await supabase
    .from("seller_applications")
    .update({
      status: "approved",
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", appId)
    .select()
    .single();
  if (appError) throw appError;

  // 2. Upgrade user role to seller
  const { error: roleError } = await supabase
    .from("profiles")
    .update({ role: "seller", updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (roleError) throw roleError;

  // 3. Auto-create their vendor store
  const { error: storeError } = await supabase
    .from("vendor_stores")
    .insert({
      owner_id: userId,
      store_name: app.store_name,
      store_slug: app.store_name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      email: app.email,
      phone: app.phone,
      description: app.description,
      category: app.category,
      gst_number: app.gst_number,
      status: "approved",
    });
  if (storeError) throw storeError;

  return app;
}

export async function rejectApplication(appId: string, note?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("seller_applications")
    .update({
      status: "rejected",
      admin_note: note,
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", appId);
  if (error) throw error;
}

export async function getAdminStats() {
  const supabase = await createClient();

  const [buyers, sellers, pendingApps, products, orders] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact" }).eq("role", "buyer"),
    supabase.from("profiles").select("id", { count: "exact" }).eq("role", "seller"),
    supabase.from("seller_applications").select("id", { count: "exact" }).eq("status", "pending"),
    supabase.from("products").select("id", { count: "exact" }),
    supabase.from("orders").select("id", { count: "exact" }),
  ]);

  return {
    buyers: buyers.count ?? 0,
    sellers: sellers.count ?? 0,
    pendingApplications: pendingApps.count ?? 0,
    products: products.count ?? 0,
    orders: orders.count ?? 0,
  };
}

export async function getAllSellers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, vendor_stores(store_name, status, category, created_at)")
    .eq("role", "seller")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getAllBuyers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, email, created_at")
    .eq("role", "buyer")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify admin
    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: appId } = await params;
    const { action, note } = await request.json(); // action: "approve" | "reject"

    // Get the application
    const { data: app, error: appFetchError } = await supabase
      .from("seller_applications").select("*").eq("id", appId).single();
    if (appFetchError) throw appFetchError;

    if (action === "approve") {
      // 1. Update application
      await supabase.from("seller_applications").update({
        status: "approved",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      }).eq("id", appId);

      // 2. Promote user to seller
      await supabase.from("profiles")
        .update({ role: "seller", updated_at: new Date().toISOString() })
        .eq("id", app.user_id);

      // 3. Create vendor store
      const slug = app.store_name
        .toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const safeSlug = `${slug}-${Date.now()}`;

      await supabase.from("vendor_stores").insert({
        owner_id: app.user_id,
        store_name: app.store_name,
        store_slug: safeSlug,
        email: app.email,
        phone: app.phone,
        description: app.description,
        category: app.category,
        gst_number: app.gst_number,
        status: "approved",
      });
    } else {
      await supabase.from("seller_applications").update({
        status: "rejected",
        admin_note: note,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      }).eq("id", appId);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

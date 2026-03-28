import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { store_name, email, phone, category, description, gst_number } = body;

    if (!store_name || !email) {
      return NextResponse.json({ error: "store_name and email are required" }, { status: 400 });
    }

    // Check for existing application
    const { data: existing } = await supabase
      .from("seller_applications")
      .select("id, status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: `You already have an application with status: ${existing.status}`, existing },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("seller_applications")
      .insert({ user_id: user.id, store_name, email, phone, category, description, gst_number })
      .select()
      .single();

    if (error) throw error;

    // 4. Update profiles seller_status to 'pending'
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ seller_status: 'pending' })
      .eq("id", user.id);

    if (profileError) {
      console.warn("Failed to update profile seller_status:", profileError.message);
    }

    return NextResponse.json({ success: true, application: data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

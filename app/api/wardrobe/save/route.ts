import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// POST /api/wardrobe/save  — marks a completed tryon_job as saved to wardrobe
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { jobId, outfitName, category } = await request.json();
    if (!jobId) return NextResponse.json({ error: "jobId required" }, { status: 400 });

    // Verify job belongs to this user and is completed
    const { data: job, error: fetchErr } = await supabase
      .from("tryon_jobs")
      .select("id, status, user_id, result_image_url")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .single();

    if (fetchErr || !job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    if (job.status !== "completed") return NextResponse.json({ error: "Job not completed" }, { status: 400 });

    const { data, error } = await supabase
      .from("tryon_jobs")
      .update({
        saved_to_wardrobe: true,
        outfit_name: outfitName || "My Look",
        category: category || "general",
      })
      .eq("id", jobId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, job: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/wardrobe/save  — removes from wardrobe (unsaves)
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { jobId } = await request.json();

    const { error } = await supabase
      .from("tryon_jobs")
      .update({ saved_to_wardrobe: false })
      .eq("id", jobId)
      .eq("user_id", user.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

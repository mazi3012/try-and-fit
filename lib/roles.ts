import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export type UserRole = "buyer" | "seller" | "admin";

/** Get the current session user's role from the profiles table */
export async function getRole(): Promise<UserRole | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (data?.role as UserRole) ?? "buyer";
}

/** Server-side role guard — redirects if role doesn't match */
export async function requireRole(
  required: UserRole | UserRole[],
  redirectTo = "/unauthorized"
) {
  const role = await getRole();
  const allowed = Array.isArray(required) ? required : [required];
  if (!role || !allowed.includes(role)) {
    redirect(redirectTo);
  }
  return role;
}

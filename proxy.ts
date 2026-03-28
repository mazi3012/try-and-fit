import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh auth session (keeps Supabase cookies alive)
  const path = request.nextUrl.pathname;

  // ── Session & Role Checks ──────────────────────────────
  const { data: { user } } = await supabase.auth.getUser();

  // Protect all non-auth and non-api routes
  if (user && !path.startsWith('/onboarding') && 
      !path.startsWith('/auth') && 
      !path.startsWith('/api')) {
    
    // Fetch profile for onboarding & role checks
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarded, role, seller_status')
      .eq('id', user.id)
      .single();

    if (profile && !profile.onboarded) {
      const url = request.nextUrl.clone();
      url.pathname = '/onboarding';
      return NextResponse.redirect(url);
    }

    const role = profile?.role ?? 'buyer';
    const sellerStatus = profile?.seller_status ?? 'none';

    // Admin-only routes
    if (path.startsWith('/admin') && role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    // New/Pending sellers are redirected to /seller/apply if they try to access tools
    if (path.startsWith('/seller') && !path.startsWith('/seller/apply')) {
      if (role !== 'seller' || sellerStatus !== 'approved') {
        const url = request.nextUrl.clone();
        url.pathname = '/seller/apply';
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

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

  const { data: { user } } = await supabase.auth.getUser();

  // If there's a user, we need to check onboarding AND role
  if (user) {
    // Check if the user is currently on an excluded path
    const isExcluded = path.startsWith('/onboarding') || 
                       path.startsWith('/auth') || 
                       path.startsWith('/api');

    if (!isExcluded) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarded, role, seller_status')
        .eq('id', user.id)
        .maybeSingle();

      // 1. Mandatory Onboarding
      if (profile && !profile.onboarded) {
        const url = request.nextUrl.clone();
        url.pathname = '/onboarding';
        const redirectResponse = NextResponse.redirect(url);
        // Copy cookies to redirect response
        response.cookies.getAll().forEach(c => redirectResponse.cookies.set(c.name, c.value, c));
        return redirectResponse;
      }

      const role = profile?.role ?? 'buyer';
      const sellerStatus = profile?.seller_status ?? 'none';

      // 2. Admin Protection
      if (path.startsWith('/admin') && role !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/unauthorized';
        const redirectResponse = NextResponse.redirect(url);
        response.cookies.getAll().forEach(c => redirectResponse.cookies.set(c.name, c.value, c));
        return redirectResponse;
      }

      // 3. Seller Protection
      if (path.startsWith('/seller') && !path.startsWith('/seller/apply')) {
        if (role !== 'seller' || sellerStatus !== 'approved') {
          const url = request.nextUrl.clone();
          url.pathname = '/seller/apply';
          const redirectResponse = NextResponse.redirect(url);
          response.cookies.getAll().forEach(c => redirectResponse.cookies.set(c.name, c.value, c));
          return redirectResponse;
        }
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

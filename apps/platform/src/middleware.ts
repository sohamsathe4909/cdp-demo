import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { fetchWithRetry } from "@/lib/supabase/fetch-retry";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const isConfigured = Boolean(url && key && !url.includes("your-supabase-project"));

  const pathname = request.nextUrl.pathname;
  const protectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/careers") ||
    pathname.startsWith("/profile");

  if (!isConfigured) {
    return response;
  }

  const supabase = createServerClient(url!, key!, {
    global: { fetch: fetchWithRetry },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Ask Supabase for the authenticated user. This is slightly more work than
  // trusting locally cached signing keys, but avoids rejecting a fresh session
  // when a Vercel instance has a missing or stale JWKS cache.
  const { data } = await supabase.auth.getUser();

  if (protectedRoute && !data.user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

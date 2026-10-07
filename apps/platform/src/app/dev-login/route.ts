import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/** Direct entry to the existing offline demo, available only in development. */
export function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development" || isSupabaseConfigured()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set("cdp_demo_user", "alex.hunter@fintree.dev", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

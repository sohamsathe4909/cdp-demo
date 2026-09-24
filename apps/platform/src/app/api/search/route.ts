import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { searchCatalog } from "@/lib/search";

/** GET /api/search?q=lessons — header search across lessons, tracks, careers and Expinars. */
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.get("q") ?? "";
  const results = await searchCatalog(query);

  return NextResponse.json({ query: query.trim(), results });
}

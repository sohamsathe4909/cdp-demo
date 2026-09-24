import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getUpcomingExpinar } from "@/lib/dashboard";
import { buildExpinarIcs } from "@/lib/ics";

/** GET /api/expinar/calendar — downloadable .ics for the next live Expinar. */
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expinar = await getUpcomingExpinar(user.id);
  const ics = buildExpinarIcs(expinar);

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="expinar.ics"',
      "Cache-Control": "no-store",
    },
  });
}

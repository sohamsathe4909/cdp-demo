import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getDashboardSummary } from "@/lib/dashboard";
import { getDisplayName } from "@/lib/user";

/** GET /api/dashboard — full learning-space dashboard summary for the signed-in user. */
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const name = getDisplayName(
    user.email ?? "",
    user.user_metadata as Record<string, unknown> | null,
  );

  const summary = await getDashboardSummary({
    userId: user.id,
    name,
  });

  return NextResponse.json(summary);
}

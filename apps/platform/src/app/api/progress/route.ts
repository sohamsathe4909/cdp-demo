import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

interface ProgressBody {
  trackId?: unknown;
  moduleIndex?: unknown;
  watchedSeconds?: unknown;
  activityDate?: unknown;
}

const MAX_WATCHED_SECONDS = 60 * 60 * 12; // clamp to 12 hours
const MAX_ACTIVITY_DELTA_SECONDS = 120; // cap per heartbeat (blocks seek-farming)

const ACTIVITY_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Local-time "YYYY-MM-DD" for the server (fallback when the client omits it). */
function serverDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * POST /api/progress — persist video watch progress so "Resume video"
 * continues where the learner left off.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ProgressBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const trackId = typeof body.trackId === "string" ? body.trackId.trim() : "";
  const moduleIndex =
    typeof body.moduleIndex === "number" && Number.isInteger(body.moduleIndex)
      ? body.moduleIndex
      : NaN;
  const watchedSeconds =
    typeof body.watchedSeconds === "number" &&
    Number.isFinite(body.watchedSeconds)
      ? Math.max(0, Math.min(Math.round(body.watchedSeconds), MAX_WATCHED_SECONDS))
      : NaN;

  if (!trackId || !Number.isInteger(moduleIndex) || moduleIndex < 1 || Number.isNaN(watchedSeconds)) {
    return NextResponse.json(
      { error: "trackId, moduleIndex and watchedSeconds are required" },
      { status: 400 },
    );
  }

  // Demo mode: acknowledge without persisting (no database configured).
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      persisted: false,
      trackId,
      moduleIndex,
      watchedSeconds,
      completed: false,
      activityRecorded: false,
    });
  }

  const activityDate =
    typeof body.activityDate === "string" &&
    ACTIVITY_DATE_RE.test(body.activityDate)
      ? body.activityDate
      : serverDateKey();

  const [durationRes, previousRes] = await Promise.all([
    supabase
      .from("modules")
      .select("duration_seconds")
      .eq("track_id", trackId)
      .eq("module_index", moduleIndex)
      .maybeSingle(),
    supabase
      .from("module_progress")
      .select("watched_seconds, completed")
      .eq("user_id", user.id)
      .eq("track_id", trackId)
      .eq("module_index", moduleIndex)
      .maybeSingle(),
  ]);

  const durationSeconds = durationRes.data?.duration_seconds ?? 0;
  const completed =
    durationSeconds > 0 && watchedSeconds >= durationSeconds - 5;

  const previousWatched = previousRes.data?.watched_seconds ?? 0;
  const justCompleted = completed && previousRes.data?.completed !== true;
  // Seconds newly watched since the last save — the streak/chart input.
  const learnedDelta = Math.min(
    Math.max(watchedSeconds - previousWatched, 0),
    MAX_ACTIVITY_DELTA_SECONDS,
  );

  const { error } = await supabase.from("module_progress").upsert(
    {
      user_id: user.id,
      track_id: trackId,
      module_index: moduleIndex,
      watched_seconds: watchedSeconds,
      completed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,track_id,module_index" },
  );

  if (error) {
    return NextResponse.json(
      { error: `Failed to save progress: ${error.message}` },
      { status: 500 },
    );
  }

  // Record today's learning activity (streak + charts). Non-fatal: the
  // migration may not be applied yet, and progress must not fail over it.
  let activityRecorded = false;

  if (learnedDelta > 0 || justCompleted) {
    const { error: activityError } = await supabase.rpc(
      "record_learning_activity",
      {
        p_activity_date: activityDate,
        p_learned_seconds: learnedDelta,
        p_module_completed: justCompleted,
      },
    );

    if (activityError) {
      console.warn("[progress] failed to record activity:", activityError.message);
    } else {
      activityRecorded = true;
    }
  }

  let trackCompletedModules: number | null = null;

  if (completed) {
    const { count } = await supabase
      .from("module_progress")
      .select("module_index", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("track_id", trackId)
      .eq("completed", true);

    trackCompletedModules = count ?? 0;

    await supabase.from("track_progress").upsert(
      {
        user_id: user.id,
        track_id: trackId,
        status: "in_progress",
        completed_modules: trackCompletedModules,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,track_id" },
    );
  }

  return NextResponse.json({
    ok: true,
    persisted: true,
    trackId,
    moduleIndex,
    watchedSeconds,
    completed,
    trackCompletedModules,
    activityRecorded,
    activityDelta: learnedDelta,
  });
}

import type {
  ActivityCharts,
  CurrentModule,
  DashboardSummary,
  JourneyStep,
  LiveExpinar,
  ProgramPlan,
  StreakInfo,
  TrackProgress,
  CareerFitReport,
  BadgeInfo,
} from "@cdp/types";

import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/client";
import { buildActivityParts, dateKey } from "./activity";
import {
  formatDuration,
  formatExpinarDate,
  formatExpinarTime,
  formatWeekday,
  getGreeting,
} from "./dashboard-format";
import {
  CAREER_FIT_BLURB,
  DEMO_CURRENT_DAY,
  DEMO_MODULE_NOTES,
  DEMO_TOTAL_DAYS,
  DEMO_VIDEO_URL,
  EXPINAR_JOIN_NOTE,
  buildDemoCareerFit,
  buildDemoExpinar,
  buildDemoTracks,
  buildProgramPlan,
  buildDemoActivityRows,
  DEMO_BADGES,
} from "./dashboard-demo";
import { getFirstName } from "./user";

/**
 * Server-side data service for the learning-space dashboard.
 *
 * Reads from Supabase when it is configured and the dashboard tables are
 * seeded; otherwise it falls back to demo data so the UI always renders
 * the complete dashboard (see infrastructure/supabase/migrations).
 */

interface SummaryParts {
  program: ProgramPlan;
  currentModule: CurrentModule;
  activeTrack: { completed: number; total: number };
  quizzesDone: number;
  liveExpinar: LiveExpinar;
  tracks: TrackProgress[];
  badges: BadgeInfo[];
  careerFit: CareerFitReport;
}

// Supabase results are untyped here (demo fallback client), so this helper
// validates shape while keeping downstream code readable.
function must<T = any>(result: any, label: string): T {
  if (result?.error) {
    throw new Error(`${label}: ${result.error.message}`);
  }

  if (result?.data == null) {
    throw new Error(`${label}: no data`);
  }

  return result.data as T;
}

/**
 * `.maybeSingle()` answers `data: null` when the row simply does not exist yet
 * — for example a learner who signed up before the provisioning trigger from
 * migration 0002 ran. That is an empty state, not a failed query, so it must
 * not be thrown: throwing here used to collapse the whole dashboard into demo
 * data even though every other table read succeeded.
 */
function mustMaybeSingle<T = any>(result: any, label: string): T {
  if (result?.error) {
    throw new Error(`${label}: ${result.error.message}`);
  }

  if (result?.data == null) {
    console.warn(
      `[dashboard] ${label} row is missing — using defaults instead of demo data`,
    );
    return {} as T;
  }

  return result.data as T;
}

function pluralizeQuizzes(count: number): string {
  if (count === 0) return "Not started yet";
  return count === 1 ? "1 quiz done" : `${count} quizzes done`;
}

function buildSteps(
  activeTrack: { completed: number; total: number },
  quizzesDone: number,
  expinarDateLabel: string,
): JourneyStep[] {
  const watchDone = activeTrack.total > 0 && activeTrack.completed >= activeTrack.total;

  return [
    {
      key: "watch",
      label: "Watch",
      meta:
        activeTrack.total > 0
          ? `${activeTrack.completed} of ${activeTrack.total} modules`
          : "No modules yet",
      state: watchDone ? "done" : "active",
    },
    {
      key: "check",
      label: "Check",
      meta: pluralizeQuizzes(quizzesDone),
      state: watchDone ? "active" : "upcoming",
    },
    {
      key: "expinar",
      label: "Expinar",
      meta: expinarDateLabel,
      state: "upcoming",
    },
    {
      key: "simulation",
      label: "Simulation",
      meta: "Opens after the Expinar",
      state: "upcoming",
    },
  ];
}

function buildSummaryPartsDemo(): SummaryParts {
  const totalModules = 8;
  const completedModules = 3;
  const durationSeconds = 22 * 60 + 10;
  const watchedSeconds = 9 * 60;

  return {
    program: buildProgramPlan(),
    currentModule: {
      trackId: "track-equity",
      trackTitle: "Equity Research",
      moduleIndex: 3,
      totalModules,
      title: "How analysts build an earnings model",
      durationLabel: formatDuration(durationSeconds),
      durationSeconds,
      watchedSeconds,
      quizAfterVideo: true,
      videoUrl: DEMO_VIDEO_URL,
      notes: DEMO_MODULE_NOTES,
    },
    activeTrack: { completed: completedModules, total: totalModules },
    quizzesDone: 2,
    liveExpinar: buildDemoExpinar(),
    tracks: buildDemoTracks(),
    badges: DEMO_BADGES,
    careerFit: buildDemoCareerFit(),
  };
}

async function buildSummaryPartsDb(
  supabase: any,
  userId: string,
): Promise<SummaryParts> {
  const nowIso = new Date().toISOString();

  const [
    programRes,
    tracksRes,
    trackProgressRes,
    badgesRes,
    userBadgesRes,
    eventRes,
    quizRes,
    fitRes,
  ] = await Promise.all([
    supabase
      .from("program_progress")
      .select("current_day, total_days, expinar_days")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase.from("tracks").select("*").order("sort_order"),
    supabase
      .from("track_progress")
      .select("track_id, status, completed_modules")
      .eq("user_id", userId),
    supabase.from("badges").select("*").order("sort_order"),
    supabase.from("user_badges").select("badge_id").eq("user_id", userId),
    supabase
      .from("expinar_events")
      .select("*")
      .gte("starts_at", nowIso)
      .order("starts_at")
      .limit(1),
    supabase
      .from("quiz_attempts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("passed", true),
    supabase
      .from("career_fit_report")
      .select("opens_day, progress_percent, blurb")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  const program = mustMaybeSingle(programRes, "program_progress");
  const tracks = must(tracksRes, "tracks");
  const trackProgress = must(trackProgressRes, "track_progress");
  const badges = must(badgesRes, "badges");
  const userBadges = must(userBadgesRes, "user_badges");

  if (tracks.length === 0) {
    throw new Error("tracks: tables not seeded");
  }

  const progressByTrack = new Map<string, any>(
    trackProgress.map(
      (row: any): [string, any] => [row.track_id as string, row],
    ),
  );

  const currentDay: number = program.current_day ?? DEMO_CURRENT_DAY;

  const trackRows: TrackProgress[] = tracks.map((track: any) => {
    const progress = progressByTrack.get(track.id);
    const storedStatus: TrackProgress["status"] =
      progress?.status === "in_progress" ||
      progress?.status === "started" ||
      progress?.status === "available"
        ? progress.status
        : "locked";

    const unlockDay: number | null = track.unlock_day ?? null;

    // A locked track whose unlock day has arrived is now open.
    const status: TrackProgress["status"] =
      storedStatus === "locked" &&
      unlockDay != null &&
      unlockDay <= currentDay
        ? "available"
        : storedStatus;

    return {
      id: track.id,
      title: track.title,
      completedModules: progress?.completed_modules ?? 0,
      totalModules: track.total_modules ?? 0,
      status,
      statusLabel:
        status === "in_progress"
          ? "In progress"
          : status === "started"
            ? "Started"
            : status === "available"
              ? "Open"
              : `Opens day ${unlockDay}`,
      unlockDay,
    };
  });

  // Active track = the one in progress, else the first started, else the first track.
  const activeRow =
    trackRows.find((row) => row.status === "in_progress") ??
    trackRows.find((row) => row.status === "started") ??
    trackRows[0];

  const [modulesRes, moduleProgressRes] = await Promise.all([
    supabase
      .from("modules")
      .select("*")
      .eq("track_id", activeRow.id)
      .order("module_index"),
    supabase
      .from("module_progress")
      .select("module_index, watched_seconds, completed")
      .eq("user_id", userId)
      .eq("track_id", activeRow.id),
  ]);

  const modules = must(modulesRes, "modules");
  const moduleProgress = must(moduleProgressRes, "module_progress");

  if (modules.length === 0) {
    throw new Error("modules: tables not seeded");
  }

  const progressByModule = new Map<number, any>(
    moduleProgress.map(
      (row: any): [number, any] => [row.module_index as number, row],
    ),
  );

  const nextModule =
    modules.find((module: any) => !progressByModule.get(module.module_index)?.completed) ??
    modules[modules.length - 1];

  const nextProgress = progressByModule.get(nextModule.module_index);
  const event = (eventRes.data ?? [])[0];

  const liveExpinar: LiveExpinar = event
    ? {
        id: event.id,
        title: event.title,
        detail: event.detail ?? "",
        startsAt: event.starts_at,
        dateLabel: formatExpinarDate(new Date(event.starts_at)),
        timeLabel: formatExpinarTime(new Date(event.starts_at)),
        joinNote: event.join_note || EXPINAR_JOIN_NOTE,
      }
    : buildDemoExpinar();

  const earnedIds = new Set(
    userBadges.map((row: any) => row.badge_id as string),
  );
  const badgeItems: BadgeInfo[] = badges.map((badge: any) => ({
    id: badge.id,
    name: badge.name,
    earned: earnedIds.has(badge.id),
  }));

  const notes: string[] = Array.isArray(nextModule.notes)
    ? nextModule.notes.filter((note: unknown) => typeof note === "string")
    : [];

  const currentModule: CurrentModule = {
    trackId: activeRow.id,
    trackTitle: activeRow.title,
    moduleIndex: nextModule.module_index,
    totalModules: modules.length,
    title: nextModule.title,
    durationLabel: formatDuration(nextModule.duration_seconds ?? 0),
    durationSeconds: nextModule.duration_seconds ?? 0,
    watchedSeconds: nextProgress?.watched_seconds ?? 0,
    quizAfterVideo: true,
    videoUrl: nextModule.video_url ?? DEMO_VIDEO_URL,
    notes,
  };

  const fit = fitRes.data;

  const careerFit: CareerFitReport = {
    opensDay: fit?.opens_day ?? DEMO_TOTAL_DAYS,
    progressPercent: fit?.progress_percent ?? 0,
    blurb: fit?.blurb || CAREER_FIT_BLURB,
  };

  return {
    program: buildProgramPlan(
      program.current_day ?? DEMO_CURRENT_DAY,
      program.total_days ?? DEMO_TOTAL_DAYS,
      program.expinar_days ?? [],
    ),
    currentModule,
    activeTrack: {
      completed: activeRow.completedModules,
      total: activeRow.totalModules,
    },
    quizzesDone: quizRes.count ?? 0,
    liveExpinar,
    tracks: trackRows,
    badges: badgeItems,
    careerFit,
  };
}

async function loadSummaryParts(userId: string): Promise<SummaryParts> {
  if (!isSupabaseConfigured()) {
    return buildSummaryPartsDemo();
  }

  try {
    const supabase = await createClient();
    return await buildSummaryPartsDb(supabase, userId);
  } catch (error) {
    // Missing migration or unseeded tables — keep the dashboard usable.
    console.warn("[dashboard] falling back to demo data:", error);
    return buildSummaryPartsDemo();
  }
}

interface ActivityParts {
  streak: StreakInfo;
  activity: ActivityCharts;
}

/**
 * Streak + chart data. Reads public.learning_activity (migration 0003);
 * falls back to the deterministic demo rows when the table is missing or
 * still empty, so the activity card always renders.
 */
async function loadActivityParts(
  userId: string,
  parts: SummaryParts,
): Promise<ActivityParts> {
  const options = {
    currentDay: parts.program.currentDay,
    totalDays: parts.program.totalDays,
    totalModules: parts.tracks.reduce(
      (sum, track) => sum + track.totalModules,
      0,
    ),
  };

  try {
    if (!isSupabaseConfigured()) {
      throw new Error("demo mode");
    }

    const supabase = await createClient();
    const since = new Date();
    since.setDate(since.getDate() - 59);

    const result = await supabase
      .from("learning_activity")
      .select("activity_date, learned_seconds, modules_completed")
      .eq("user_id", userId)
      .gte("activity_date", dateKey(since))
      .order("activity_date", { ascending: true });

    if (result.error) {
      throw new Error(result.error.message);
    }

    const rows = (result.data ?? []).map((row: any) => ({
      date: String(row.activity_date),
      learnedSeconds: Number(row.learned_seconds) || 0,
      modulesCompleted: Number(row.modules_completed) || 0,
    }));

    if (rows.length === 0) {
      throw new Error("no activity rows yet");
    }

    return buildActivityParts(rows, options);
  } catch (error) {
    // Optional table — never fail the whole dashboard over it.
    console.warn("[dashboard] falling back to demo activity:", error);
    return buildActivityParts(
      buildDemoActivityRows(options.currentDay),
      options,
    );
  }
}

export async function getDashboardSummary(options: {
  userId: string;
  name: string;
}): Promise<DashboardSummary> {
  const parts = await loadSummaryParts(options.userId);
  const activity = await loadActivityParts(options.userId, parts);
  const firstName = getFirstName(options.name);
  const now = new Date();

  const noteSecondSentence =
    parts.program.totalDays > 0
      ? ` Finish module ${parts.currentModule.moduleIndex} before ${formatWeekday(
          new Date(parts.liveExpinar.startsAt),
        )}'s Expinar.`
      : "";

  return {
    firstName,
    greeting: getGreeting(now),
    headlineNote:
      `You are on day ${parts.program.currentDay} of ${parts.program.totalDays}.` +
      noteSecondSentence,
    program: parts.program,
    currentModule: parts.currentModule,
    steps: buildSteps(
      parts.activeTrack,
      parts.quizzesDone,
      parts.liveExpinar.dateLabel,
    ),
    liveExpinar: parts.liveExpinar,
    tracks: parts.tracks,
    streak: activity.streak,
    activity: activity.activity,
    badges: {
      earned: parts.badges.filter((badge) => badge.earned).length,
      total: parts.badges.length,
      items: parts.badges,
    },
    careerFit: parts.careerFit,
  };
}

/** The next upcoming Expinar — used by the summary and the .ics endpoint. */
export async function getUpcomingExpinar(
  userId: string,
): Promise<LiveExpinar> {
  const parts = await loadSummaryParts(userId);
  return parts.liveExpinar;
}

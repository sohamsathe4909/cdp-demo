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
import { buildActivityParts, type ActivityInputRow } from "./activity";
import {
  addDaysToKey,
  dateKey,
  dayNumberBetween,
  formatDayMonth,
  formatWeekdayDate,
} from "./dates";
import {
  completedSectionCount,
  getCurriculum,
  progressFromRows,
  type ProgressRow,
} from "./career-curriculum";
import { careerIdForTrack } from "./career-tracks";
import {
  formatDuration,
  formatExpinarDate,
  formatExpinarTime,
  formatWeekday,
  getGreeting,
} from "./dashboard-format";
import {
  CAREER_FIT_BLURB,
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
  /** Null when expinar_events holds no future session — never invented. */
  liveExpinar: LiveExpinar | null;
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

/** Journey-step label for the Expinar when no session is scheduled. */
const EXPINAR_NOT_SCHEDULED = "Not scheduled";

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
    // Same derivation as the database path, so demo mode and /careers agree.
    tracks: buildDemoTracks().map((row) => syllabusTrackRow(row, [])),
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
      .select("current_day, total_days, expinar_days, started_at")
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

  const totalDays: number = program.total_days ?? DEMO_TOTAL_DAYS;
  const storedDay: number = program.current_day ?? 1;
  const startedAt: string | null =
    typeof program.started_at === "string" ? program.started_at : null;
  const storedExpinarDays: number[] = Array.isArray(program.expinar_days)
    ? program.expinar_days.filter((day: unknown): day is number => typeof day === "number")
    : [];

  // A learner without a program_progress row starts on day 1.
  //
  // Day rolls forward with the calendar: `started_at` is day 1, so the
  // elapsed day advances daily and the strip's rolling window slides with
  // it. Nothing else writes current_day, so it is derived here and
  // persisted whenever it moves — plus a row is created for accounts that
  // don't have one yet, since the demo seed that used to write it is gone.
  const anchorKey: string = startedAt ? startedAt.slice(0, 10) : dateKey(new Date());
  const anchorDay: number = startedAt ? 1 : storedDay;
  const rolledDay: number | null = dayNumberBetween(
    anchorKey,
    anchorDay,
    dateKey(new Date()),
  );
  // Not clamped to totalDays: the strip shows a rolling window whose cells
  // carry true elapsed day numbers (day 31+ once the plan is past).
  const currentDay: number = Math.max(storedDay, rolledDay ?? storedDay);

  if (currentDay !== storedDay || startedAt == null) {
    const { error: dayError } = await supabase.from("program_progress").upsert(
      {
        user_id: userId,
        current_day: currentDay,
        total_days: totalDays,
        expinar_days: storedExpinarDays,
        started_at: startedAt ?? dateKey(new Date()),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (dayError) {
      console.warn("[dashboard] program day not persisted:", dayError.message);
    }
  }

  const trackRows: TrackProgress[] = tracks.map((track: any) => {
    const progress = progressByTrack.get(track.id);
    const unlockDay: number | null = track.unlock_day ?? null;
    const unlocked = unlockDay == null || unlockDay <= currentDay;

    const storedStatus: TrackProgress["status"] =
      progress?.status === "in_progress" ||
      progress?.status === "started" ||
      progress?.status === "available"
        ? progress.status
        : progress == null
          ? // Never touched (no row — the demo seed no longer writes one):
            // open as soon as its unlock day has arrived.
              unlocked
              ? "available"
              : "locked"
          : "locked";

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
              : unlockDay != null
                ? `Opens ${formatDayMonth(addDaysToKey(anchorKey, unlockDay - anchorDay))} (day ${unlockDay})`
                : "Locked",
      unlockDay,
    };
  });

  // Tracks with a syllabus read their totals from /careers progress so the
  // dashboard and the career page can never disagree.
  const syncedTrackRows = await withSyllabusProgress(
    supabase,
    userId,
    trackRows,
  );

  // Active track = the one in progress, else the first started, else the first track.
  const activeRow =
    syncedTrackRows.find((row) => row.status === "in_progress") ??
    syncedTrackRows.find((row) => row.status === "started") ??
    syncedTrackRows[0];

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

  // No future session in expinar_events → null, not an invented one: the
  // card renders its "No upcoming session" state instead of a fabricated
  // demo session whose date is made up from the clock.
  // (buildSummaryPartsDemo() keeps buildDemoExpinar() — with no database
  // configured there is nothing to be honest about.)
  const liveExpinar: LiveExpinar | null = event
    ? {
        id: event.id,
        title: event.title,
        detail: event.detail ?? "",
        startsAt: event.starts_at,
        dateLabel: formatExpinarDate(new Date(event.starts_at)),
        timeLabel: formatExpinarTime(new Date(event.starts_at)),
        joinNote: event.join_note || EXPINAR_JOIN_NOTE,
      }
    : null;

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
  const opensDay: number = fit?.opens_day ?? DEMO_TOTAL_DAYS;

  const careerFit: CareerFitReport = {
    opensDay,
    opensDateLabel: formatDayMonth(
      addDaysToKey(anchorKey, opensDay - anchorDay),
    ),
    progressPercent: fit?.progress_percent ?? 0,
    blurb: fit?.blurb || CAREER_FIT_BLURB,
  };

  // Expinar markers: keep the stored ones and always add the *live* event's
  // program day (e.g. next Thursday is day N of *this* learner's plan), so
  // the strip's yellow dot lands on the real date for every account.
  const liveExpinarDay: number | null =
    liveExpinar != null
      ? dayNumberBetween(
          anchorKey,
          anchorDay,
          dateKey(new Date(liveExpinar.startsAt)),
        )
      : null;
  const expinarDays: number[] = Array.from(
    new Set([
      ...storedExpinarDays,
      // No upper clamp: cells carry unclamped day numbers and the visible
      // window runs past day 30, so an in-window event keeps its dot
      // whenever its date is on screen — even after the plan's day 30.
      ...(liveExpinarDay != null && liveExpinarDay >= 1
        ? [liveExpinarDay]
        : []),
    ]),
  ).sort((a, b) => a - b);

  return {
    program: buildProgramPlan(currentDay, totalDays, expinarDays, {
      key: anchorKey,
      day: anchorDay,
    }),
    currentModule,
    activeTrack: {
      completed: activeRow.completedModules,
      total: activeRow.totalModules,
    },
    quizzesDone: quizRes.count ?? 0,
    liveExpinar,
    tracks: syncedTrackRows,
    badges: badgeItems,
    careerFit,
  };
}

/**
 * Replace a track row's counters with syllabus-derived ones: "1 of 14" on
 * the dashboard is literally the same state as "1 of 14 sections complete"
 * on /careers. Rows with no syllabus pass through untouched.
 */
function syllabusTrackRow(
  row: TrackProgress,
  careerRows: readonly (ProgressRow & { career_id?: string })[],
): TrackProgress {
  const careerId = careerIdForTrack(row.id);
  const curriculum = careerId ? getCurriculum(careerId) : undefined;
  if (!curriculum) return row;

  const state = progressFromRows(
    curriculum,
    careerRows.filter((entry) => entry.career_id === careerId),
  );

  return {
    ...row,
    completedModules: completedSectionCount(curriculum, state),
    totalModules: curriculum.sections.length,
  };
}

/**
 * Overlay syllabus-derived totals (public.career_progress, migration 0004)
 * onto the seeded track rows.
 *
 * Returns the rows untouched when the table hasn't been migrated yet — the
 * careers feature must never fail the whole dashboard.
 */
async function withSyllabusProgress(
  supabase: any,
  userId: string,
  rows: TrackProgress[],
): Promise<TrackProgress[]> {
  if (!rows.some((row) => careerIdForTrack(row.id))) return rows;

  let careerRows: any[];

  try {
    const result = await supabase
      .from("career_progress")
      .select("career_id, item_id, completed")
      .eq("user_id", userId);

    if (result.error) throw new Error(result.error.message);
    careerRows = result.data ?? [];
  } catch (error) {
    console.warn("[dashboard] syllabus progress unavailable:", error);
    return rows;
  }

  return rows.map((row) => syllabusTrackRow(row, careerRows));
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
 * Raw rows from public.learning_activity (migration 0003).
 *
 * Only needs `userId`, so the caller starts it in parallel with
 * loadSummaryParts instead of awaiting it afterwards — the two database
 * round-trips overlap instead of stacking. Returns null when Supabase is
 * unconfigured or the table is missing, so the caller can substitute the
 * deterministic demo rows and keep the activity card rendering. A
 * configured account with no history yet gets an empty array — zeros,
 * not fiction.
 */
async function loadActivityRows(
  userId: string,
): Promise<ActivityInputRow[] | null> {
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

    const rows: ActivityInputRow[] = (result.data ?? []).map((row: any) => ({
      date: String(row.activity_date),
      learnedSeconds: Number(row.learned_seconds) || 0,
      modulesCompleted: Number(row.modules_completed) || 0,
    }));

    // An empty result is a learner with no history yet — hand back an
    // empty array so the charts render zeros instead of demo data.
    return rows;
  } catch (error) {
    // Optional table — never fail the whole dashboard over it.
    console.warn("[dashboard] falling back to demo activity:", error);
    return null;
  }
}

/**
 * Shape activity rows (or the demo substitute when rows is null) into the
 * streak + chart payloads. Needs the finished summary parts to size the
 * charts, which is why this runs after loadSummaryParts — but only the
 * shaping runs here, not the database read.
 */
function buildActivityFromRows(
  rows: ActivityInputRow[] | null,
  parts: SummaryParts,
): ActivityParts {
  const options = {
    currentDay: parts.program.currentDay,
    totalDays: parts.program.totalDays,
    totalModules: parts.tracks.reduce(
      (sum, track) => sum + track.totalModules,
      0,
    ),
  };

  if (rows == null) {
    return buildActivityParts(
      buildDemoActivityRows(options.currentDay),
      options,
    );
  }

  return buildActivityParts(rows, options);
}

export async function getDashboardSummary(options: {
  userId: string;
  name: string;
}): Promise<DashboardSummary> {
  // The activity query only needs userId, so start it first and let it
  // overlap with the summary round-trips instead of stacking after them.
  const activityRowsPromise = loadActivityRows(options.userId);
  const parts = await loadSummaryParts(options.userId);
  const activity = buildActivityFromRows(await activityRowsPromise, parts);
  const firstName = getFirstName(options.name);
  const now = new Date();

  const noteSecondSentence =
    parts.program.totalDays > 0 && parts.liveExpinar != null
      ? ` Finish module ${parts.currentModule.moduleIndex} before ${formatWeekday(
          new Date(parts.liveExpinar.startsAt),
        )}'s Expinar.`
      : "";

  const elapsedDay = parts.program.currentDay;
  const todayKey = dateKey(now);

  const dayNote =
    elapsedDay <= parts.program.totalDays
      ? `Today is ${formatWeekdayDate(todayKey)} — day ${elapsedDay} of ${parts.program.totalDays}.`
      : `Today is ${formatWeekdayDate(todayKey)} — day ${elapsedDay}. Your ${parts.program.totalDays}-day plan is complete.`;

  return {
    firstName,
    greeting: getGreeting(now),
    headlineNote: dayNote + noteSecondSentence,
    program: parts.program,
    currentModule: parts.currentModule,
    steps: buildSteps(
      parts.activeTrack,
      parts.quizzesDone,
      parts.liveExpinar?.dateLabel ?? EXPINAR_NOT_SCHEDULED,
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

/**
 * The next upcoming Expinar — used by the summary and the .ics endpoint.
 * Null when the catalog has no future session (no invented fallback).
 */
export async function getUpcomingExpinar(
  userId: string,
): Promise<LiveExpinar | null> {
  const parts = await loadSummaryParts(userId);
  return parts.liveExpinar;
}

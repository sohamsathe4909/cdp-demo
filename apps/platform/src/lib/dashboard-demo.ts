import type {
  BadgeInfo,
  CareerFitReport,
  LiveExpinar,
  ProgramDay,
  ProgramPlan,
  TrackProgress,
} from "@cdp/types";

import { formatExpinarDate, formatExpinarTime } from "./dashboard-format";

/**
 * Fallback data used when Supabase is not configured (or the dashboard
 * tables are not seeded yet). Values mirror the CDP learning-space
 * dashboard: day 12 of 30, Equity Research module 3 of 8, 2 of 12 badges.
 */

export const DEMO_TOTAL_DAYS = 30;
export const DEMO_CURRENT_DAY = 12;
export const DEMO_EXPINAR_DAYS = [5, 9, 14, 20, 26];

// Public sample video so "Resume video" works in demo mode.
export const DEMO_VIDEO_URL =
  "https://mdn.github.io/shared-assets/videos/flower.mp4";

export const CAREER_FIT_BLURB =
  "Builds from your quizzes, simulations and assessment. It opens once all five tracks are done.";

export const EXPINAR_JOIN_NOTE =
  "The join link opens 10 minutes before the start.";

export const DEMO_MODULE_NOTES = [
  "How analysts structure an earnings model from the ground up",
  "Revenue drivers vs. one-off items — what to strip out",
  "Building the consensus bridge and flagging surprises",
  "What to write when your numbers disagree with the street",
];

export const DEMO_TRACKS: Array<{
  id: string;
  title: string;
  totalModules: number;
  unlockDay: number | null;
  completedModules: number;
  status: TrackProgress["status"];
}> = [
  {
    id: "track-equity",
    title: "Equity Research",
    totalModules: 8,
    unlockDay: null,
    completedModules: 3,
    status: "in_progress",
  },
  {
    id: "track-ib",
    title: "Investment Banking",
    totalModules: 7,
    unlockDay: null,
    completedModules: 1,
    status: "started",
  },
  {
    id: "track-pe",
    title: "Private Equity and VC",
    totalModules: 6,
    unlockDay: 15,
    completedModules: 0,
    status: "locked",
  },
  {
    id: "track-pw",
    title: "Private Wealth",
    totalModules: 6,
    unlockDay: 19,
    completedModules: 0,
    status: "locked",
  },
  {
    id: "track-fof",
    title: "Future of Finance",
    totalModules: 6,
    unlockDay: 23,
    completedModules: 0,
    status: "locked",
  },
];

export const DEMO_BADGES: BadgeInfo[] = [
  { id: "badge-first-step", name: "First step", earned: true },
  { id: "badge-quiz-ace", name: "Quiz ace", earned: true },
  { id: "badge-week-one", name: "Week one", earned: false },
  { id: "badge-model-builder", name: "Model builder", earned: false },
  { id: "badge-case-cracker", name: "Case cracker", earned: false },
  { id: "badge-live-attendee", name: "Live attendee", earned: false },
  { id: "badge-track-starter", name: "Track starter", earned: false },
  { id: "badge-sim-survivor", name: "Sim survivor", earned: false },
  { id: "badge-perfect-score", name: "Perfect score", earned: false },
  { id: "badge-streak-seven", name: "7-day streak", earned: false },
  { id: "badge-deep-diver", name: "Deep diver", earned: false },
  { id: "badge-career-fit", name: "Career-fit ready", earned: false },
];

/** The next Thursday at 7:00 pm local time (demo Expinar schedule). */
export function upcomingThursday(now: Date = new Date()): Date {
  const date = new Date(now);
  date.setHours(19, 0, 0, 0);

  const daysUntilThursday = (4 - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + daysUntilThursday);

  if (date.getTime() <= now.getTime()) {
    date.setDate(date.getDate() + 7);
  }

  return date;
}

export function buildProgramPlan(
  currentDay = DEMO_CURRENT_DAY,
  totalDays = DEMO_TOTAL_DAYS,
  expinarDays = DEMO_EXPINAR_DAYS,
): ProgramPlan {
  const days: ProgramDay[] = Array.from({ length: totalDays }, (_, index) => {
    const day = index + 1;

    return {
      day,
      state:
        day < currentDay
          ? ("done" as const)
          : day === currentDay
            ? ("today" as const)
            : ("upcoming" as const),
      isExpinarDay: expinarDays.includes(day),
    };
  });

  return { totalDays, currentDay, days };
}

export function buildDemoExpinar(now: Date = new Date()): LiveExpinar {
  const startsAt = upcomingThursday(now);

  return {
    id: "exp-demo-1",
    title: "A day on an equity research desk",
    detail:
      "Senior Analyst, equity research. Bring your questions from modules 1 to 3.",
    startsAt: startsAt.toISOString(),
    dateLabel: formatExpinarDate(startsAt),
    timeLabel: formatExpinarTime(startsAt),
    joinNote: EXPINAR_JOIN_NOTE,
  };
}

export function buildDemoTracks(
  currentDay = DEMO_CURRENT_DAY,
): TrackProgress[] {
  return DEMO_TRACKS.map((track) => {
    const status: TrackProgress["status"] =
      track.status === "locked" &&
      track.unlockDay != null &&
      track.unlockDay <= currentDay
        ? "available"
        : track.status;

    return {
      id: track.id,
      title: track.title,
      completedModules: track.completedModules,
      totalModules: track.totalModules,
      status,
      statusLabel:
        status === "in_progress"
          ? "In progress"
          : status === "started"
            ? "Started"
            : status === "available"
              ? "Open"
              : `Opens day ${track.unlockDay}`,
      unlockDay: track.unlockDay,
    };
  });
}

export function buildDemoCareerFit(): CareerFitReport {
  return {
    opensDay: 30,
    progressPercent: 15,
    blurb: CAREER_FIT_BLURB,
  };
}

/** Days ago with no activity — exactly one gap inside the 12-day window. */
const DEMO_ACTIVITY_GAP_DAYS = [5];

/** Days ago a module was completed (4 completed → 12% of 33 modules). */
const DEMO_ACTIVITY_MODULE_DAYS = [11, 8, 6, 2];

export interface DemoActivityRow {
  date: string;
  learnedSeconds: number;
  modulesCompleted: number;
}

/**
 * Deterministic daily-activity rows for the streak + charts.
 * Mirrors migration 0003's seed exactly: day 12 window, one gap at day-5
 * back → current streak 5, longest 6 (keeps the 7-day badge unearned).
 */
export function buildDemoActivityRows(
  currentDay = DEMO_CURRENT_DAY,
): DemoActivityRow[] {
  const rows: DemoActivityRow[] = [];
  const today = new Date();

  for (let i = 0; i < currentDay; i += 1) {
    if (DEMO_ACTIVITY_GAP_DAYS.includes(i)) continue;

    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    rows.push({
      date: `${year}-${month}-${day}`,
      learnedSeconds: (15 + ((i * 7) % 34)) * 60, // 15–48 min, deterministic
      modulesCompleted: DEMO_ACTIVITY_MODULE_DAYS.includes(i) ? 1 : 0,
    });
  }

  return rows;
}

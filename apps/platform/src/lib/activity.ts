import type {
  ActivityBarPoint,
  ActivityCharts,
  ActivityDay,
  ActivityLinePoint,
  StreakInfo,
} from "@cdp/types";

import { formatExpinarDate, formatShortWeekday } from "./dashboard-format";

/**
 * Learning-activity computation: turns raw daily rows
 * (public.learning_activity, or the demo fallback) into the streak and
 * chart payloads rendered by the dashboard.
 */

/** A day counts as "learned" after at least one minute of video. */
export const LEARNED_MIN_SECONDS = 60;

/** How far back we look when computing the longest streak. */
const STREAK_WINDOW_DAYS = 60;

export interface ActivityInputRow {
  date: string; // "YYYY-MM-DD"
  learnedSeconds: number;
  modulesCompleted: number;
}

export interface ActivityOptions {
  currentDay: number;
  totalDays: number;
  totalModules: number;
}

/** Local-time "YYYY-MM-DD" (avoids UTC off-by-one on date keys). */
export function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function keyToDate(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function shiftDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function buildActivityParts(
  rows: ActivityInputRow[],
  options: ActivityOptions,
): { streak: StreakInfo; activity: ActivityCharts } {
  const byDate = new Map<string, ActivityInputRow>(
    rows.map((row) => [row.date, row]),
  );

  const today = new Date();
  const todayKey = dateKey(today);

  const secondsOn = (date: Date): number =>
    byDate.get(dateKey(date))?.learnedSeconds ?? 0;

  const learnedOn = (date: Date): boolean =>
    secondsOn(date) >= LEARNED_MIN_SECONDS;

  /* ---- Current streak ----
     Counts back from today; if today hasn't happened yet the streak is
     counted through yesterday so the number doesn't drop at midnight. */
  let current = 0;
  let cursor = new Date(today);

  if (!learnedOn(cursor)) {
    cursor = shiftDays(cursor, -1);
  }
  while (learnedOn(cursor)) {
    current += 1;
    cursor = shiftDays(cursor, -1);
  }

  /* ---- Longest streak within the fetched window ---- */
  let longest = 0;
  let run = 0;

  for (let i = 0; i < STREAK_WINDOW_DAYS; i += 1) {
    if (learnedOn(shiftDays(today, -i))) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }

  /* ---- Last 30 days, oldest → newest ---- */
  const days: ActivityDay[] = [];

  for (let i = 29; i >= 0; i -= 1) {
    const date = shiftDays(today, -i);
    const seconds = secondsOn(date);

    days.push({
      date: dateKey(date),
      label: formatExpinarDate(date),
      weekday: formatShortWeekday(date),
      minutes: Math.round(seconds / 60),
      learned: seconds >= LEARNED_MIN_SECONDS,
      isToday: i === 0,
    });
  }

  const todaySeconds = secondsOn(today);

  /* ---- Bar chart: last 7 days ---- */
  const bar: ActivityBarPoint[] = days.slice(-7).map((day) => ({
    label: `${day.weekday} ${Number(day.date.slice(8))}`,
    minutes: day.minutes,
  }));

  /* ---- Line chart: cumulative modules completed by program day ---- */
  const modulesByDate = new Map<string, number>();
  for (const row of rows) {
    modulesByDate.set(
      row.date,
      (modulesByDate.get(row.date) ?? 0) + row.modulesCompleted,
    );
  }

  const line: ActivityLinePoint[] = [];
  let completed = 0;

  for (let day = 1; day <= options.currentDay; day += 1) {
    const date = shiftDays(today, -(options.currentDay - day));
    completed += modulesByDate.get(dateKey(date)) ?? 0;

    const percent =
      options.totalModules > 0
        ? Math.min(100, Math.round((completed / options.totalModules) * 100))
        : 0;

    line.push({ day, percent });
  }

  return {
    streak: {
      current,
      longest,
      learnedToday: todaySeconds >= LEARNED_MIN_SECONDS,
      minutesToday: Math.round(todaySeconds / 60),
      days,
    },
    activity: { bar, line },
  };
}

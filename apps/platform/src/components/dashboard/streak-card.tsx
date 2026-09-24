import { Flame } from "lucide-react";

import type { StreakInfo } from "@cdp/types";

interface StreakCardProps {
  streak: StreakInfo;
}

/**
 * Udemy-style learning streak: current/longest count, last-30-days
 * activity dots, and a today status line.
 */
export function StreakCard({ streak }: StreakCardProps) {
  return (
    <section
      id="streak"
      className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_1px_3px_rgba(14,14,14,0.04)] sm:p-6"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-[-0.01em] text-[#0e0e0e]">
          Learning streak
        </h2>

        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f8dc03]"
          aria-hidden="true"
        >
          <Flame className="h-4 w-4 text-[#0e0e0e]" strokeWidth={2.5} />
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-bold tabular-nums tracking-[-0.03em] text-[#0e0e0e]">
          {streak.current}
        </span>
        <span className="text-sm font-medium text-[#5a5f58]">day streak</span>
      </div>

      <p className="mt-1 text-xs text-[#5a5f58]">
        Longest: {streak.longest} {streak.longest === 1 ? "day" : "days"} ·
        Today: {streak.minutesToday} min
      </p>

      <div className="mt-4 grid grid-cols-10 gap-1.5">
        {streak.days.map((day) => (
          <span
            key={day.date}
            title={`${day.label} · ${
              day.learned ? `${day.minutes} min learned` : "No activity"
            }`}
            className={
              "h-5 rounded-[6px] " +
              (day.learned
                ? "bg-[#f8dc03]"
                : "bg-[#ececea]") +
              (day.isToday ? " ring-2 ring-offset-1 ring-[#0e0e0e]" : "")
            }
          />
        ))}
      </div>

      <p
        className={
          "mt-4 rounded-xl px-3 py-2 text-xs font-medium leading-5 text-[#0e0e0e] " +
          (streak.learnedToday ? "bg-[#f9fff6]" : "bg-[#f8dc03]/25")
        }
      >
        {streak.learnedToday
          ? "✓ Learned today — streak safe"
          : "Learn today to keep your streak alive"}
      </p>
    </section>
  );
}

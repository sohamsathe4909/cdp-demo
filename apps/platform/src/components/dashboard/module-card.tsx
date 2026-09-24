import Link from "next/link";
import { Play } from "lucide-react";

import type { CurrentModule, JourneyStep } from "@cdp/types";

import { JourneySteps } from "./journey-steps";

interface ModuleCardProps {
  module: CurrentModule;
  steps: JourneyStep[];
}

/** The lesson itself (video + notes) lives on the careers page. */
const CAREERS_HREF = "/careers";

export function ModuleCard({ module, steps }: ModuleCardProps) {
  const duration = Math.max(1, module.durationSeconds);
  const progressPercent = Math.min(
    100,
    Math.round((module.watchedSeconds / duration) * 100),
  );
  const watchedMinutes = Math.floor(module.watchedSeconds / 60);
  const totalMinutes = Math.floor(duration / 60);

  return (
    <section
      id="current-module"
      className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_1px_3px_rgba(14,14,14,0.04)] sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
        {/* Video thumbnail → careers (the lesson plays there) */}
        <Link
          href={CAREERS_HREF}
          aria-label={`Resume video: ${module.title}`}
          className="group relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-[#0e0e0e] sm:w-[260px]"
        >
          {/* Decorative bar chart */}
          <span
            aria-hidden
            className="absolute bottom-0 left-0 flex h-full w-full items-end gap-1.5 px-4 pb-4"
          >
            {[36, 58, 44, 74, 64, 88].map((height, index) => (
              <span
                key={index}
                style={{ height: `${height}%` }}
                className="w-full max-w-[26px] rounded-[3px] bg-white/25 transition group-hover:bg-white/40"
              />
            ))}
          </span>

          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f8dc03] shadow-lg transition group-hover:scale-105">
            <Play className="ml-0.5 h-6 w-6 fill-[#0e0e0e] text-[#0e0e0e]" />
          </span>

          <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {module.durationLabel}
          </span>
        </Link>

        {/* Module info */}
        <div className="min-w-0 flex-1">
          <p className="text-sm text-[#5a5f58]">
            {module.trackTitle}, module {module.moduleIndex} of{" "}
            {module.totalModules}
          </p>

          <h2 className="mt-1 text-xl font-bold leading-snug tracking-[-0.02em] text-[#0e0e0e] sm:text-2xl">
            {module.title}
          </h2>

          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#e9e9e4]">
            <div
              className="h-full rounded-full bg-[#1ed2f4] transition-[width] duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-[#5a5f58]">
            <span>
              {watchedMinutes} of {totalMinutes} min watched
            </span>

            {module.quizAfterVideo && <span>Quiz after this video</span>}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={CAREERS_HREF}
              className="inline-flex h-10 items-center rounded-full bg-[#f8dc03] px-5 text-sm font-semibold text-[#0e0e0e] transition hover:bg-[#ffe14a]"
            >
              Resume video
            </Link>

            <Link
              href={CAREERS_HREF}
              className="inline-flex h-10 items-center rounded-full border border-[#0e0e0e]/15 bg-white px-5 text-sm font-medium text-[#0e0e0e] transition hover:border-[#0e0e0e]"
            >
              Module notes
            </Link>
          </div>
        </div>
      </div>

      <JourneySteps steps={steps} />
    </section>
  );
}

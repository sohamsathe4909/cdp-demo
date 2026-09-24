import Link from "next/link";

import type { TrackProgress } from "@cdp/types";

import { cn } from "@/lib/utils";

export function TracksCard({ tracks }: { tracks: TrackProgress[] }) {
  return (
    <section
      id="your-tracks"
      className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_1px_3px_rgba(14,14,14,0.04)]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-lg font-semibold tracking-[-0.01em] text-[#0e0e0e]">
          Your tracks
        </h2>

        <p className="text-sm text-[#5a5f58]">
          One track at a time works best
        </p>
      </div>

      <div className="mt-3">
        {tracks.map((track) => {
          const percent =
            track.totalModules > 0
              ? Math.round((track.completedModules / track.totalModules) * 100)
              : 0;
          const locked = track.status === "locked";
          // Only In progress, Started or Open tracks link to Careers.
          const clickable = !locked;

          return (
            <div
              key={track.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 py-3.5 sm:grid-cols-[minmax(0,170px)_minmax(0,1fr)_auto_130px] sm:gap-x-6"
            >
              {clickable ? (
                <Link
                  href="/careers"
                  className="truncate text-sm font-medium text-[#0e0e0e] underline-offset-4 transition hover:underline hover:decoration-[#1ed2f4]"
                >
                  {track.title}
                </Link>
              ) : (
                <p className="truncate text-sm font-medium text-[#0e0e0e]">
                  {track.title}
                </p>
              )}

              <p
                className={cn(
                  "text-right text-sm sm:col-start-4 sm:row-start-1",
                  locked
                    ? "font-normal text-[#8a8f88]"
                    : "font-semibold text-[#0e0e0e]",
                )}
              >
                {track.statusLabel}
              </p>

              <div className="h-2 w-full overflow-hidden rounded-full bg-[#e9e9e4] sm:col-start-2 sm:row-start-1">
                <div
                  className="h-full rounded-full bg-[#1ed2f4]"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="text-sm text-[#5a5f58] sm:col-start-3 sm:row-start-1 sm:text-right">
                {track.completedModules} of {track.totalModules}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

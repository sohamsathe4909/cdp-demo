import Link from "next/link";

import type { LiveExpinar } from "@cdp/types";

import { AddToCalendar } from "./add-to-calendar";

/**
 * The next live session. `expinar` is null when expinar_events holds no
 * future row — that renders the explicit empty state rather than a session
 * invented from the clock.
 */
export function LiveExpinarCard({
  expinar,
}: {
  expinar: LiveExpinar | null;
}) {
  if (!expinar) {
    return (
      <section
        id="live-expinar"
        className="flex h-full flex-col rounded-2xl bg-[#0e0e0e] p-6 text-white shadow-[0_1px_3px_rgba(14,14,14,0.08)]"
      >
        <p className="flex items-center gap-2 text-sm font-semibold text-white/60">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-white/25" />
          No upcoming session
        </p>

        <h2 className="mt-4 text-2xl font-bold leading-snug tracking-[-0.02em]">
          Nothing scheduled yet
        </h2>

        <p className="mt-3 text-sm leading-6 text-white/70">
          The next Expinar will show up here as soon as it is added to the
          calendar. Until then, catch up on a recording.
        </p>

        <div className="mt-auto pt-8">
          <Link
            href="/expinars"
            className="inline-flex h-10 items-center rounded-full border border-white/20 bg-white/10 px-5 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Browse recordings
          </Link>

          <p className="mt-5 text-xs leading-5 text-white/50">
            Live sessions, upcoming dates and the recording library all live on
            the Expinars page.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="live-expinar"
      className="flex h-full flex-col rounded-2xl bg-[#0e0e0e] p-6 text-white shadow-[0_1px_3px_rgba(14,14,14,0.08)]"
    >
      <p className="flex items-center gap-2 text-sm font-semibold">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#1ed2f4]" />
        Live on {expinar.dateLabel}, {expinar.timeLabel}
      </p>

      <h2 className="mt-4 text-2xl font-bold leading-snug tracking-[-0.02em]">
        {expinar.title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-white/70">{expinar.detail}</p>

      <div className="mt-auto pt-8">
        <AddToCalendar expinar={expinar} />

        <p className="mt-5 text-xs leading-5 text-white/50">
          {expinar.joinNote}
        </p>
      </div>
    </section>
  );
}

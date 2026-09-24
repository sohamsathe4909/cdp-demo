import type { LiveExpinar } from "@cdp/types";

import { AddToCalendar } from "./add-to-calendar";

export function LiveExpinarCard({ expinar }: { expinar: LiveExpinar }) {
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

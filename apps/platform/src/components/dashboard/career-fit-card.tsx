import type { CareerFitReport } from "@cdp/types";

export function CareerFitCard({ report }: { report: CareerFitReport }) {
  return (
    <section
      id="career-fit"
      className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_1px_3px_rgba(14,14,14,0.04)]"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-[-0.01em] text-[#0e0e0e]">
          Career-fit report
        </h2>

        <p className="text-sm text-[#5a5f58]">Day {report.opensDay}</p>
      </div>

      <p className="mt-2 text-sm leading-6 text-[#5a5f58]">{report.blurb}</p>

      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[#e9e9e4]">
        <div
          className="h-full rounded-full bg-[#0e0e0e]"
          style={{
            width: `${Math.min(100, Math.max(0, report.progressPercent))}%`,
          }}
        />
      </div>
    </section>
  );
}

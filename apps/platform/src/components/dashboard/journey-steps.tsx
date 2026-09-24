import { Fragment } from "react";
import type { JourneyStep } from "@cdp/types";

import { cn } from "@/lib/utils";

export function JourneySteps({ steps }: { steps: JourneyStep[] }) {
  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:gap-3">
      {steps.map((step, index) => (
        <Fragment key={step.key}>
          {index > 0 && (
            <span
              aria-hidden
              className="hidden h-px flex-1 bg-[#e4e4df] sm:block"
            />
          )}

          <div className="flex min-w-0 items-center gap-3">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                step.state === "active" &&
                  "border-[#0e0e0e] bg-[#f8dc03] text-[#0e0e0e]",
                step.state === "done" &&
                  "border-[#0e0e0e] bg-[#0e0e0e] text-[#f8dc03]",
                step.state === "upcoming" &&
                  "border-[#d9d9d3] bg-white text-[#8a8f88]",
              )}
            >
              {index + 1}
            </span>

            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight text-[#0e0e0e]">
                {step.label}
              </p>

              <p className="mt-0.5 text-xs leading-tight text-[#5a5f58]">
                {step.meta}
              </p>
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

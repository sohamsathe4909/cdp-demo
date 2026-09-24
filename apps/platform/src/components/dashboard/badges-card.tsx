import { Check } from "lucide-react";

import type { BadgeInfo } from "@cdp/types";

interface BadgesCardProps {
  items: BadgeInfo[];
  earned: number;
  total: number;
}

export function BadgesCard({ items, earned, total }: BadgesCardProps) {
  return (
    <section
      id="badges"
      className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_1px_3px_rgba(14,14,14,0.04)]"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-[-0.01em] text-[#0e0e0e]">
          Badges
        </h2>

        <p className="text-sm text-[#5a5f58]">
          {earned} of {total}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-3 min-[420px]:grid-cols-6">
        {items.map((badge) =>
          badge.earned ? (
            <span
              key={badge.id}
              title={badge.name}
              className="flex aspect-square items-center justify-center rounded-full bg-[#1ed2f4]"
            >
              <Check
                className="h-5 w-5 text-[#0e0e0e]"
                strokeWidth={3}
                aria-label={badge.name}
              />
            </span>
          ) : (
            <span
              key={badge.id}
              title={badge.name}
              className="aspect-square rounded-full border-2 border-dashed border-[#dededa]"
            />
          ),
        )}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type {
  CareerFitReport,
  LiveExpinar,
  ProgramDay,
  ProgramPlan,
  TrackProgress,
} from "@cdp/types";

import { cn } from "@/lib/utils";

const legend: Array<{ label: string; swatch?: string; dot?: boolean }> = [
  { label: "Done", swatch: "bg-[#b7ecfb]" },
  { label: "Today", swatch: "bg-[#f8dc03]" },
  { label: "Expinar day", dot: true },
];

const weekLabels = [
  { label: "Week 1", span: 7 },
  { label: "Week 2", span: 7 },
  { label: "Week 3", span: 7 },
  { label: "Week 4", span: 7 },
  { label: "Wrap-up", span: 2 },
];

const TOOLTIP_WIDTH = 220;
const POPOVER_WIDTH = 264;

interface DayEvent {
  kind: "expinar" | "unlock" | "report";
  label: string;
  detail?: string;
}

interface Anchor {
  day: number;
  x: number;
  y: number;
}

interface ThirtyDayStripProps {
  plan: ProgramPlan;
  tracks: TrackProgress[];
  careerFit: CareerFitReport;
  liveExpinar: LiveExpinar;
}

function weekIndexForDay(day: number): number {
  return Math.min(
    Math.floor((day - 1) / 7),
    weekLabels.length - 1,
  );
}

function eventDotClass(kind: DayEvent["kind"], onDark: boolean): string {
  if (onDark) {
    return kind === "expinar"
      ? "bg-[#f8dc03]"
      : kind === "unlock"
        ? "bg-[#1ed2f4]"
        : "bg-white/50";
  }

  return kind === "expinar"
    ? "bg-[#0e0e0e]"
    : kind === "unlock"
      ? "bg-[#1ed2f4]"
      : "bg-[#5a5f58]";
}

export function ThirtyDayStrip({
  plan,
  tracks,
  careerFit,
  liveExpinar,
}: ThirtyDayStripProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cellRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [activeWeek, setActiveWeek] = useState<number | null>(null);
  const [focusDay, setFocusDay] = useState<number>(plan.currentDay);

  const [tooltipAnchor, setTooltipAnchor] = useState<Anchor | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<Anchor | null>(null);

  /* Per-day event notes: Expinar sessions, track unlocks, career report. */
  const eventMap = useMemo(() => {
    const map = new Map<number, DayEvent[]>();

    const nextExpinarDay =
      plan.days.find((d) => d.isExpinarDay && d.day >= plan.currentDay)?.day ??
      null;

    for (const day of plan.days) {
      const events: DayEvent[] = [];

      if (day.isExpinarDay) {
        if (day.day === nextExpinarDay) {
          events.push({
            kind: "expinar",
            label: liveExpinar.title,
            detail: `${liveExpinar.dateLabel} · ${liveExpinar.timeLabel}`,
          });
        } else {
          events.push({
            kind: "expinar",
            label: "Expinar session",
            detail: day.day < plan.currentDay ? "Completed" : undefined,
          });
        }
      }

      for (const track of tracks) {
        if (track.unlockDay === day.day) {
          events.push({ kind: "unlock", label: `${track.title} unlocks` });
        }
      }

      if (careerFit.opensDay === day.day) {
        events.push({ kind: "report", label: "Career-fit report opens" });
      }

      if (events.length > 0) {
        map.set(day.day, events);
      }
    }

    return map;
  }, [plan, tracks, liveExpinar, careerFit]);

  const stateLabel = (day: ProgramDay): string => {
    if (day.state === "done") return "Done";
    if (day.state === "today") return "Today";

    const diff = day.day - plan.currentDay;
    return diff === 1 ? "Tomorrow" : `In ${diff} days`;
  };

  /* Measure a cell relative to the section so the tooltip/popover can be
     positioned absolutely (the section is `relative`; both overlays live
     outside the horizontally scrollable strip, so nothing clips them). */
  const measure = (
    day: number,
    placement: "above" | "below",
    width: number,
  ): Anchor | null => {
    const section = sectionRef.current;
    const cell = cellRefs.current[day];
    if (!section || !cell) return null;

    const s = section.getBoundingClientRect();
    const c = cell.getBoundingClientRect();

    const half = width / 2;
    const minX = half + 4;
    const maxX = Math.max(minX, s.width - half - 4);
    const x = Math.min(
      Math.max(c.left - s.left + c.width / 2, minX),
      maxX,
    );
    const y = placement === "above" ? c.top - s.top : c.bottom - s.top;

    return { day, x, y };
  };

  /* Sync anchors when hover/open changes, and keep them glued to their
     cells on page scroll, strip scroll and window resize. */
  useEffect(() => {
    if (hoveredDay == null) setTooltipAnchor(null);
    else setTooltipAnchor(measure(hoveredDay, "above", TOOLTIP_WIDTH));

    if (openDay == null) setPopoverAnchor(null);
    else setPopoverAnchor(measure(openDay, "below", POPOVER_WIDTH));

    if (hoveredDay == null && openDay == null) return;

    const sync = () => {
      if (hoveredDay != null) {
        setTooltipAnchor(measure(hoveredDay, "above", TOOLTIP_WIDTH));
      }
      if (openDay != null) {
        setPopoverAnchor(measure(openDay, "below", POPOVER_WIDTH));
      }
    };

    window.addEventListener("resize", sync);
    // Capture phase so the inner strip's horizontal scroll is caught too.
    window.addEventListener("scroll", sync, true);

    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredDay, openDay]);

  /* Click outside any day cell closes the detail popover. */
  useEffect(() => {
    if (openDay == null) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-day-cell]") || target.closest("[data-day-popover]")) {
        return;
      }
      setOpenDay(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openDay]);

  /* Escape closes the popover first, then resets week focus. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (openDay != null) setOpenDay(null);
      else if (activeWeek != null) setActiveWeek(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openDay, activeWeek]);

  const onCellKeyDown = (event: React.KeyboardEvent, day: number) => {
    let target: number | null = null;

    if (event.key === "ArrowLeft") target = Math.max(1, day - 1);
    else if (event.key === "ArrowRight") target = Math.min(plan.totalDays, day + 1);
    else if (event.key === "Home") target = 1;
    else if (event.key === "End") target = plan.totalDays;

    if (target == null) return;

    event.preventDefault();
    setFocusDay(target);
    cellRefs.current[target]?.focus();
  };

  const tooltipDay = tooltipAnchor ? plan.days[tooltipAnchor.day - 1] : null;
  const tooltipEvents =
    tooltipAnchor ? (eventMap.get(tooltipAnchor.day) ?? []) : [];

  const popoverDay = popoverAnchor ? plan.days[popoverAnchor.day - 1] : null;
  const popoverEvents =
    popoverAnchor ? (eventMap.get(popoverAnchor.day) ?? []) : [];

  return (
    <section
      id="your-30-days"
      ref={sectionRef}
      className="relative rounded-2xl border border-black/10 bg-white p-5 shadow-[0_1px_3px_rgba(14,14,14,0.04)] sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h2 className="text-lg font-semibold tracking-[-0.01em] text-[#0e0e0e]">
          Your {plan.totalDays} days
        </h2>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {legend.map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-1.5 text-xs font-medium text-[#5a5f58]"
            >
              {item.dot ? (
                <span className="h-2.5 w-2.5 rounded-full bg-[#0e0e0e]" />
              ) : (
                <span className={cn("h-3 w-3 rounded-[4px]", item.swatch)} />
              )}
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* pt-1.5 gives the week-focus lift (-translate-y-1) headroom: the
         overflow-x-auto container clips at its top edge, which is what used
         to shear the borders off highlighted cells. mt-2.5 + pt-1.5 = the
         original 16px gap under the header. */}
      <div className="mt-2.5 overflow-x-auto pt-1.5 pb-1">
        <div className="min-w-[680px]">
          <div
            role="group"
            aria-label={`Your ${plan.totalDays} day schedule`}
            className="grid grid-cols-[repeat(30,minmax(0,1fr))] gap-1.5"
          >
            {plan.days.map((day) => {
              const events = eventMap.get(day.day) ?? [];
              const weekIndex = weekIndexForDay(day.day);
              const inActiveWeek = activeWeek === weekIndex;
              const isDone = day.state === "done";
              const shouldFill = isDone || day.state === "today";

              const ariaLabel = [
                `Day ${day.day} of ${plan.totalDays}, ${stateLabel(day)}`,
                ...events.map((e) =>
                  e.detail ? `${e.label}, ${e.detail}` : e.label,
                ),
              ].join(". ");

              return (
                <button
                  key={day.day}
                  type="button"
                  data-day-cell
                  ref={(el) => {
                    cellRefs.current[day.day] = el;
                  }}
                  tabIndex={focusDay === day.day ? 0 : -1}
                  aria-label={ariaLabel}
                  aria-expanded={openDay === day.day}
                  className={cn(
                    "relative flex h-10 cursor-pointer items-center justify-center rounded-lg border text-[13px] tabular-nums transition duration-300 ease-out",
                    "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0e0e0e]",
                    day.state === "done" &&
                      "border-transparent bg-[#b7ecfb] text-[#0e0e0e]",
                    day.state === "today" &&
                      "border-2 border-[#0e0e0e] bg-[#f8dc03] font-bold text-[#0e0e0e]",
                    day.state === "upcoming" &&
                      "border-[#e6e6e1] bg-white text-[#8a8f88]",
                    // Animated fill-in: done days (then today) cascade left → right.
                    shouldFill && "day-fill",
                    // Week focus mode: spotlight the active week, dim the rest.
                    // Lift + shadow instead of scale — scaling resamples the
                    // 1px borders and makes them look broken.
                    activeWeek != null && !inActiveWeek && "opacity-25",
                    activeWeek != null &&
                      inActiveWeek &&
                      "-translate-y-1 shadow-[0_6px_16px_rgba(14,14,14,0.16)]",
                  )}
                  style={
                    shouldFill
                      ? { animationDelay: `${(day.day - 1) * 45}ms` }
                      : undefined
                  }
                  onMouseEnter={() => setHoveredDay(day.day)}
                  onMouseLeave={() =>
                    setHoveredDay((h) => (h === day.day ? null : h))
                  }
                  onFocus={() => {
                    setFocusDay(day.day);
                    setHoveredDay(day.day);
                  }}
                  onBlur={() =>
                    setHoveredDay((h) => (h === day.day ? null : h))
                  }
                  onClick={() =>
                    setOpenDay((o) => (o === day.day ? null : day.day))
                  }
                  onKeyDown={(event) => onCellKeyDown(event, day.day)}
                >
                  {day.isExpinarDay && (
                    <span className="absolute top-1 h-1.5 w-1.5 rounded-full bg-[#0e0e0e]" />
                  )}

                  <span className={cn(day.isExpinarDay && "mt-1.5")}>
                    {day.day}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-2 grid grid-cols-[repeat(30,minmax(0,1fr))] gap-1.5 text-[11px] font-medium text-[#8a8f88]">
            {weekLabels.map((week, index) => {
              const isActive = activeWeek === index;
              const startDay = index * 7 + 1;
              const endDay = Math.min(
                startDay + week.span - 1,
                plan.totalDays,
              );

              return (
                <span
                  key={week.label}
                  className={cn(
                    index === weekLabels.length - 1 && "text-right",
                    activeWeek != null && !isActive && "opacity-40",
                  )}
                  style={{ gridColumn: `span ${week.span} / span ${week.span}` }}
                >
                  <button
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`Focus ${week.label}, days ${startDay} to ${endDay}`}
                    onClick={() =>
                      setActiveWeek(isActive ? null : index)
                    }
                    className={cn(
                      "cursor-pointer rounded transition-colors focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0e0e0e]",
                      isActive
                        ? "font-semibold text-[#0e0e0e] underline decoration-[#f8dc03] decoration-2 underline-offset-4"
                        : "text-[#8a8f88] hover:text-[#0e0e0e]",
                    )}
                  >
                    {week.label}
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hover / keyboard-focus tooltip (pointer-events-none, never clips). */}
      {tooltipAnchor && tooltipDay && openDay == null && (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-full rounded-xl bg-[#0e0e0e] px-3 py-2 text-left text-white shadow-xl animate-fade-in"
          style={{
            left: tooltipAnchor.x,
            top: tooltipAnchor.y - 8,
            width: TOOLTIP_WIDTH,
          }}
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-semibold">
              Day {tooltipAnchor.day} of {plan.totalDays}
            </span>
            <span className="text-[11px] text-white/60">
              {stateLabel(tooltipDay)}
            </span>
          </div>

          {tooltipEvents.length > 0 && (
            <ul className="mt-1.5 space-y-1 border-t border-white/10 pt-1.5">
              {tooltipEvents.map((event) => (
                <li
                  key={`${event.kind}-${event.label}`}
                  className="flex gap-2 text-[11px] leading-4"
                >
                  <span
                    className={cn(
                      "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                      eventDotClass(event.kind, true),
                    )}
                  />
                  <span>
                    {event.label}
                    {event.detail && (
                      <span className="block text-white/50">
                        {event.detail}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Click / tap day detail popover. */}
      {popoverAnchor && popoverDay && (
        <div
          data-day-popover
          className="absolute z-50 -translate-x-1/2 rounded-2xl border border-black/10 bg-white p-3 text-left shadow-xl animate-fade-in"
          style={{
            left: popoverAnchor.x,
            top: popoverAnchor.y + 8,
            width: POPOVER_WIDTH,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[#0e0e0e]">
              Day {popoverAnchor.day} of {plan.totalDays}
            </p>

            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                popoverDay.state === "done" &&
                  "bg-[#b7ecfb] text-[#0e0e0e]",
                popoverDay.state === "today" &&
                  "bg-[#f8dc03] text-[#0e0e0e]",
                popoverDay.state === "upcoming" &&
                  "bg-[#f1f1ec] text-[#5a5f58]",
              )}
            >
              {popoverDay.state === "upcoming"
                ? "Upcoming"
                : stateLabel(popoverDay)}
            </span>
          </div>

          <p className="mt-0.5 text-[11px] text-[#5a5f58]">
            {weekLabels[weekIndexForDay(popoverAnchor.day)].label}
            {" · "}
            {stateLabel(popoverDay)}
          </p>

          {popoverEvents.length > 0 ? (
            <ul className="mt-2.5 space-y-2 border-t border-black/10 pt-2.5">
              {popoverEvents.map((event) => (
                <li
                  key={`${event.kind}-${event.label}`}
                  className="flex gap-2"
                >
                  <span
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      eventDotClass(event.kind, false),
                    )}
                  />
                  <span>
                    <span className="block text-xs font-medium text-[#0e0e0e]">
                      {event.label}
                    </span>
                    {event.detail && (
                      <span className="block text-[11px] text-[#5a5f58]">
                        {event.detail}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2.5 border-t border-black/10 pt-2.5 text-[11px] text-[#5a5f58]">
              {popoverDay.state === "done"
                ? "Completed. Nothing else scheduled."
                : popoverDay.state === "today"
                  ? "Today's focus: your current module."
                  : "Nothing scheduled on this day."}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

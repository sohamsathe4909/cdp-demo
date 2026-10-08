"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Play, Plus } from "lucide-react";
import { skylineLabels } from "./landing-content";

const GOLD = "#f8dc03";
const AQUA = "#1ed2f4";
const INK = "#0e0e0e";

/* =========================================================
    Skyline — the five careers sitting on the glowing arc
========================================================= */

/* Five equal towers — the horizon, not the heights, gives them variety */
const BUILDING_W = 100;
const BUILDING_H = 112;
const COLS = 4;
const ROWS = 5;

/** Slots along the horizon; the middle one is the centre stage. */
const SLOT_X = [105, 288, 600, 872, 1072];
const CENTER_SLOT = 2;
const SLOT_COUNT = SLOT_X.length;
/** One handoff every… towers glide in a single direction, never reversing. */
const STEP_MS = 2800;
const SLIDE = 0.9;
const SLIDE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Y of the horizon arc at a given x (quadratic Bezier, viewBox 1200×340) */
function arcY(x: number) {
  const t = x / 1200;
  return 336 - 372 * t + 372 * t * t;
}

export function Skyline() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { margin: "-12% 0px -12% 0px" });
  /* The whole line marches one slot to the right on every tick, so each
     tower reaches the centre stage — and the highlight — in turn. */
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced || !inView) return;
    const timer = setInterval(() => {
      setStep((current) => current + 1);
    }, STEP_MS);
    return () => clearInterval(timer);
  }, [reduced, inView]);

  const centreX = SLOT_X[CENTER_SLOT];
  const centreY = arcY(centreX);

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg
        viewBox="0 0 1200 340"
        fill="none"
        className="block w-full"
        role="img"
        aria-label="The five CDP careers rising over a glowing horizon"
      >
        <defs>
          <filter id="cdp-arc-glow" x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="cdp-arc-fade" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor={GOLD} stopOpacity="0.15" />
            <stop offset="0.5" stopColor={GOLD} stopOpacity="1" />
            <stop offset="1" stopColor={GOLD} stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Horizon arc */}
        <motion.path
          d="M 0 336 Q 600 150 1200 336"
          stroke="url(#cdp-arc-fade)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#cdp-arc-glow)"
          initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
          whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Soft reflection of the arc */}
        <path
          d="M 0 336 Q 600 150 1200 336"
          stroke={GOLD}
          strokeOpacity="0.18"
          strokeWidth="14"
          strokeLinecap="round"
          filter="url(#cdp-arc-glow)"
        />

        {/* Buildings */}
        {skylineLabels.map((entry, index) => {
          const slot = (((index + step) % SLOT_COUNT) + SLOT_COUNT) % SLOT_COUNT;
          const x = SLOT_X[slot];
          const baseY = arcY(x) - 3;
          const isActive = slot === CENTER_SLOT;
          /* A tower stepping off the right end loops back in from the left —
             the crossing itself happens off-stage, fully faded out. */
          const isWrapping = slot === 0 && step > 0;
          const fromX = SLOT_X[SLOT_COUNT - 1];
          const fromY = arcY(fromX) - 3;

          const cellW = (BUILDING_W - 14) / COLS;
          const cellH = (BUILDING_H - 22) / ROWS;
          const winW = Math.max(4, Math.min(9, cellW - 5));
          const winH = Math.max(5, Math.min(11, cellH - 5));
          const windows = [];

          for (let row = 0; row < ROWS; row += 1) {
            for (let col = 0; col < COLS; col += 1) {
              windows.push(
                <rect
                  key={`${row}-${col}`}
                  x={-BUILDING_W / 2 + 7 + col * cellW + (cellW - winW) / 2}
                  y={-BUILDING_H + 13 + row * cellH + (cellH - winH) / 2}
                  width={winW}
                  height={winH}
                  rx="1.5"
                  fill={isActive ? GOLD : "#2c2c2c"}
                  className={`cdp-window${isActive ? " cdp-window--blink" : ""}`}
                  style={isActive ? { animationDelay: `${(row * COLS + col) * 0.12}s` } : undefined}
                />,
              );
            }
          }

          return (
            <motion.g
              key={entry.label}
              initial={reduced ? undefined : { opacity: 0, y: 26 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.8, delay: 0.25 + index * 0.12, ease: SLIDE_EASE }}
            >
              {/* Conveyor — slides along the horizon to the next slot */}
              <motion.g
                initial={false}
                animate={
                  isWrapping
                    ? {
                        x: [fromX, fromX, x, x],
                        y: [fromY, fromY, baseY, baseY],
                        opacity: [1, 0, 0, 1],
                      }
                    : { x, y: baseY, opacity: 1 }
                }
                transition={
                  isWrapping
                    ? {
                        x: { duration: SLIDE, times: [0, 0.15, 0.85, 1], ease: "linear" },
                        y: { duration: SLIDE, times: [0, 0.15, 0.85, 1], ease: "linear" },
                        opacity: { duration: SLIDE, times: [0, 0.1, 0.88, 1], ease: "linear" },
                      }
                    : {
                        x: { duration: SLIDE, ease: SLIDE_EASE },
                        y: { duration: SLIDE, ease: SLIDE_EASE },
                      }
                }
              >
                <g
                  className="cdp-skyline-lift"
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "50% 100%",
                    transform: isActive
                      ? "translateY(-20px) scale(1.07)"
                      : "translateY(0px) scale(1)",
                  }}
                >
                  <rect
                    x={-BUILDING_W / 2}
                    y={-BUILDING_H}
                    width={BUILDING_W}
                    height={BUILDING_H}
                    rx="3"
                    fill="#131313"
                    stroke={isActive ? GOLD : "#242424"}
                    strokeWidth="1.5"
                  />
                  {windows}
                  <rect
                    className={`cdp-skyline-ring${isActive ? " is-on" : ""}`}
                    x={-BUILDING_W / 2 - 1}
                    y={-BUILDING_H - 1}
                    width={BUILDING_W + 2}
                    height={BUILDING_H + 2}
                    rx="4"
                    stroke={GOLD}
                    strokeOpacity="0.35"
                    strokeWidth="6"
                  />
                  <text
                    x={0}
                    y={-BUILDING_H - 13}
                    textAnchor="middle"
                    className={`cdp-skyline-label${isActive ? " cdp-skyline-label--active" : ""}`}
                  >
                    {entry.label}
                  </text>
                </g>
              </motion.g>
            </motion.g>
          );
        })}

        {/* Centre stage — the glow on the horizon beneath whichever tower holds it */}
        <g style={{ transform: `translate(${centreX}px, ${centreY}px)` }} aria-hidden="true">
          <g
            key={step}
            className={`cdp-skyline-marker${reduced ? " cdp-skyline-marker--static" : ""}`}
          >
            <circle r="17" fill={GOLD} opacity="0.2" filter="url(#cdp-arc-glow)" />
            <circle r="6.5" fill={GOLD} />
            <circle r="11" fill="none" stroke={GOLD} strokeOpacity="0.55" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/* =========================================================
    "How CDP does things differently" — media mocks
========================================================= */

function MockShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-black/10 bg-[#fbfbfa] p-3 shadow-[0_1px_0_rgba(0,0,0,0.04)] sm:p-4">
      {children}
    </div>
  );
}

export function VideoModuleMock() {
  return (
    <MockShell>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-[radial-gradient(120%_120%_at_20%_0%,#17414f_0%,#0d2731_45%,#07161c_100%)]">
        <span className="absolute left-3 top-3 rounded-md bg-white/12 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm">
          Equity Research
        </span>
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f8dc03] text-[#0e0e0e] shadow-[0_6px_18px_rgba(248,220,3,0.35)] transition-transform duration-300 hover:scale-110">
          <Play className="h-4 w-4 fill-current" />
        </span>
        <span className="absolute bottom-3 right-3 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-medium text-white/75">
          7:28 / 12:00
        </span>
      </div>
      <p className="mt-3 text-[13px] font-bold leading-5 text-[#0e0e0e]">
        Module 3: A day in the life of an analyst
      </p>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/10">
        <div className="h-full w-[38%] rounded-full bg-[#0e0e0e]" />
      </div>
      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-[#5a5f58]">12 min</span>
        <span className="rounded-full bg-[#f8dc03] px-2 py-0.5 text-[10px] font-bold text-[#0e0e0e]">
          Quiz after this
        </span>
      </div>
    </MockShell>
  );
}

export function LiveSessionMock() {
  return (
    <MockShell>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0e0e0e]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#1ed2f4]" />
          Live Session
        </span>
        <span className="text-[10px] font-medium text-[#5a5f58]">Saturday, 7:00 pm</span>
      </div>
      <p className="mt-3 text-[15px] font-extrabold leading-tight tracking-[-0.02em] text-[#0e0e0e]">
        Ask an investment banker
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#5a5f58]">
        Investment Banking track
      </p>
      <div className="mt-3 space-y-2">
        <p className="max-w-[85%] rounded-lg rounded-tl-sm bg-black/[0.06] px-3 py-2 text-[11px] leading-4 text-[#3f443e]">
          What does a first-year analyst do all day?
        </p>
        <p className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm bg-[#0e0e0e] px-3 py-2 text-[11px] leading-4 text-white">
          Good question. Let me walk you through my Monday.
        </p>
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-black/10 pt-2.5">
        <span className="flex -space-x-1.5">
          <span className="h-4 w-4 rounded-full border-2 border-white bg-[#f8dc03]" />
          <span className="h-4 w-4 rounded-full border-2 border-white bg-[#1ed2f4]" />
          <span className="h-4 w-4 rounded-full border-2 border-white bg-[#0e0e0e]" />
        </span>
        <span className="text-[10px] text-[#5a5f58]">Your cohort is in the room</span>
      </div>
    </MockShell>
  );
}

export function SimulationMock() {
  const chips = ["Buy", "Hold", "Sell"];
  return (
    <MockShell>
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#0e0e0e]">
          Simulation: make the call
        </p>
        <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-[9px] font-bold text-[#5a5f58]">
          Round 2 of 4
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1 text-[9px] font-semibold text-[#5a5f58]">
        <span>Results day</span>
        <span className="text-center">Rate change</span>
        <span className="text-right">New model</span>
      </div>
      <svg viewBox="0 0 300 96" className="mt-1 block w-full" fill="none" aria-hidden="true">
        <path d="M4 84 H296" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
        <path d="M4 52 H296" stroke="rgba(0,0,0,0.06)" strokeWidth="1" strokeDasharray="3 5" />
        <motion.path
          d="M6 74 L58 66 L104 70 L150 48 L196 52 L244 26 L292 14"
          stroke="#0e0e0e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        <circle cx="150" cy="48" r="5" fill={GOLD} stroke="#0e0e0e" strokeWidth="2" />
        <circle cx="244" cy="26" r="5" fill={AQUA} stroke="#0e0e0e" strokeWidth="2" />
        <circle cx="292" cy="14" r="5" fill="#0e0e0e" />
      </svg>
      <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-2.5">
        <span className="text-[10px] font-semibold text-[#5a5f58]">Your call</span>
        <span className="flex items-center gap-1.5">
          {chips.map((chip, index) => (
            <span
              key={chip}
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                index === 0
                  ? "bg-[#f8dc03] text-[#0e0e0e]"
                  : "bg-black/[0.06] text-[#5a5f58]"
              }`}
            >
              {chip}
            </span>
          ))}
        </span>
      </div>
      <p className="mt-2 text-right text-[9px] text-[#9aa096]">For illustration only</p>
    </MockShell>
  );
}

export function ReportMock() {
  const rows = [
    { label: "Equity Research", value: 84, tone: GOLD },
    { label: "Private Wealth", value: 71, tone: AQUA },
    { label: "Investment Banking", value: 63, tone: "#0e0e0e" },
    { label: "PE and VC", value: 55, tone: "#c9cec4" },
    { label: "Future of Finance", value: 48, tone: "#c9cec4" },
  ];
  return (
    <MockShell>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#0e0e0e]">
          Your career-fit report
        </p>
        <span className="text-[9px] font-semibold text-[#5a5f58]">Day 30</span>
      </div>
      <div className="mt-3 space-y-2.5">
        {rows.map((row, index) => (
          <div key={row.label} className="grid grid-cols-[110px_1fr_24px] items-center gap-2">
            <span className="truncate text-[10px] font-semibold text-[#3f443e]">
              {row.label}
            </span>
            <span className="h-2 w-full overflow-hidden rounded-full bg-black/[0.07]">
              <motion.span
                className="block h-full rounded-full"
                style={{ background: row.tone }}
                initial={{ width: 0 }}
                whileInView={{ width: `${row.value}%` }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.9, delay: 0.1 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
            <span className="text-right text-[10px] font-bold text-[#0e0e0e]">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-black/10 pt-2.5">
        <span className="rounded-full bg-[#f8dc03] px-2 py-0.5 text-[10px] font-bold text-[#0e0e0e]">
          Best fit
        </span>
        <span className="text-[11px] font-bold text-[#0e0e0e]">Equity Research</span>
      </div>
      <p className="mt-2 text-right text-[9px] text-[#9aa096]">For illustration only</p>
    </MockShell>
  );
}

/* =========================================================
    "How CDP can help you" — panel mocks
========================================================= */

export function PortfolioMock() {
  const rows = [
    { dot: GOLD, title: "Your portfolio", meta: "Round 3 of 5", value: "+9.2%" },
    { dot: AQUA, title: "The market", meta: "Same period", value: "+7.4%" },
  ];
  return (
    <div className="w-full rounded-2xl border border-black/10 bg-white p-4 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)] sm:p-5">
      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.title}
            className="flex items-center justify-between rounded-xl border border-black/[0.07] bg-[#fbfbfa] px-3 py-3"
          >
            <span className="flex items-center gap-2.5">
              <span className="h-3.5 w-3.5 rounded-full" style={{ background: row.dot }} />
              <span className="leading-tight">
                <span className="block text-[13px] font-bold text-[#0e0e0e]">{row.title}</span>
                <span className="block text-[10px] text-[#5a5f58]">{row.meta}</span>
              </span>
            </span>
            <span className="text-[15px] font-extrabold tracking-[-0.02em] text-[#0e0e0e]">
              {row.value}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0e0e0e] text-[10px] text-[#f8dc03]">
          ↗
        </span>
        <span className="text-[9px] text-[#9aa096]">For illustration only</span>
      </div>
    </div>
  );
}

export function HandbookMock() {
  return (
    <div className="relative w-full">
      <div className="mx-auto w-[78%] rotate-[-4deg] rounded-xl border-2 border-[#0e0e0e] bg-[#f8dc03] p-4 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.5)] sm:p-5">
        <p className="text-[17px] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#0e0e0e] sm:text-[21px]">
          Career
          <br />
          Discovery
          <br />
          Handbook
        </p>
        <span className="mt-4 block h-[3px] w-10 rounded bg-[#0e0e0e]" />
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0e0e0e]/70">
          CDP by FinTree
        </p>
      </div>
      <div className="absolute -right-1 top-6 w-[56%] rotate-[5deg] rounded-lg border border-black/10 bg-white p-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)] sm:-right-3 sm:p-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#5a5f58]">
          Certificate
        </p>
        <p className="mt-1.5 text-[13px] font-extrabold leading-tight tracking-[-0.02em] text-[#0e0e0e]">
          Career Discovery
          <br />
          Program
        </p>
        <span className="mt-3 block h-[2px] w-full rounded bg-black/10" />
        <span className="mt-1.5 block h-[2px] w-2/3 rounded bg-black/10" />
        <span className="absolute -bottom-3 right-3 h-7 w-7 rounded-full border-2 border-white bg-[#1ed2f4]" />
      </div>
      <div className="mt-6 flex items-center justify-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0e0e0e] bg-[#f8dc03] text-[10px] font-extrabold text-[#0e0e0e]">
          EQ
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0e0e0e] bg-[#1ed2f4] text-[10px] font-extrabold text-[#0e0e0e]">
          IB
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0e0e0e] bg-white text-[10px] font-extrabold text-[#0e0e0e]">
          PW
        </span>
      </div>
      <p className="mt-2 text-right text-[9px] text-[#9aa096]">For illustration only</p>
    </div>
  );
}

/* =========================================================
    Article doodles
========================================================= */

export function ArticleDoodle({ kind }: { kind: "bars" | "arc" | "checks" }) {
  if (kind === "bars") {
    return (
      <svg viewBox="0 0 120 70" className="h-16 w-28" fill="none" aria-hidden="true">
        <path d="M4 62 L34 44 L60 52 L88 24 L116 8" stroke={INK} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M116 8 l-14 2 M116 8 l1 14" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <rect x="10" y="54" width="10" height="12" fill={INK} />
        <rect x="40" y="46" width="10" height="20" fill={INK} />
        <rect x="70" y="40" width="10" height="26" fill={INK} />
      </svg>
    );
  }
  if (kind === "arc") {
    return (
      <svg viewBox="0 0 120 70" className="h-16 w-28" fill="none" aria-hidden="true">
        <path d="M6 68 A54 54 0 0 1 114 68 Z" fill={INK} />
        <circle cx="60" cy="42" r="10" fill={AQUA} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 70" className="h-16 w-28" fill="none" aria-hidden="true">
      <rect x="4" y="18" width="30" height="30" rx="6" fill={INK} />
      <path d="M12 33 l6 7 l12 -16" stroke="#f8dc03" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="44" y="18" width="30" height="30" rx="6" fill={GOLD} />
      <rect x="84" y="18" width="30" height="30" rx="6" stroke={INK} strokeWidth="4" />
    </svg>
  );
}

/* =========================================================
    Contact — dotted map of India with location badges
========================================================= */

export function IndiaDots() {
  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <svg viewBox="0 0 300 360" className="block w-full" fill="none" aria-hidden="true">
        <defs>
          <pattern id="cdp-dots" width="9" height="9" patternUnits="userSpaceOnUse">
            <circle cx="4.5" cy="4.5" r="1.7" fill="rgba(255,255,255,0.26)" />
          </pattern>
        </defs>
        <path
          d="M118 18 C130 26 140 40 152 46 C168 54 186 52 200 60 L214 52 L232 60 L246 78 L236 96 L246 110 L232 122 L210 118 L196 128 L190 148 L176 150 L168 168 L176 190 L170 220 L158 260 L150 300 L140 336 L128 300 L118 260 L100 210 L84 170 L70 140 L58 110 L62 84 L82 62 L100 44 Z"
          fill="url(#cdp-dots)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />
        <circle cx="128" cy="196" r="5" fill={GOLD} />
        <circle cx="128" cy="196" r="11" stroke={GOLD} strokeOpacity="0.4" strokeWidth="2" />
      </svg>

      <span className="animate-float-y absolute right-0 top-[34%] flex items-center gap-1.5 rounded-full border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-[11px] font-semibold text-white/85 shadow-lg">
        <span className="h-1.5 w-1.5 rounded-full bg-[#f8dc03]" />
        FinTree centre, Pune
      </span>
      <span
        className="animate-float-y absolute bottom-[14%] left-0 flex items-center gap-1.5 rounded-full border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-[11px] font-semibold text-white/85 shadow-lg"
        style={{ animationDelay: "1.6s" }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#1ed2f4]" />
        Live online, anywhere in India
      </span>
    </div>
  );
}

/* =========================================================
    Learner video card thumbnail
========================================================= */

const thumbTones: Record<string, string> = {
  sage: "from-[#9aa88f] via-[#7f8f77] to-[#5f6d5b]",
  sky: "from-[#8ecdf0] via-[#63b6e2] to-[#3f9bcd]",
  gold: "from-[#f8dc03] via-[#e9cf06] to-[#c9b205]",
  mint: "from-[#cfd8c6] via-[#b3c1a7] to-[#8e9d85]",
};

export function LearnerThumb({
  tone,
  start,
  end,
}: {
  tone: string;
  start: string;
  end: string;
}) {
  return (
    <div className={`relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br ${thumbTones[tone] ?? thumbTones.sage}`}>
      {/* Silhouette */}
      <span className="absolute bottom-0 left-1/2 h-[72%] w-[58%] -translate-x-1/2 rounded-t-[45%] bg-black/25" />
      <span className="absolute bottom-[46%] left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-black/30" />
      <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-transform duration-300 hover:scale-110">
        <Play className="h-3.5 w-3.5 fill-current" />
      </span>
      <div className="absolute bottom-3 left-3 right-3">
        <div className="h-[3px] w-full rounded-full bg-white/40">
          <div className="h-full w-[38%] rounded-full bg-white" />
        </div>
        <div className="mt-1.5 flex justify-between text-[9px] font-semibold text-white/85">
          <span>{start}</span>
          <span>{end}</span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
    Small shared bits
========================================================= */

export function PlusToggle({ open }: { open: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-transform duration-300 ${
        open ? "rotate-45 bg-[#f8dc03] text-[#0e0e0e]" : "group-hover:border-white/40"
      }`}
    >
      <Plus className="h-4 w-4" />
    </span>
  );
}

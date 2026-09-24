"use client";

import type { CSSProperties } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ActivityBarPoint, ActivityLinePoint } from "@cdp/types";

interface ActivityChartsProps {
  bar: ActivityBarPoint[];
  line: ActivityLinePoint[];
  currentDay: number;
  totalDays: number;
}

const TOOLTIP_STYLE: CSSProperties = {
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: 12,
  fontSize: 12,
  boxShadow: "0 8px 24px rgba(14,14,14,0.12)",
  fontFamily: "inherit",
};

const LABEL_STYLE: CSSProperties = {
  color: "#5a5f58",
  fontSize: 11,
  marginBottom: 4,
};

const ITEM_STYLE: CSSProperties = {
  color: "#0e0e0e",
  fontWeight: 600,
};

const AXIS_TICK = { fontSize: 10, fill: "#8a8f88" } as const;
const AXIS_LINE = { stroke: "rgba(14,14,14,0.1)" } as const;

/**
 * Dashboard activity charts: bar = minutes learned over the last 7 days,
 * line = cumulative program progress across the 30-day program.
 */
export function ActivityCharts({
  bar,
  line,
  currentDay,
  totalDays,
}: ActivityChartsProps) {
  const barMax = Math.max(...bar.map((point) => point.minutes), 10);
  const lineMax = Math.max(...line.map((point) => point.percent), 10);

  return (
    <section
      id="activity-charts"
      className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_1px_3px_rgba(14,14,14,0.04)] sm:p-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bar: minutes per day, last 7 days */}
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-[-0.01em] text-[#0e0e0e]">
              Minutes learned
            </h2>
            <p className="text-sm text-[#5a5f58]">Last 7 days</p>
          </div>

          <div className="mt-4 h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bar}
                margin={{ top: 4, right: 4, bottom: 0, left: -18 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(14,14,14,0.06)"
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={AXIS_LINE}
                  tick={AXIS_TICK}
                  interval={0}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={AXIS_TICK}
                  width={40}
                  allowDecimals={false}
                  domain={[0, barMax]}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={LABEL_STYLE}
                  itemStyle={ITEM_STYLE}
                  cursor={{ fill: "rgba(14,14,14,0.05)" }}
                />
                <Bar
                  dataKey="minutes"
                  name="Minutes"
                  fill="#f8dc03"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={26}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line: cumulative program progress */}
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-[-0.01em] text-[#0e0e0e]">
              Program progress
            </h2>
            <p className="text-sm text-[#5a5f58]">
              Day {currentDay} of {totalDays}
            </p>
          </div>

          <div className="mt-4 h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={line}
                margin={{ top: 4, right: 8, bottom: 0, left: -18 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(14,14,14,0.06)"
                />
                <XAxis
                  dataKey="day"
                  type="number"
                  domain={[1, totalDays]}
                  tickLine={false}
                  axisLine={AXIS_LINE}
                  tick={AXIS_TICK}
                  allowDecimals={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={AXIS_TICK}
                  width={44}
                  domain={[0, lineMax]}
                  tickFormatter={(value: number) => `${value}%`}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={LABEL_STYLE}
                  itemStyle={ITEM_STYLE}
                  formatter={(value: any) => [`${value}%`, "Progress"]}
                  labelFormatter={(label: any) => `Day ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="percent"
                  name="Progress"
                  stroke="#1ed2f4"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: "#1ed2f4", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

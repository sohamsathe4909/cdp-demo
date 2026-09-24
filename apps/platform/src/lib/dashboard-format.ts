/** Shared date label formatters for the dashboard and Expinar endpoints. */

const dateFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const timeFmt = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const weekdayFmt = new Intl.DateTimeFormat("en-US", { weekday: "long" });

/** "Thu 24 Sep" — weekday, day, then month (CDP design order). */
export function formatExpinarDate(date: Date): string {
  const values: Record<string, string> = {};

  for (const part of dateFmt.formatToParts(date)) {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  }

  return [values.weekday, values.day, values.month]
    .filter(Boolean)
    .join(" ");
}

/** "7:00 pm" */
export function formatExpinarTime(date: Date): string {
  return timeFmt.format(date).toLowerCase().replace(/\s/g, " ");
}

/** "Thursday" */
export function formatWeekday(date: Date): string {
  return weekdayFmt.format(date);
}

const shortWeekdayFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
});

/** "Wed" — compact weekday for chart axes. */
export function formatShortWeekday(date: Date): string {
  return shortWeekdayFmt.format(date);
}

/** "22:10" (mm:ss) */
export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

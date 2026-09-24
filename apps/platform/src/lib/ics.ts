import type { LiveExpinar } from "@cdp/types";

/** Minimal iCalendar (.ics) generator for "Add to calendar". */

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function toIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildExpinarIcs(
  event: LiveExpinar,
  durationMinutes = 60,
): string {
  const start = new Date(event.startsAt);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const now = new Date();

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rarewise//Expinar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(event.id)}@cdp.fintree.dev`,
    `DTSTAMP:${toIcsDate(now)}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(`Expinar — ${event.title}`)}`,
    `DESCRIPTION:${escapeIcsText(
      `${event.detail}\n\n${event.joinNote}`,
    )}`,
    "LOCATION:CDP Learning space (live)",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${lines.join("\r\n")}\r\n`;
}

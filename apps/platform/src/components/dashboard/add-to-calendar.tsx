"use client";

import { useState } from "react";
import {
  CalendarClock,
  CalendarDays,
  Check,
  Copy,
  Download,
} from "lucide-react";

import type { LiveExpinar } from "@cdp/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EVENT_DURATION_MS = 60 * 60 * 1000;
const EVENT_LOCATION = "CDP Learning space (live)";

/** "20260924T133000Z" — format Google Calendar expects (UTC). */
function toCompactDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function eventDetails(event: LiveExpinar): string {
  return `${event.detail}\n\n${event.joinNote}`;
}

function googleCalendarUrl(
  event: LiveExpinar,
  start: Date,
  end: Date,
): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Expinar — ${event.title}`,
    dates: `${toCompactDate(start)}/${toCompactDate(end)}`,
    details: eventDetails(event),
    location: EVENT_LOCATION,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function outlookUrl(event: LiveExpinar, start: Date, end: Date): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: `Expinar — ${event.title}`,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: eventDetails(event),
    location: EVENT_LOCATION,
  });

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function AddToCalendar({ expinar }: { expinar: LiveExpinar }) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const start = new Date(expinar.startsAt);
  const end = new Date(start.getTime() + EVENT_DURATION_MS);

  async function handleCopy() {
    const text = [
      `Expinar — ${expinar.title}`,
      `${expinar.dateLabel}, ${expinar.timeLabel}`,
      EVENT_LOCATION,
      "",
      expinar.detail,
      "",
      expinar.joinNote,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — no feedback.
    }
  }

  function handleDownload() {
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 2500);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-semibold text-[#0e0e0e] transition hover:bg-[#f8dc03]"
        >
          Add to calendar
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        sideOffset={8}
        className="w-60 border-black/10 bg-white p-1.5 text-[#0e0e0e] shadow-2xl"
      >
        <div className="px-3 pb-2 pt-1.5">
          <p className="truncate text-xs font-semibold">{expinar.title}</p>

          <p className="mt-0.5 text-xs text-[#5a5f58]">
            {expinar.dateLabel}, {expinar.timeLabel}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a
            href={googleCalendarUrl(expinar, start, end)}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2.5 hover:bg-[#f8dc03] focus:bg-[#f8dc03]"
          >
            <CalendarDays className="h-4 w-4 shrink-0 text-[#5a5f58]" />
            Google Calendar
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href={outlookUrl(expinar, start, end)}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2.5 hover:bg-[#f8dc03] focus:bg-[#f8dc03]"
          >
            <CalendarClock className="h-4 w-4 shrink-0 text-[#5a5f58]" />
            Outlook
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href="/api/expinar/calendar"
            download
            onClick={handleDownload}
            className="gap-2.5 hover:bg-[#f8dc03] focus:bg-[#f8dc03]"
          >
            {downloaded ? (
              <Check className="h-4 w-4 shrink-0 text-[#1ed2f4]" />
            ) : (
              <Download className="h-4 w-4 shrink-0 text-[#5a5f58]" />
            )}
            {downloaded ? "Downloaded" : "Apple / Outlook (.ics)"}
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopy} className="gap-2.5 hover:bg-[#f8dc03] focus:bg-[#f8dc03]">
          {copied ? (
            <Check className="h-4 w-4 shrink-0 text-[#1ed2f4]" />
          ) : (
            <Copy className="h-4 w-4 shrink-0 text-[#5a5f58]" />
          )}
          {copied ? "Copied" : "Copy event details"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

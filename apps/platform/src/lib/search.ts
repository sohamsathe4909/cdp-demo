import type { SearchResult } from "@cdp/types";

import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/client";
import { formatExpinarDate } from "./dashboard-format";

/**
 * Lesson/track/career search backing the header "Search lessons" box.
 * Merges live Supabase results with the static demo catalog, falling back
 * to demo-only results whenever the database is unavailable.
 */

const STATIC_CAREERS: SearchResult[] = [
  {
    id: "career-ib",
    title: "Investment Banking",
    subtitle: "Career · Deal-making",
    type: "career",
    href: "/careers",
  },
  {
    id: "career-er",
    title: "Equity Research",
    subtitle: "Career · Research",
    type: "career",
    href: "/careers",
  },
  {
    id: "career-pw",
    title: "Private Wealth",
    subtitle: "Career · Advisory",
    type: "career",
    href: "/careers",
  },
  {
    id: "career-pe",
    title: "VC / Private Equity",
    subtitle: "Career · Investing",
    type: "career",
    href: "/careers",
  },
  {
    id: "career-fof",
    title: "Future of Finance",
    subtitle: "Career · Emerging",
    type: "career",
    href: "/careers",
  },
];

const DEMO_ITEMS: SearchResult[] = [
  {
    id: "lesson-er-3",
    title: "How analysts build an earnings model",
    subtitle: "Lesson · Equity Research, module 3",
    type: "lesson",
    href: "/dashboard",
  },
  {
    id: "lesson-er-1",
    title: "Reading a balance sheet end to end",
    subtitle: "Lesson · Equity Research, module 1",
    type: "lesson",
    href: "/dashboard",
  },
  {
    id: "lesson-er-4",
    title: "Comparable company analysis in practice",
    subtitle: "Lesson · Equity Research, module 4",
    type: "lesson",
    href: "/dashboard",
  },
  {
    id: "lesson-er-5",
    title: "Building a DCF from scratch",
    subtitle: "Lesson · Equity Research, module 5",
    type: "lesson",
    href: "/dashboard",
  },
  {
    id: "lesson-ib-2",
    title: "M&A accretion and dilution",
    subtitle: "Lesson · Investment Banking, module 2",
    type: "lesson",
    href: "/dashboard",
  },
  {
    id: "lesson-ib-3",
    title: "Valuation multiples that actually matter",
    subtitle: "Lesson · Investment Banking, module 3",
    type: "lesson",
    href: "/dashboard",
  },
  {
    id: "track-equity",
    title: "Equity Research",
    subtitle: "Track · 8 modules",
    type: "track",
    href: "/dashboard#your-tracks",
  },
  {
    id: "track-ib",
    title: "Investment Banking",
    subtitle: "Track · 7 modules",
    type: "track",
    href: "/dashboard#your-tracks",
  },
  {
    id: "track-pe",
    title: "Private Equity and VC",
    subtitle: "Track · 6 modules",
    type: "track",
    href: "/dashboard#your-tracks",
  },
  {
    id: "track-pw",
    title: "Private Wealth",
    subtitle: "Track · 6 modules",
    type: "track",
    href: "/dashboard#your-tracks",
  },
  {
    id: "track-fof",
    title: "Future of Finance",
    subtitle: "Track · 6 modules",
    type: "track",
    href: "/dashboard#your-tracks",
  },
  {
    id: "exp-demo-1",
    title: "A day on an equity research desk",
    subtitle: "Expinar · Live this week",
    type: "expinar",
    href: "/dashboard#live-expinar",
  },
];

function matches(item: SearchResult, query: string): boolean {
  const needle = query.toLowerCase();
  return (
    item.title.toLowerCase().includes(needle) ||
    item.subtitle.toLowerCase().includes(needle)
  );
}

async function loadDbItems(): Promise<SearchResult[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();

    const [tracksRes, modulesRes, eventsRes] = await Promise.all([
      supabase.from("tracks").select("id, title, total_modules"),
      supabase
        .from("modules")
        .select("track_id, module_index, title, tracks(title)")
        .limit(100),
      supabase.from("expinar_events").select("id, title, starts_at").limit(10),
    ]);

    if (tracksRes.error || modulesRes.error || eventsRes.error) {
      return null;
    }

    const items: SearchResult[] = [];

    for (const track of tracksRes.data ?? []) {
      items.push({
        id: `track-${track.id}`,
        title: track.title,
        subtitle: `Track · ${track.total_modules} modules`,
        type: "track",
        href: "/dashboard#your-tracks",
      });
    }

    for (const module of modulesRes.data ?? []) {
      const trackTitle = module.tracks?.title ?? "Lesson";

      items.push({
        id: `lesson-${module.track_id}-${module.module_index}`,
        title: module.title,
        subtitle: `Lesson · ${trackTitle}, module ${module.module_index}`,
        type: "lesson",
        href: "/dashboard",
      });
    }

    for (const event of eventsRes.data ?? []) {
      const startsAt = new Date(event.starts_at);

      items.push({
        id: `expinar-${event.id}`,
        title: event.title,
        subtitle: `Expinar · ${formatExpinarDate(startsAt)}`,
        type: "expinar",
        href: "/dashboard#live-expinar",
      });
    }

    return items;
  } catch (error) {
    console.warn("[search] falling back to demo catalog:", error);
    return null;
  }
}

export async function searchCatalog(
  rawQuery: string,
  limit = 8,
): Promise<SearchResult[]> {
  const query = rawQuery.trim();

  if (query.length < 2) {
    return [];
  }

  const dbItems = await loadDbItems();
  const catalog = dbItems
    ? [...dbItems, ...STATIC_CAREERS]
    : [...DEMO_ITEMS, ...STATIC_CAREERS];

  return catalog.filter((item) => matches(item, query)).slice(0, limit);
}

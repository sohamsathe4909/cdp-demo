"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  BriefcaseBusiness,
  Layers,
  Radio,
  Search,
} from "lucide-react";

import type { SearchResult, SearchResultType } from "@cdp/types";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const typeIcon: Record<SearchResultType, typeof BookOpen> = {
  lesson: BookOpen,
  track: Layers,
  career: BriefcaseBusiness,
  expinar: Radio,
};

interface HeaderSearchProps {
  className?: string;
  inputClassName?: string;
}

export function HeaderSearch({ className, inputClassName }: HeaderSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal },
        );

        if (!response.ok) return;

        const data = (await response.json()) as { results: SearchResult[] };
        setResults(data.results);
        setOpen(true);
      } catch {
        // Aborted or offline — keep whatever we had.
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close when clicking outside the search box.
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function goTo(item: SearchResult) {
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(item.href);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && results.length > 0) {
      event.preventDefault();
      goTo(results[0]);
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8f88]" />

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search lessons"
        aria-label="Search lessons"
        className={cn(
          "h-10 rounded-full border-[#0e0e0e]/10 bg-white pl-11 pr-4 text-sm text-[#0e0e0e] shadow-none placeholder:text-[#9aa19b] focus-visible:border-[#0e0e0e]/30 focus-visible:ring-[#1ed2f4]/40",
          inputClassName,
        )}
      />

      {open && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-black/10 bg-white p-1.5 shadow-xl">
          {loading && results.length === 0 && (
            <p className="px-3 py-3 text-sm text-[#5a5f58]">Searching…</p>
          )}

          {!loading && results.length === 0 && (
            <p className="px-3 py-3 text-sm text-[#5a5f58]">
              No results for “{query.trim()}”
            </p>
          )}

          {results.map((item) => {
            const Icon = typeIcon[item.type];

            return (
              <button
                key={item.id}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  goTo(item);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[#f9fff6]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f9fff6] text-[#0e0e0e]">
                  <Icon className="h-4 w-4" />
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-[#0e0e0e]">
                    {item.title}
                  </span>

                  <span className="block truncate text-xs text-[#5a5f58]">
                    {item.subtitle}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

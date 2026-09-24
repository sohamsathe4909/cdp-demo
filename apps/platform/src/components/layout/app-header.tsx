"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ExternalLink,
  LogOut,
  Menu,
  User,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { APP_CONFIG } from "@/lib/config";

import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { HeaderSearch } from "./header-search";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  user: {
    email: string;
    name: string;
  };
  onMenuClick: () => void;
}

export function AppHeader({ user, onMenuClick }: AppHeaderProps) {
  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  const initials =
    user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0e0e0e]/95 backdrop-blur-xl">
      <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-white/40 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo — top left. On lg the fixed width ends exactly at the
            drawer's right edge (250px), so the Expinar button starts
            aligned with the drawer / main-content boundary.
            Dark artwork flipped white to read on the black header. */}
        <Link
          href="/dashboard"
          aria-label="Rarewise home"
          className="flex shrink-0 items-center lg:w-[206px]"
        >
          <Image
            src="/rarewise-logo.png"
            alt="Rarewise"
            width={1067}
            height={215}
            priority
            className="h-6 w-auto brightness-0 invert sm:h-7"
          />
        </Link>

        {/* Expinar — beside the logo. Always-on brand yellow against the
            black header, with a red pulsing live dot and glow so it reads
            as the one thing worth clicking. */}
        <a
          href={APP_CONFIG.expinarUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open Expinar"
          className="group ml-3 hidden h-10 items-center gap-2 rounded-full bg-[#f8dc03] px-4 text-sm font-semibold text-[#0e0e0e] shadow-[0_0_14px_rgba(248,220,3,0.35)] transition hover:-translate-y-0.5 hover:bg-[#ffe14a] hover:shadow-[0_8px_24px_rgba(248,220,3,0.6)] sm:ml-5 sm:inline-flex lg:ml-0"
        >
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e50914]/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e50914]" />
          </span>
          Expinar
          <ExternalLink className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </a>

        {/* Search — beside the Expinar */}
        <HeaderSearch className="mx-auto hidden w-full max-w-xl md:block" />

        {/* User profile — top right */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ml-auto flex items-center gap-2 rounded-full outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#1ed2f4]/50"
              aria-label="Open profile menu"
            >
              <Avatar
                fallback={initials}
                className="h-9 w-9 border border-[#0e0e0e]/10 bg-[#1ed2f4] text-xs font-bold text-[#0e0e0e]"
              />

              <span className="hidden max-w-[130px] truncate text-sm font-medium text-white xl:block">
                {user.name}
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="w-64 rounded-2xl border-black/10 bg-white p-2 shadow-xl"
          >
            <div className="px-3 py-3">
              <p className="text-sm font-semibold text-[#0e0e0e]">
                {user.name}
              </p>

              <p className="mt-1 truncate text-xs text-[#5a5f58]">
                {user.email}
              </p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link
                href="/profile"
                className="cursor-pointer rounded-lg"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Compact search + Expinar row on small screens */}
      <div className="flex gap-2 border-t border-white/10 px-4 py-3 md:hidden">
        <HeaderSearch className="min-w-0 flex-1" />

        <a
          href={APP_CONFIG.expinarUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open Expinar"
          className="group inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#f8dc03] px-4 text-sm font-semibold text-[#0e0e0e] shadow-[0_0_14px_rgba(248,220,3,0.35)] transition hover:-translate-y-0.5 hover:bg-[#ffe14a] hover:shadow-[0_8px_24px_rgba(248,220,3,0.6)]"
        >
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e50914]/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e50914]" />
          </span>
          Expinar
          <ExternalLink className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </a>
      </div>
    </header>
  );
}

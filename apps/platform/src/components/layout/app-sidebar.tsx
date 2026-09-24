"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  BriefcaseBusiness,
  LayoutDashboard,
  X,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Careers",
    href: "/careers",
    icon: BriefcaseBusiness,
  },
];

interface AppSidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function AppSidebar({
  mobile = false,
  onNavigate,
}: AppSidebarProps) {
  const pathname = usePathname() ?? "";

  return (
    <aside
      className={
        mobile
          ? "flex h-full w-full flex-col bg-[#f9fff6]"
          : "sticky top-[72px] hidden h-[calc(100vh-72px)] w-[250px] shrink-0 flex-col border-r border-black/10 bg-[#f9fff6] lg:flex"
      }
    >
      {mobile && (
        <div className="flex h-[72px] items-center justify-between border-b border-black/10 px-5">
          <Link
            href="/dashboard"
            className="flex items-center"
            aria-label="Rarewise home"
            onClick={onNavigate}
          >
            {/* Dark artwork reads natively on the light drawer */}
            <Image
              src="/rarewise-logo.png"
              alt="Rarewise"
              width={1067}
              height={215}
              className="h-7 w-auto"
            />
          </Link>

          <button
            type="button"
            onClick={onNavigate}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5a5f58] hover:bg-black/5 hover:text-[#0e0e0e]"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-1.5 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={[
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200",
                active
                  ? "bg-[#f8dc03] font-semibold text-[#0e0e0e] shadow-sm"
                  : "font-medium text-[#5a5f58] hover:bg-black/5 hover:text-[#0e0e0e]",
              ].join(" ")}
            >
              <Icon
                className={
                  active
                    ? "h-[18px] w-[18px] text-[#0e0e0e]"
                    : "h-[18px] w-[18px] text-[#8a8f88] group-hover:text-[#0e0e0e]"
                }
              />

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

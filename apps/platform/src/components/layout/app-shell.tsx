"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

interface AppShellProps {
  user: {
    email: string;
    name: string;
  };
  children: ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f9fff6] text-[#0e0e0e]">
      <AppHeader
        user={user}
        onMenuClick={() => setMobileSidebarOpen(true)}
      />

      <div className="flex">
        <AppSidebar />

        {mobileSidebarOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation"
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />

            <div className="fixed left-0 top-0 z-50 h-full w-[280px] bg-[#f9fff6] shadow-2xl lg:hidden">
              <AppSidebar
                mobile
                onNavigate={() => setMobileSidebarOpen(false)}
              />
            </div>
          </>
        )}

        <main className="min-w-0 flex-1 bg-[radial-gradient(1000px_440px_at_95%_-10%,#e9f7e5,transparent_70%)]">
          {children}
        </main>
      </div>
    </div>
  );
}

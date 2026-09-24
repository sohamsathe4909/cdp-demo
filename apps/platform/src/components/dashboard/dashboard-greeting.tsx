"use client";

import { useEffect, useState } from "react";

import { getGreeting } from "@/lib/dashboard-format";

interface DashboardGreetingProps {
  firstName: string;
}

export function DashboardGreeting({ firstName }: DashboardGreetingProps) {
  const [greeting, setGreeting] = useState(() => getGreeting());

  useEffect(() => {
    const updateGreeting = () => setGreeting(getGreeting());
    updateGreeting();

    // Keep the greeting accurate if the dashboard stays open across a boundary.
    const timer = window.setInterval(updateGreeting, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.03em] text-[#0e0e0e] sm:text-4xl">
      {greeting}, {firstName}
    </h1>
  );
}

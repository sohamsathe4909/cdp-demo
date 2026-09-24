import { createClient } from "@/lib/supabase/server";
import { getDashboardSummary } from "@/lib/dashboard";
import { getDisplayName, getFirstName } from "@/lib/user";

import { ThirtyDayStrip } from "@/components/dashboard/thirty-day-strip";
import { ModuleCard } from "@/components/dashboard/module-card";
import { LiveExpinarCard } from "@/components/dashboard/live-expinar-card";
import { TracksCard } from "@/components/dashboard/tracks-card";
import { BadgesCard } from "@/components/dashboard/badges-card";
import { CareerFitCard } from "@/components/dashboard/career-fit-card";
import { ActivityCharts } from "@/components/dashboard/activity-charts";
import { StreakCard } from "@/components/dashboard/streak-card";
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";
  const name = getDisplayName(
    email,
    user?.user_metadata
      ? (user.user_metadata as Record<string, unknown>)
      : null,
  );

  const summary = await getDashboardSummary({
    userId: user?.id ?? "usr_demo_01",
    name,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
      {/* Greeting */}
      <header>
        <DashboardGreeting firstName={getFirstName(name)} />

        <p className="mt-2.5 text-[15px] leading-6 text-[#5a5f58]">
          {summary.headlineNote}
        </p>
      </header>

      {/* Your 30 days */}
      <div className="mt-7">
        <ThirtyDayStrip
          plan={summary.program}
          tracks={summary.tracks}
          careerFit={summary.careerFit}
          liveExpinar={summary.liveExpinar}
        />
      </div>

      {/* Current module + live Expinar */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[minmax(0,1fr)_370px]">
        <ModuleCard module={summary.currentModule} steps={summary.steps} />
        <LiveExpinarCard expinar={summary.liveExpinar} />
      </div>

      {/* Tracks + badges + career-fit report */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[minmax(0,1fr)_370px]">
        <TracksCard tracks={summary.tracks} />

        <div className="flex flex-col gap-6">
          <BadgesCard
            items={summary.badges.items}
            earned={summary.badges.earned}
            total={summary.badges.total}
          />

          <CareerFitCard report={summary.careerFit} />
        </div>
      </div>

      {/* Activity charts + learning streak */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[minmax(0,1fr)_370px]">
        <ActivityCharts
          bar={summary.activity.bar}
          line={summary.activity.line}
          currentDay={summary.program.currentDay}
          totalDays={summary.program.totalDays}
        />
        <StreakCard streak={summary.streak} />
      </div>
    </div>
  );
}

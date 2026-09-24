import { createClient } from "@/lib/supabase/server";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  CircleUserRound,
} from "lucide-react";

function getDisplayName(
  email: string,
  metadata: Record<string, unknown> | null,
) {
  const metadataName =
    typeof metadata?.full_name === "string"
      ? metadata.full_name
      : typeof metadata?.name === "string"
        ? metadata.name
        : null;

  if (metadataName?.trim()) {
    return metadataName.trim();
  }

  return email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";

  const name = getDisplayName(
    email,
    user?.user_metadata as Record<string, unknown> | null,
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b634d]">
          Your profile
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Your career space.
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-[#69726c]">
          This is where your interests, career exploration and progress will
          gradually come together.
        </p>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[28px] border border-black/[0.07] bg-white p-7 shadow-sm sm:p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e7eee8]">
            <CircleUserRound className="h-7 w-7 text-[#456153]" />
          </div>

          <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">
            {name}
          </h2>

          <p className="mt-2 text-sm text-[#767e79]">{email}</p>

          <div className="mt-7 rounded-xl bg-[#f5f2eb] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#8b634d]">
              Current status
            </p>

            <p className="mt-2 text-sm font-medium text-[#4d5952]">
              Career exploration not started
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-black/[0.07] bg-white p-7 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-[#68716c]">
                Your journey
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                0% complete
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf1ec]">
              <BriefcaseBusiness className="h-5 w-5 text-[#456153]" />
            </div>
          </div>

          <div className="mt-7 h-2 overflow-hidden rounded-full bg-[#ece9e2]">
            <div className="h-full w-0 rounded-full bg-[#557365]" />
          </div>

          <div className="mt-8 space-y-4">
            {[
              "Complete your profile",
              "Explore career tracks",
              "Try your first simulation",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-black/[0.06] px-4 py-3"
              >
                <CheckCircle2 className="h-4 w-4 text-[#557365]" />

                <span className="text-sm text-[#59635d]">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#1d2823] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2d3a34]"
          >
            Start exploring
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  CircleDollarSign,
  LineChart,
  Sparkles,
  WalletCards,
} from "lucide-react";

const careers = [
  {
    title: "Investment Banking",
    description:
      "Explore deals, valuation, M&A and transaction-driven financial work.",
    category: "Deal-making",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1400",
    icon: BriefcaseBusiness,
  },
  {
    title: "Equity Research",
    description:
      "Study businesses, industries, financial statements and investment opportunities.",
    category: "Research",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400",
    icon: LineChart,
  },
  {
    title: "Private Wealth",
    description:
      "Understand clients, portfolios, risk and long-term wealth planning.",
    category: "Advisory",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1400",
    icon: WalletCards,
  },
  {
    title: "VC / Private Equity",
    description:
      "Explore founders, businesses, investments, diligence and deal decisions.",
    category: "Investing",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400",
    icon: CircleDollarSign,
  },
  {
    title: "Future of Finance",
    description:
      "Discover emerging opportunities across fintech, AI and digital finance.",
    category: "Emerging",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400",
    icon: Sparkles,
  },
];

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e50914]">
          Career discovery
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
          Explore the work before you choose the path.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-[#5a5f58] sm:text-lg">
          Finance isn&apos;t one career. Explore different paths, understand how
          they differ and discover which kind of work interests you.
        </p>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {careers.map((career) => {
          const Icon = career.icon;

          return (
            <article
              key={career.title}
              className="group rounded-[28px] border-2 border-[#0e0e0e] bg-white p-6 shadow-[6px_6px_0_rgba(14,14,14,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_#f8dc03] sm:p-7"
            >
              {/* Framed photo */}
              <div className="relative aspect-[1.35] overflow-hidden rounded-[18px] border border-black/10">
                <Image
                  src={career.image}
                  alt={career.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8dc03] text-[#0e0e0e]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              {/* Auth-box header rhythm: chip → title → yellow slash → copy */}
              <div className="pt-6">
                <span className="inline-block rounded-md bg-[#f8dc03] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0e0e0e]">
                  {career.category}
                </span>

                <div className="mt-4 flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-extrabold tracking-[-0.035em]">
                    {career.title}
                  </h2>

                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[#8a8f88] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#1ed2f4]" />
                </div>

                <span className="mt-3 block h-[3px] w-12 rotate-[-3deg] rounded bg-[#f8dc03]" />

                <p className="mt-3 text-sm leading-6 text-[#5a5f58]">
                  {career.description}
                </p>

                <div className="mt-5 inline-block text-sm font-semibold text-[#0e0e0e] underline decoration-[#f8dc03] decoration-2 underline-offset-4 transition group-hover:decoration-[#1ed2f4]">
                  Explore career
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="mt-14 overflow-hidden rounded-[28px] bg-[#0e0e0e] p-8 text-white sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#f8dc03]">
          The CDP approach
        </p>

        <div className="mt-4 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Explore. Experience. Reflect. Decide.
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/60 sm:text-base">
              You don&apos;t need to know your perfect career today. Start by
              understanding what different paths actually look like.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-[#f8dc03] px-5 py-3 text-sm font-semibold text-[#0e0e0e] transition hover:bg-[#ffe14a]"
          >
            Back to dashboard
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CircleDollarSign,
  FlaskConical,
  LineChart,
  Menu,
  NotebookPen,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";

const careerTracks = [
  {
    title: "Investment Banking",
    description:
      "Explore deals, valuation, M&A and the fast-paced work behind major financial decisions.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Equity Research",
    description:
      "Learn how analysts study businesses, markets, financial statements and investment thesis.",
    icon: LineChart,
  },
  {
    title: "Private Wealth",
    description:
      "Understand how wealth managers think about portfolios, clients, risk and long-term capital.",
    icon: WalletCards,
  },
  {
    title: "VC / Private Equity",
    description:
      "Step into the world of founders, businesses, investment opportunities and deal decisions.",
    icon: CircleDollarSign,
  },
  {
    title: "Future of Finance",
    description:
      "Explore emerging opportunities across fintech, AI, digital finance and new-age finance models.",
    icon: Sparkles,
  },
];

const learningPath = [
  {
    title: "Explore",
    description: "Discover careers and big picture opportunities.",
  },
  {
    title: "Try",
    description: "Work on real-world projects and case studies.",
  },
  {
    title: "Reflect",
    description: "Make sense of what excites you.",
  },
  {
    title: "Connect",
    description: "Learn from people in the field.",
  },
  {
    title: "Decide",
    description: "Take your next step with confidence.",
  },
];

const navItems = [
  { label: "Career labs", href: "#careers" },
  { label: "Reflections", href: "#reflection" },
];

const navLinkClasses =
  "relative py-2 text-[16px] font-semibold text-[#0e0e0e] transition group-hover:text-white after:absolute after:bottom-1 after:left-0 after:h-[3px] after:w-full after:origin-left after:scale-x-0 after:bg-[#f8dc03] after:transition-transform after:duration-200 hover:after:scale-x-100";

/* ---------------------------------------------------------
    Hero illustration — folder + cards, drawn to match the
    Gold + Aqua / Studio design
--------------------------------------------------------- */
function HeroIllustration() {
  return (
    <div className="relative mx-auto h-[330px] w-full max-w-[560px] sm:h-[420px] lg:h-[470px]">
      {/* Handwritten note — top right */}
      <div className="absolute right-0 top-0 hidden w-[150px] rotate-[-5deg] text-right sm:block">
        <p className="font-hand text-[17px] font-bold uppercase leading-[1.15] tracking-[0.02em] text-[#0e0e0e]">
          Same curiosity.
          <br />
          A brighter tomorrow.
        </p>
        <span className="ml-auto mt-1.5 block h-[3px] w-9 rotate-[-4deg] rounded bg-[#f8dc03]" />
      </div>

      {/* Doodle strokes — upper left */}
      <div className="absolute left-0 top-[16%] z-0 flex flex-col gap-1.5">
        <span className="block h-[3px] w-6 -rotate-[28deg] rounded-full bg-[#0e0e0e]" />
        <span className="block h-[3px] w-7 rounded-full bg-[#0e0e0e]" />
        <span className="block h-[3px] w-6 rotate-[24deg] rounded-full bg-[#0e0e0e]" />
      </div>

      {/* White card — bar chart */}
      <div className="absolute left-[56%] top-[11%] z-10 w-[37%] rotate-[5deg] rounded-[10px] border-2 border-[#0e0e0e] bg-white p-3 shadow-[4px_4px_0_rgba(14,14,14,0.10)] sm:p-4">
        <p className="text-[9px] font-extrabold uppercase leading-snug tracking-[0.06em] sm:text-[11px]">
          A brighter
          <br />
          you in finance
        </p>
        <div className="mt-3 flex h-8 items-end gap-1.5 sm:h-12">
          <span className="h-[35%] w-[18%] rounded-[2px] border-2 border-[#0e0e0e] bg-[#f8dc03]" />
          <span className="h-[60%] w-[18%] rounded-[2px] border-2 border-[#0e0e0e] bg-white" />
          <span className="h-[95%] w-[18%] rounded-[2px] bg-[#0e0e0e]" />
        </div>
        <div className="mt-3 space-y-1.5">
          <span className="block h-[3px] w-full rounded bg-black/15" />
          <span className="block h-[3px] w-[80%] rounded bg-black/15" />
          <span className="block h-[3px] w-[45%] rounded bg-[#f8dc03]" />
        </div>
      </div>

      {/* Aqua card — the list */}
      <div className="absolute left-[26%] top-0 z-20 w-[41%] rotate-[-6deg] rounded-[10px] border-2 border-[#0e0e0e] bg-[#1ed2f4] p-3 shadow-[4px_4px_0_rgba(14,14,14,0.10)] sm:p-4">
        <ul className="space-y-0.5 text-[10px] font-extrabold uppercase leading-snug tracking-[0.05em] text-[#0e0e0e] sm:text-[12px]">
          <li>Explore</li>
          <li>Learn</li>
          <li>Reflect</li>
          <li>Connect</li>
          <li>Decide</li>
        </ul>
        <span className="mt-2 block h-[3px] w-7 rounded bg-[#0e0e0e]" />
      </div>

      {/* Yellow folder */}
      <div className="absolute left-[4%] top-[32%] z-30 w-[58%] rotate-[-3deg]">
        <svg viewBox="0 0 340 250" fill="none" className="block w-full">
          <path
            d="M 20,38 L 32,38 Q 40,38 40,30 L 40,24 Q 40,16 48,16 L 162,16 Q 170,16 170,24 L 170,30 Q 170,38 178,38 L 320,38 Q 332,38 332,50 L 332,228 Q 332,240 320,240 L 20,240 Q 8,240 8,228 L 8,50 Q 8,38 20,38 Z"
            fill="#f8dc03"
            stroke="#0e0e0e"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </svg>
        <div className="absolute left-[16%] top-[24%] rotate-[-4deg]">
          <p className="font-hand text-[20px] font-bold leading-[1.05] text-[#0e0e0e] sm:text-[26px] lg:text-[30px]">
            Ideas
            <br />
            today.
            <br />
            Options
            <br />
            tomorrow.
          </p>
          <span className="mt-2 block h-[3px] w-10 rotate-[-3deg] rounded bg-[#0e0e0e]" />
        </div>
      </div>

      {/* Handwritten note — bottom right */}
      <div className="absolute bottom-[4%] right-0 hidden w-[150px] rotate-[6deg] text-right sm:block">
        <p className="font-hand text-[17px] font-bold uppercase leading-[1.15] text-[#0e0e0e]">
          Careers are built
          <br />
          by exploration.
        </p>
        <span className="ml-auto mt-1.5 block h-[3px] w-9 rotate-[4deg] rounded bg-[#1ed2f4]" />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  /* Which tab owns the yellow underline: "home", "#careers" or "#reflection" */
  const [activeNav, setActiveNav] = useState("home");

  /* Keep the underline in step with the URL (deep links, back/forward) */
  useEffect(() => {
    const syncActiveNav = () => setActiveNav(window.location.hash || "home");
    syncActiveNav();
    window.addEventListener("hashchange", syncActiveNav);
    return () => window.removeEventListener("hashchange", syncActiveNav);
  }, []);

  return (
    <main className="min-h-screen bg-[#f9fff6] text-[#0e0e0e] selection:bg-[#f8dc03] selection:text-[#0e0e0e]">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="group sticky top-0 z-50 border-b border-black/10 bg-[#f9fff6] shadow-[0_2px_14px_rgba(0,0,0,0.06)] transition-colors duration-300 hover:border-white/10 hover:bg-[#0e0e0e] hover:shadow-[0_2px_14px_rgba(0,0,0,0.18)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-8 lg:gap-12">
            {/* Logo: Rarewise — dark on the white bar, flipped white the
                moment the header turns black on hover */}
            <Link href="/" className="flex items-center" aria-label="Rarewise home">
              <Image
                src="/rarewise-logo.png"
                alt="Rarewise"
                width={1067}
                height={215}
                priority
                className="h-5 w-auto transition group-hover:brightness-0 group-hover:invert"
              />
            </Link>

            {/* Nav — the clicked tab keeps the yellow underline, the rest lose it */}
            <nav className="hidden items-center gap-8 lg:flex">
              <Link
                href="/"
                onClick={() => setActiveNav("home")}
                className={`${navLinkClasses}${activeNav === "home" ? " after:scale-x-100" : ""}`}
              >
                Home
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setActiveNav(item.href)}
                  className={`${navLinkClasses}${activeNav === item.href ? " after:scale-x-100" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side: auth actions — no user profile */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/login"
              className="rounded-lg border-2 border-[#f8dc03] px-4 py-2 text-[16px] font-semibold text-[#0e0e0e] transition hover:bg-black/5 group-hover:text-white group-hover:hover:bg-white/10"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[#f8dc03] px-5 py-2.5 text-[16px] font-bold text-[#0e0e0e] shadow-sm transition hover:bg-[#ffe95a] active:scale-[0.98]"
            >
              Sign up
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#0e0e0e] transition hover:bg-black/5 group-hover:text-white group-hover:hover:bg-white/10 lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-black/10 bg-[#f9fff6] px-5 py-4 transition-colors group-hover:border-white/10 group-hover:bg-[#0e0e0e] lg:hidden space-y-3">
            <Link
              href="/"
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveNav("home");
              }}
              className="block text-[16px] font-semibold text-[#0e0e0e] transition-colors group-hover:text-white"
            >
              Home
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveNav(item.href);
                }}
                className="block text-[16px] font-semibold text-[#0e0e0e] transition-colors group-hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-10 pt-8 sm:px-8 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-14 lg:pt-14">
          <div>
            {/* Career advice — FamApp-style vertical word rotator.
                Two hard lines: the statement, then "from" + the rotating
                word. Each line has its own nowrap so neither can break. */}
            <div className="hero-tagline font-extrabold leading-[1.08] tracking-[-0.03em] text-[#0e0e0e]">
              <span className="sr-only">
                Stop Taking Career advice from Relatives, Neighbours, ChatGPT, Friends, Influencers or Astrologers
              </span>
              <span aria-hidden="true" className="block">
                <span className="block whitespace-nowrap">
                  Stop Taking Career advice
                </span>
                <span className="flex items-center gap-x-[0.28em] whitespace-nowrap">
                  <span>from</span>
                  <span className="word-rotator">
                    <span className="word-rotator__list">
                      <span className="word-rotator__item">Relatives</span>
                      <span className="word-rotator__item">Neighbours</span>
                      <span className="word-rotator__item">ChatGPT</span>
                      <span className="word-rotator__item">Friends</span>
                      <span className="word-rotator__item">Influencers</span>
                      <span className="word-rotator__item">Astrologers</span>
                    </span>
                  </span>
                </span>
              </span>
            </div>

            <h1 className="mt-6 text-[22px] font-extrabold leading-[1.02] tracking-[-0.045em] text-[#0e0e0e] sm:text-[28px] lg:text-[30px]">
              <span className="block">Find your direction.</span>
              <span className="block">Try the work.</span>
            </h1>

            <p className="mt-6 max-w-[520px] text-base leading-7 text-[#3f443e] sm:text-[17px]">
              Explore real finance careers. Learn by doing. Build clarity at
              your own pace.
            </p>
            <a
              href="#careers"
              className="mt-8 inline-flex items-center gap-3 rounded-[14px] bg-[#0e0e0e] px-6 py-3.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-black active:scale-[0.98]"
            >
              Explore careers
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <HeroIllustration />
        </div>
      </section>

      {/* =========================================================
          ACTION CARDS (Continue-learning card intentionally omitted)
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-5 pb-4 sm:px-8 lg:px-10">
        <div className="grid gap-5 md:grid-cols-2">
          {/* Your next career lab — gold */}
          <Link
            href="/careers"
            className="group relative flex min-h-[172px] flex-col rounded-[18px] bg-[#f8dc03] p-6 transition hover:shadow-[6px_6px_0_rgba(14,14,14,0.12)] sm:p-7"
          >
            <div className="flex gap-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/70">
                <FlaskConical className="h-6 w-6 text-[#0e0e0e]" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0e0e0e]">
                  Your next career lab
                </p>
                <h2 className="mt-2 text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-[#0e0e0e]">
                  Build an investment view
                </h2>
                <p className="mt-2 max-w-[340px] text-sm leading-6 text-[#0e0e0e]/80">
                  Apply what you&apos;ve learned in a hands-on simulation.
                </p>
              </div>
            </div>
            <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-[#0e0e0e] transition group-hover:translate-x-1 sm:bottom-7 sm:right-7" />
          </Link>

          {/* Reflection journal — aqua */}
          <Link
            id="reflection"
            href="/dashboard"
            className="group relative flex min-h-[172px] flex-col rounded-[18px] bg-[#1ed2f4] p-6 transition hover:shadow-[6px_6px_0_rgba(14,14,14,0.12)] sm:p-7"
          >
            <div className="flex gap-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/70">
                <NotebookPen className="h-6 w-6 text-[#0e0e0e]" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0e0e0e]">
                  Reflection journal
                </p>
                <h2 className="mt-2 text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-[#0e0e0e]">
                  What felt interesting today?
                </h2>
                <p className="mt-2 max-w-[340px] text-sm leading-6 text-[#0e0e0e]/80">
                  Capture your thoughts, questions and evolving interests.
                </p>
              </div>
            </div>
            <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-[#0e0e0e] transition group-hover:translate-x-1 sm:bottom-7 sm:right-7" />
          </Link>
        </div>
      </section>

      {/* =========================================================
          CAREER TRACKS — target of the "Explore careers" button
      ========================================================= */}
      <section
        id="careers"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 sm:px-8 lg:px-10 lg:py-16"
      >
        <div className="max-w-2xl">
          <p className="text-[13px] font-bold uppercase tracking-[0.28em] text-[#0e0e0e]">
            Career tracks
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.035em] text-[#0e0e0e] sm:text-4xl">
            See what the work looks like before you choose the path.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#4b504a]">
            Explore the different sides of finance and understand the kind of
            challenges each role handles.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {careerTracks.map((track, index) => {
            const Icon = track.icon;
            const accent = index % 2 === 0 ? "bg-[#f8dc03]" : "bg-[#1ed2f4]";
            return (
              <article
                key={track.title}
                className="group flex flex-col rounded-[18px] border border-black/10 bg-white p-6 transition hover:border-[#0e0e0e]/25 hover:shadow-[5px_5px_0_rgba(14,14,14,0.08)]"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${accent}`}
                >
                  <Icon className="h-5 w-5 text-[#0e0e0e]" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold tracking-[-0.02em] text-[#0e0e0e]">
                  {track.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-[#5a5f58]">
                  {track.description}
                </p>
                <Link
                  href="/signup"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0e0e0e]"
                >
                  Explore path
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          YOUR LEARNING PATH
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-6">
          <div className="shrink-0 lg:w-[190px]">
            <h2 className="text-[19px] font-bold tracking-[-0.02em] text-[#0e0e0e]">
              Your learning path
            </h2>
            <p className="mt-1 text-sm text-[#5a5f58]">
              From curiosity to clarity.
            </p>
          </div>

          <ol className="grid flex-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
            {learningPath.map((step, index) => (
              <li key={step.title} className="relative">
                <div className="flex items-center">
                  <span
                    className={`z-10 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#0e0e0e] ${index % 2 === 0 ? "bg-[#f8dc03]" : "bg-[#1ed2f4]"
                      }`}
                  >
                    {index + 1}
                  </span>
                  {index !== learningPath.length - 1 && (
                    <span className="ml-2 hidden flex-1 border-t-2 border-dotted border-[#0e0e0e]/35 lg:block" />
                  )}
                </div>
                <h3 className="mt-4 pr-5 text-[15px] font-bold text-[#0e0e0e]">
                  {step.title}
                </h3>
                <p className="mt-1 max-w-[180px] pr-5 text-[13px] leading-5 text-[#5a5f58]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>

          {/* Handwritten aside */}
          <div className="hidden w-[150px] shrink-0 rotate-[-6deg] lg:block">
            <ArrowUpRight
              className="mb-2 h-9 w-9 text-[#0e0e0e]"
              strokeWidth={2.5}
            />
            <p className="font-hand text-[18px] font-bold uppercase leading-[1.15] text-[#0e0e0e]">
              Different perspectives.
              <br />
              A clearer you.
            </p>
            <span className="mt-1.5 block h-[3px] w-12 rotate-[-3deg] rounded bg-[#f8dc03]" />
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t-2 border-[#f8dc03] bg-[#0e0e0e] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Image
              src="/rarewise-logo.png"
              alt="Rarewise"
              width={1067}
              height={215}
              className="h-9 w-auto brightness-0 invert"
            />
            <span className="hidden h-6 w-px bg-white/20 sm:block" />
            <span className="text-base text-white/70 sm:text-[17px]">
              Explore. Try. Reflect. Connect. Decide.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-base text-white/70 sm:text-[17px]">
              A more intentional you.
            </span>
            <span className="block h-[3px] w-9 bg-[#f8dc03]" />
          </div>
        </div>
      </footer>
    </main>
  );
}

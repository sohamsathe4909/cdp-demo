"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";

import {
  AUTH,
  articles,
  careers,
  comparisons,
  experts,
  footerColumns,
  learnerStories,
  navItems,
  trustItems,
} from "./landing-content";
import { FadeUp, HighlightStatement, Marquee, Reveal } from "./landing-motion";
import {
  ArticleDoodle,
  HandbookMock,
  IndiaDots,
  LearnerThumb,
  LiveSessionMock,
  PortfolioMock,
  PlusToggle,
  ReportMock,
  SimulationMock,
  Skyline,
  VideoModuleMock,
} from "./landing-illustrations";

/* ---------------------------------------------------------
    Shared bits
--------------------------------------------------------- */
function CdpMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={`font-extrabold leading-none tracking-[-0.06em] text-white ${
          compact ? "text-[22px]" : "text-[26px]"
        }`}
      >
        CDP
      </span>
      <span className="hidden border-l border-white/20 pl-2.5 text-[9px] font-semibold uppercase leading-[1.3] tracking-[0.08em] text-white/55 sm:block">
        Career Discovery Program
        <br />
        by FinTree
      </span>
    </span>
  );
}

function GoldButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2.5 rounded-full bg-[#f8dc03] py-2 pl-5 pr-2 text-[14px] font-extrabold text-[#0e0e0e] transition-all duration-300 hover:bg-[#ffe95a] active:scale-[0.98] ${className}`}
    >
      {children}
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0e0e0e] text-[#f8dc03] transition-transform duration-300 group-hover:rotate-45">
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

function TextLink({
  href,
  children,
  tone = "light",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const tones =
    tone === "light"
      ? "text-white underline decoration-white/35 decoration-2 underline-offset-[7px] hover:decoration-[#f8dc03]"
      : "text-[#0e0e0e] underline decoration-[#f8dc03] decoration-2 underline-offset-[7px] hover:decoration-[#0e0e0e]";
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-[14px] font-extrabold transition-colors ${tones} ${className}`}
    >
      {children}
    </Link>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mx-auto max-w-[22ch] text-center text-[clamp(30px,4.4vw,50px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-white">
      {children}
    </h2>
  );
}

/** Forces the mockup's line break on sm+ while letting small screens wrap. */
function Break() {
  return (
    <>
      <br className="hidden sm:inline" />
      {/* keeps the word gap when the break is hidden on small screens */}
      {" "}
    </>
  );
}

const mediaByKind = {
  video: VideoModuleMock,
  live: LiveSessionMock,
  simulation: SimulationMock,
  report: ReportMock,
};

/* ---------------------------------------------------------
    Header
--------------------------------------------------------- */
function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0e0e0e]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link href="/" aria-label="CDP home">
            <CdpMark />
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group relative py-2 text-[13px] font-semibold text-white/65 transition-colors hover:text-white"
              >
                {item.label}
                <span className="absolute bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#f8dc03] transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href={AUTH.login}
            className="hidden text-[13px] font-bold text-white/75 transition-colors hover:text-white sm:inline-flex"
          >
            Log in
          </Link>
          <Link
            href={AUTH.signup}
            className="group inline-flex items-center gap-2 rounded-full bg-[#f8dc03] py-1.5 pl-4 pr-1.5 text-[13px] font-extrabold text-[#0e0e0e] transition hover:bg-[#ffe95a]"
          >
            Sign up
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0e0e0e] text-[#f8dc03] transition-transform duration-300 group-hover:rotate-45">
              <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-white/40 lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/10 bg-[#0e0e0e] lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-5 py-4 sm:px-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2.5 text-[15px] font-semibold text-white/75 transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-3 flex items-center gap-4 border-t border-white/10 pt-4">
                <Link
                  href={AUTH.login}
                  onClick={() => setOpen(false)}
                  className="text-[15px] font-bold text-white/80 underline decoration-white/30 decoration-2 underline-offset-4"
                >
                  Log in
                </Link>
                <GoldButton href={AUTH.signup} className="ml-auto">
                  Sign up
                </GoldButton>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------------------------------------------------------
    Hero
--------------------------------------------------------- */
function Hero() {
  return (
    <section className="overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 pb-6 pt-12 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">
        <FadeUp>
          <h1 className="max-w-[20ch] text-[clamp(40px,7.4vw,84px)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white">
            Try a finance career
            <Break />
            before you choose it
          </h1>
        </FadeUp>

        <FadeUp delay={0.12}>
          <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-white/55 sm:text-base">
            CDP is a 30-day program. You work through five finance careers and
            leave with a report that shows which one fits you.
          </p>
        </FadeUp>

        <FadeUp delay={0.22}>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <GoldButton href={AUTH.signup}>Sign up</GoldButton>
            <TextLink href={AUTH.login}>Log in</TextLink>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
    Hear from our learners
--------------------------------------------------------- */
function LearnerRail() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Reveal>
          <p className="text-[13px] font-semibold text-white/45">
            Hear from our learners
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.1} className="mt-5">
        <Marquee duration={64}>
          {learnerStories.map((story, index) => (
            <article
              key={index}
              className="w-[268px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_24px_50px_-32px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:-translate-y-1 sm:w-[320px]"
            >
              <LearnerThumb tone={story.tone} start={story.start} end={story.end} />
              <div className="p-4 sm:p-5">
                <p className="text-[15px] font-extrabold leading-snug tracking-[-0.02em] text-[#0e0e0e] sm:text-[17px]">
                  {story.quote}
                </p>
                <p className="mt-4 text-[13px] font-bold text-[#0e0e0e]">
                  {story.name}
                </p>
                <p className="text-[11px] text-[#5a5f58]">{story.meta}</p>
              </div>
            </article>
          ))}
        </Marquee>
      </Reveal>
    </section>
  );
}

/* ---------------------------------------------------------
    Founder statement — words light up on scroll
--------------------------------------------------------- */
function FounderStatement() {
  return (
    <section id="founder" className="scroll-mt-24 py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <HighlightStatement
          text="Most students choose a finance career by reading about it. Then they commit and hope it fits. We built CDP so you can do the work first, and choose once you know."
          className="max-w-[1000px] text-[clamp(24px,3.6vw,44px)] font-extrabold leading-[1.18] tracking-[-0.035em] text-white"
        />
        <Reveal delay={0.1}>
          <div className="mt-8 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[13px] font-extrabold text-[#0e0e0e]">
              UJ
            </span>
            <span>
              <span className="block text-[15px] font-bold text-white">
                Utkarsh Jain
              </span>
              <span className="block text-[13px] text-white/50">
                Founder, FinTree Education
              </span>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
    Skyline
--------------------------------------------------------- */
function SkylineSection() {
  return (
    <section className="pb-6 sm:pb-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Skyline />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
    How CDP does things differently
--------------------------------------------------------- */
function HowDifferent() {
  return (
    <section id="how" className="scroll-mt-24 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <Reveal>
          <SectionHeading>
            How CDP does
            <Break />
            things differently
          </SectionHeading>
        </Reveal>

        <div className="mt-12 space-y-12 sm:mt-16">
          {comparisons.map((item, index) => {
            const Media = mediaByKind[item.media];
            const isLast = index === comparisons.length - 1;
            return (
              <Reveal key={item.index} delay={0.05} replay>
                <div className="relative sm:pl-20">
                  {!isLast && (
                    <span className="absolute bottom-[-3rem] left-[21px] top-16 hidden w-px bg-white/10 sm:block" />
                  )}
                  <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f8dc03] text-[13px] font-extrabold text-[#0e0e0e] sm:absolute sm:left-0 sm:top-0 sm:mb-0">
                    {item.index}
                  </span>

                  <article className="rounded-3xl shadow-[0_40px_80px_-56px_rgba(0,0,0,1)]">
                    <div className="grid gap-6 rounded-t-3xl bg-white p-5 sm:p-7 md:grid-cols-[1.02fr_0.98fr] md:items-center">
                      <div>
                        <span className="text-[19px] font-extrabold tracking-[-0.06em] text-[#0e0e0e]">
                          CDP
                        </span>
                        <h3 className="mt-4 max-w-[16ch] text-[22px] font-extrabold leading-[1.08] tracking-[-0.035em] text-[#0e0e0e] sm:text-[27px]">
                          {item.title}
                        </h3>
                        <p className="mt-3 max-w-[42ch] text-[14px] leading-6 text-[#5a5f58]">
                          {item.description}
                        </p>
                      </div>
                      <Media />
                    </div>

                    <div className="relative rounded-b-3xl bg-[#161616] px-5 pb-5 pt-6 sm:px-7">
                      <span className="absolute -top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#0e0e0e] text-[11px] font-extrabold text-white">
                        VS
                      </span>
                      <p className="text-[14px] font-bold text-white">
                        The usual way
                      </p>
                      <p className="mt-1 text-[14px] leading-6 text-white/45">
                        {item.usual}
                      </p>
                    </div>
                  </article>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
    How CDP can help you
--------------------------------------------------------- */
function HelpPanel({
  chip,
  chipTone,
  title,
  highlight,
  highlightTone,
  bullets,
  action,
  children,
  first = false,
}: {
  chip: string;
  chipTone: "gold" | "aqua";
  title: React.ReactNode;
  highlight: string;
  highlightTone: "gold" | "aqua";
  bullets: string[];
  action: React.ReactNode;
  children: React.ReactNode;
  first?: boolean;
}) {
  const square = chipTone === "gold" ? "bg-[#f8dc03]" : "bg-[#1ed2f4]";
  const marker =
    highlightTone === "gold"
      ? "bg-[#f8dc03] text-[#0e0e0e]"
      : "bg-[#1ed2f4] text-[#0e0e0e]";

  return (
    <div
      className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${
        first ? "" : "mt-10 border-t border-black/10 pt-10 sm:mt-12 sm:pt-12"
      }`}
    >
      <div>
        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#5a5f58]">
          <span className={`h-2.5 w-2.5 ${square}`} />
          {chip}
        </span>
        <h3 className="mt-4 max-w-[16ch] text-[clamp(26px,3.4vw,38px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#0e0e0e]">
          {title}
        </h3>
        <p className="mt-5">
          <span className={`box-decoration-clone px-1.5 py-0.5 text-[17px] font-extrabold tracking-[-0.02em] ${marker}`}>
            {highlight}
          </span>
        </p>
        <ul className="mt-5 space-y-2.5">
          {bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2.5 text-[15px] leading-6 text-[#5a5f58]"
            >
              <span className="mt-2.5 h-px w-3 shrink-0 bg-[#5a5f58]" />
              {bullet}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          {action}
        </div>
      </div>
      <div className="mx-auto w-full max-w-[420px]">{children}</div>
    </div>
  );
}

function HowHelp() {
  return (
    <section id="help" className="scroll-mt-24 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <Reveal>
          <SectionHeading>
            How CDP
            <Break />
            can help you
          </SectionHeading>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-[32px] bg-white p-6 shadow-[0_50px_100px_-60px_rgba(0,0,0,1)] sm:p-10">
            <HelpPanel
              first
              chip="Simulations and games"
              chipTone="gold"
              title={
                <>
                  Do the work
                  <br />
                  before you
                  <br />
                  choose it
                </>
              }
              highlight="Simulations built on real finance tasks"
              highlightTone="gold"
              bullets={[
                "Games that test how you take decisions",
                "A short quiz after every module",
              ]}
              action={<GoldButton href={AUTH.signup}>Sign up</GoldButton>}
            >
              <PortfolioMock />
            </HelpPanel>

            <HelpPanel
              chip="What you take home"
              chipTone="aqua"
              title={
                <>
                  Leave knowing
                  <br />
                  which career
                  <br />
                  fits you
                </>
              }
              highlight="A personal career-fit report"
              highlightTone="aqua"
              bullets={[
                "The Career Discovery Handbook",
                "A certificate and digital badges",
              ]}
              action={
                <>
                  <GoldButton href={AUTH.signup}>Sign up</GoldButton>
                  <TextLink href={AUTH.login} tone="dark">
                    Log in
                  </TextLink>
                </>
              }
            >
              <HandbookMock />
            </HelpPanel>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
    Meet the experts
--------------------------------------------------------- */
function Experts() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const tones: Record<string, string> = {
    gold: "bg-[#f8dc03] text-[#0e0e0e]",
    aqua: "bg-[#1ed2f4] text-[#0e0e0e]",
    paper: "bg-white text-[#0e0e0e]",
  };

  return (
    <section id="experts" className="scroll-mt-24 py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
        <Reveal>
          <SectionHeading>
            Meet the experts
            <Break />
            you learn from
          </SectionHeading>
        </Reveal>

        <div className="mt-10 space-y-3 sm:mt-12">
          {experts.map((expert, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={expert.name + index} delay={index * 0.06}>
                <div
                  className={`overflow-hidden rounded-2xl border bg-[#151515] transition-colors duration-300 ${
                    isOpen ? "border-white/25" : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold ${
                        tones[expert.tone]
                      }`}
                    >
                      {expert.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-bold text-white sm:text-[16px]">
                        {expert.name}
                      </span>
                      <span className="block truncate text-[13px] text-white/50">
                        {expert.role}
                      </span>
                    </span>
                    <PlusToggle open={isOpen} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="bio"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 pl-[60px] text-[14px] leading-6 text-white/55 sm:px-5 sm:pl-[68px]">
                          {expert.bio}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-6 flex items-center justify-between">
            <span className="flex -space-x-2.5">
              <span className="h-8 w-8 rounded-full border-2 border-[#0e0e0e] bg-[#f8dc03]" />
              <span className="h-8 w-8 rounded-full border-2 border-[#0e0e0e] bg-[#1ed2f4]" />
              <span className="h-8 w-8 rounded-full border-2 border-[#0e0e0e] bg-white" />
            </span>
            <a
              href="#experts"
              className="group inline-flex items-center gap-2 text-[13px] font-bold text-white/70 transition-colors hover:text-white"
            >
              See all experts
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
    Five careers you get to try
--------------------------------------------------------- */
function FiveCareers() {
  const tones: Record<string, string> = {
    gold: "bg-[#f8dc03]",
    aqua: "bg-[#1ed2f4]",
    paper: "bg-[#f4f4f1]",
  };

  return (
    <section id="tracks" className="scroll-mt-24 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <h2 className="text-[clamp(30px,4.4vw,50px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-white">
              Five careers
              <Break />
              you get to try
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="flex flex-col gap-3 lg:items-end">
              {[
                "Watch how the job works",
                "Meet someone who does it",
                "Do the work in a simulation",
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-center gap-3 text-[15px] font-semibold text-white/75 sm:text-[16px]"
                >
                  <span className="h-3 w-3 rounded-full border-2 border-white/45" />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {careers.map((career, index) => {
            const Icon = career.icon;
            return (
              <Reveal key={career.title} delay={index * 0.07} className="h-full">
                <article className="group h-full overflow-hidden rounded-2xl bg-white transition-transform duration-300 hover:-translate-y-1.5">
                  <div
                    className={`relative flex h-32 items-end p-4 ${tones[career.tone]}`}
                  >
                    <Icon className="absolute right-4 top-4 h-7 w-7 text-[#0e0e0e]/70" />
                    <h3 className="max-w-[9ch] text-[19px] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#0e0e0e]">
                      {career.title}
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a5f58]">
                      What you will try
                    </p>
                    <ul className="mt-3 space-y-2">
                      {career.tries.map((tryItem) => (
                        <li
                          key={tryItem}
                          className="flex items-start gap-2 text-[13px] leading-5 text-[#3f443e]"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#0e0e0e]/50" />
                          {tryItem}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
    Start learning before you join
--------------------------------------------------------- */
function StartLearning() {
  const tones: Record<string, string> = {
    gold: "bg-[#f8dc03]",
    aqua: "bg-[#1ed2f4]",
    paper: "bg-white",
  };

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Reveal>
          <SectionHeading>
            Start learning
            <Break />
            before you join
          </SectionHeading>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {articles.map((article, index) => (
            <Reveal key={article.title} delay={index * 0.08} className="h-full">
              <article
                className={`group flex h-full min-h-[260px] flex-col justify-between rounded-3xl p-5 transition-transform duration-300 hover:-translate-y-1.5 sm:p-6 ${
                  tones[article.tone]
                } ${article.tone === "paper" ? "border border-black/10" : ""}`}
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0e0e0e]/70">
                  {article.meta}
                </span>
                <h3 className="mt-6 max-w-[18ch] text-[20px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#0e0e0e] sm:text-[22px]">
                  {article.title}
                </h3>
                <div className="mt-8 flex items-end justify-between">
                  <ArticleDoodle kind={article.doodle} />
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0e0e0e] text-[#f8dc03] transition-transform duration-300 group-hover:rotate-45">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
    Come and talk to us first
--------------------------------------------------------- */
function ContactCta() {
  return (
    <section id="contact" className="scroll-mt-24 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Reveal>
          <div className="grid items-center gap-10 rounded-[32px] border border-white/10 bg-[#141414] p-6 sm:p-10 lg:grid-cols-2">
            <div>
              <h2 className="max-w-[16ch] text-[clamp(30px,4.2vw,46px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-white">
                Come and
                <br />
                talk to us first
              </h2>
              <p className="mt-5 max-w-[42ch] text-[15px] leading-7 text-white/55">
                Meet the team in Pune, or ask your questions on a call.
              </p>
              <GoldButton href={AUTH.signup} className="mt-7">
                Get in touch
              </GoldButton>
            </div>
            <IndiaDots />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
    Footer
--------------------------------------------------------- */
function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const toneSquares: Record<string, string> = {
    gold: "bg-[#f8dc03]",
    aqua: "bg-[#1ed2f4]",
    paper: "bg-white",
  };

  return (
    <footer className="border-t border-white/10 bg-[#0e0e0e] pb-8 pt-14 sm:pt-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <span className="text-[30px] font-extrabold leading-none tracking-[-0.06em] text-white">
              CDP
            </span>
            <h3 className="mt-5 max-w-[13ch] text-[26px] font-extrabold leading-[1.1] tracking-[-0.035em] text-white sm:text-[30px]">
              You are choosing a career. Try it first.
            </h3>
            <p className="mt-4 text-[14px] leading-6 text-white/50">
              One short note a week on careers in finance.
            </p>
            <form
              className="mt-4 flex max-w-[380px] items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (email.trim()) setSubscribed(true);
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-[14px] text-white placeholder:text-white/35 focus:border-[#f8dc03] focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-[#f8dc03] px-5 py-2.5 text-[14px] font-extrabold text-[#0e0e0e] transition hover:bg-[#ffe95a]"
              >
                Subscribe
              </button>
            </form>
            <p
              className={`mt-2 text-[12px] text-[#f8dc03] transition-opacity duration-300 ${
                subscribed ? "opacity-100" : "opacity-0"
              }`}
            >
              Thanks — you&apos;re on the list.
            </p>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} className="lg:pt-2">
              <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/45">
                {column.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[14px] text-white/70 transition-colors hover:text-[#f8dc03]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 grid gap-4 rounded-3xl border border-white/10 bg-[#151515] p-5 sm:grid-cols-3 sm:p-6">
          {trustItems.map((item) => (
            <div key={item.title} className="flex gap-3.5">
              <span
                className={`mt-1 h-7 w-7 shrink-0 rounded-md ${toneSquares[item.tone]}`}
              />
              <span>
                <span className="block text-[14px] font-bold text-white">
                  {item.title}
                </span>
                <span className="mt-1 block text-[12px] leading-5 text-white/45">
                  {item.body}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-white/40">
            © 2026 FinTree Education, Pune. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={AUTH.login}
              className="text-[12px] font-bold text-white/60 transition-colors hover:text-white"
            >
              Log in
            </Link>
            <Link
              href={AUTH.signup}
              className="text-[12px] font-bold text-[#f8dc03] transition-colors hover:text-white"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------
    Page
--------------------------------------------------------- */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white selection:bg-[#f8dc03] selection:text-[#0e0e0e]">
      <Header />
      <Hero />
      <LearnerRail />
      <FounderStatement />
      <SkylineSection />
      <HowDifferent />
      <HowHelp />
      <Experts />
      <FiveCareers />
      <StartLearning />
      <ContactCta />
      <Footer />
    </main>
  );
}

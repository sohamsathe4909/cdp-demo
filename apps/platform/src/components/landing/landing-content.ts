import { Boxes, LayoutGrid, LineChart, PieChart, Sparkles } from "lucide-react";

/* ---------------------------------------------------------
    Navigation — section anchors on the (public) landing page.
--------------------------------------------------------- */
export const navItems = [
  { label: "Tracks", href: "#tracks" },
  { label: "How it works", href: "#how" },
  { label: "Experts", href: "#experts" },
  { label: "Fees", href: "#contact" },
];

/* ---------------------------------------------------------
    Auth CTAs — every "30-day plan" action in the mockups is
    replaced by the real sign-up / log-in flow.
--------------------------------------------------------- */
export const AUTH = {
  login: "/login?redirectTo=/dashboard",
  signup: "/signup",
};

/* ---------------------------------------------------------
    "Hear from our learners" — video quote cards
--------------------------------------------------------- */
export type LearnerStory = {
  quote: string;
  name: string;
  meta: string;
  tone: "sage" | "sky" | "gold" | "mint";
  start: string;
  end: string;
};

export const learnerStories: LearnerStory[] = [
  {
    quote: "“A one-line quote from a learner video goes here.”",
    name: "Learner name",
    meta: "Course and college",
    tone: "sage",
    start: "0:22",
    end: "0:58",
  },
  {
    quote: "“A one-line quote from a learner video goes here.”",
    name: "Learner name",
    meta: "Course and college",
    tone: "sky",
    start: "0:00",
    end: "1:04",
  },
  {
    quote: "“A one-line quote from a learner video goes here.”",
    name: "Learner name",
    meta: "Course and college",
    tone: "gold",
    start: "0:11",
    end: "0:47",
  },
  {
    quote: "“A one-line quote from a learner video goes here.”",
    name: "Learner name",
    meta: "Course and college",
    tone: "mint",
    start: "0:31",
    end: "1:12",
  },
];

/* ---------------------------------------------------------
    "How CDP does things differently"
--------------------------------------------------------- */
export type Comparison = {
  index: string;
  title: string;
  description: string;
  usual: string;
  media: "video" | "live" | "simulation" | "report";
};

export const comparisons: Comparison[] = [
  {
    index: "01",
    title: "You learn each career from people who do it",
    description:
      "Short video modules by industry experts, with a quick quiz after each one.",
    usual: "You read a few articles and watch random videos",
    media: "video",
  },
  {
    index: "02",
    title: "You ask the experts your own questions",
    description:
      "Expinars are live sessions with working professionals, held at set times.",
    usual: "You get second-hand advice from seniors and relatives",
    media: "live",
  },
  {
    index: "03",
    title: "You do the work in a simulation",
    description:
      "You take real decisions, the way an analyst or banker does on the job.",
    usual: "You first see the real work after you take the job",
    media: "simulation",
  },
  {
    index: "04",
    title: "You get a report on which career fits you",
    description:
      "Built from your psychometric assessment and how you did in each track.",
    usual: "You pick the career your friends picked, and hope it fits",
    media: "report",
  },
];

/* ---------------------------------------------------------
    "Five careers you get to try"
--------------------------------------------------------- */
export type Career = {
  title: string;
  icon: typeof LineChart;
  tone: "gold" | "aqua" | "paper";
  tries: string[];
};

export const careers: Career[] = [
  {
    title: "Equity Research",
    icon: LineChart,
    tone: "gold",
    tries: [
      "Read a company’s numbers",
      "Build a simple valuation",
      "Make a buy, hold or sell call",
    ],
  },
  {
    title: "Investment Banking",
    icon: LayoutGrid,
    tone: "aqua",
    tries: [
      "Study how a deal is done",
      "Help build a pitch",
      "See how a company raises money",
    ],
  },
  {
    title: "PE and VC",
    icon: Boxes,
    tone: "paper",
    tries: [
      "Screen a set of startups",
      "Judge a founder’s pitch",
      "Decide where to invest",
    ],
  },
  {
    title: "Private Wealth",
    icon: PieChart,
    tone: "gold",
    tries: [
      "Understand a client’s goals",
      "Build a portfolio for them",
      "Explain your plan in plain words",
    ],
  },
  {
    title: "Future of Finance",
    icon: Sparkles,
    tone: "paper",
    tries: [
      "Explore fintech and AI",
      "Try new-age finance models",
      "See where finance is heading",
    ],
  },
];

/* ---------------------------------------------------------
    "Meet the experts you learn from"
--------------------------------------------------------- */
export type Expert = {
  name: string;
  role: string;
  bio: string;
  initials: string;
  tone: "gold" | "aqua" | "paper";
};

export const experts: Expert[] = [
  {
    name: "Utkarsh Jain",
    role: "Founder, FinTree Education",
    bio: "Built CDP so students can try the work before they commit to a career.",
    initials: "UJ",
    tone: "paper",
  },
  {
    name: "Expert name",
    role: "Equity Research, role and firm",
    bio: "Teaches the equity research track and reviews learner valuation calls.",
    initials: "EN",
    tone: "gold",
  },
  {
    name: "Expert name",
    role: "Investment Banking, role and firm",
    bio: "Runs the investment banking expinars and the deal simulations.",
    initials: "EN",
    tone: "aqua",
  },
];

/* ---------------------------------------------------------
    "Start learning before you join"
--------------------------------------------------------- */
export type Article = {
  meta: string;
  title: string;
  tone: "gold" | "aqua" | "paper";
  doodle: "bars" | "arc" | "checks";
};

export const articles: Article[] = [
  {
    meta: "8 min read",
    title: "What does an equity research analyst do all day?",
    tone: "gold",
    doodle: "bars",
  },
  {
    meta: "Video, 8 min",
    title: "Investment banking and private equity: how the work differs",
    tone: "aqua",
    doodle: "arc",
  },
  {
    meta: "4 min read",
    title: "Five questions to ask before you pick a finance career",
    tone: "paper",
    doodle: "checks",
  },
];

/* ---------------------------------------------------------
    Footer
--------------------------------------------------------- */
export const footerColumns = [
  {
    title: "Program",
    links: [
      { label: "Tracks", href: "#tracks" },
      { label: "How it works", href: "#how" },
      { label: "Experts", href: "#experts" },
      { label: "Fees", href: "#contact" },
      { label: "FAQs", href: "#contact" },
    ],
  },
  {
    title: "FinTree",
    links: [
      { label: "About FinTree", href: "#founder" },
      { label: "CFA", href: "#contact" },
      { label: "FRM", href: "#contact" },
      { label: "Financial Modelling", href: "#contact" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Refunds and cancellation", href: "#" },
    ],
  },
];

export const trustItems = [
  {
    tone: "gold" as const,
    title: "A FinTree Education program",
    body: "An educator to the financial markets",
  },
  {
    tone: "aqua" as const,
    title: "80,000+ learners since 2011",
    body: "Across CFA, FRM, NISM and Financial Modelling",
  },
  {
    tone: "paper" as const,
    title: "Help: +91 8888077722",
    body: "Call or message the FinTree team",
  },
];

/* Career labels on the skyline illustration (x = building centre) */
export const skylineLabels = [
  { label: "Investment Banking", x: 105 },
  { label: "Private Wealth", x: 288 },
  { label: "Equity Research", x: 600, active: true },
  { label: "PE and VC", x: 872 },
  { label: "Future of Finance", x: 1072 },
];

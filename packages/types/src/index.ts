export type UserRole = 'student' | 'mentor' | 'admin' | 'content_admin' | 'super_admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  xp: number;
  level: number;
  activeTrackId?: string;
  joinedAt: string;
}

export interface CareerTrack {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  tags: string[];
  totalSimulations: number;
  enrolledCount: number;
  badge: string;
}

export interface SimulationInfo {
  id: string;
  slug: string;
  title: string;
  trackId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMins: number;
  xpReward: number;
  description: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  score?: number;
}

export interface ExpinarEvent {
  id: string;
  title: string;
  speaker: string;
  speakerRole: string;
  scheduledTime: string;
  attendeeCount: number;
  status: 'live' | 'upcoming';
  category: string;
}

/* ---------------- Dashboard (30-day learning space) ---------------- */

export type ProgramDayState = 'done' | 'today' | 'upcoming';

export interface ProgramDay {
  day: number;
  state: ProgramDayState;
  isExpinarDay: boolean;
}

export interface ProgramPlan {
  totalDays: number;
  currentDay: number;
  days: ProgramDay[];
}

export interface CurrentModule {
  trackId: string;
  trackTitle: string;
  moduleIndex: number;
  totalModules: number;
  title: string;
  durationLabel: string;
  durationSeconds: number;
  watchedSeconds: number;
  quizAfterVideo: boolean;
  videoUrl: string | null;
  notes: string[];
}

export type JourneyStepState = 'active' | 'done' | 'upcoming';

export interface JourneyStep {
  key: 'watch' | 'check' | 'expinar' | 'simulation';
  label: string;
  meta: string;
  state: JourneyStepState;
}

export interface LiveExpinar {
  id: string;
  title: string;
  detail: string;
  startsAt: string;
  dateLabel: string;
  timeLabel: string;
  joinNote: string;
}

export type TrackStatus = 'in_progress' | 'started' | 'available' | 'locked';

export interface TrackProgress {
  id: string;
  title: string;
  completedModules: number;
  totalModules: number;
  status: TrackStatus;
  statusLabel: string;
  unlockDay: number | null;
}

export interface BadgeInfo {
  id: string;
  name: string;
  earned: boolean;
}

export interface CareerFitReport {
  opensDay: number;
  progressPercent: number;
  blurb: string;
}

/** One calendar day of learning activity (streak dots + charts). */
export interface ActivityDay {
  date: string; // "2026-09-23"
  label: string; // "Wed 23 Sep"
  weekday: string; // "Wed"
  minutes: number;
  learned: boolean;
  isToday: boolean;
}

/** Udemy-style learning streak. */
export interface StreakInfo {
  current: number;
  longest: number;
  learnedToday: boolean;
  minutesToday: number;
  days: ActivityDay[]; // last 30 days, oldest → newest
}

export interface ActivityBarPoint {
  label: string; // "Wed 23"
  minutes: number;
}

export interface ActivityLinePoint {
  day: number; // program day 1..currentDay
  percent: number; // cumulative modules completed %
}

/** Chart payloads for the dashboard activity card. */
export interface ActivityCharts {
  bar: ActivityBarPoint[]; // last 7 days, minutes learned
  line: ActivityLinePoint[]; // program progress across the 30 days
}

export interface DashboardSummary {
  firstName: string;
  greeting: string;
  headlineNote: string;
  program: ProgramPlan;
  currentModule: CurrentModule;
  steps: JourneyStep[];
  liveExpinar: LiveExpinar;
  tracks: TrackProgress[];
  streak: StreakInfo;
  activity: ActivityCharts;
  badges: {
    earned: number;
    total: number;
    items: BadgeInfo[];
  };
  careerFit: CareerFitReport;
}

export type SearchResultType = 'lesson' | 'track' | 'career' | 'expinar';

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: SearchResultType;
  href: string;
}

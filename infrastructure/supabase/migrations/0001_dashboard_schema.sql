-- ============================================================
-- CDP learning-space dashboard — schema
-- Run against your Supabase project (SQL editor or supabase db push).
-- The app falls back to demo data when these tables are missing.
-- ============================================================

-- 30-day program progress (day 12 of 30, Expinar day markers)
create table if not exists public.program_progress (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  current_day   int not null default 1 check (current_day >= 1),
  total_days    int not null default 30 check (total_days >= 1),
  expinar_days  int[] not null default '{}'::int[],
  started_at    date not null default current_date,
  updated_at    timestamptz not null default now()
);

-- Learning tracks (Equity Research, Investment Banking, ...)
create table if not exists public.tracks (
  id            text primary key,
  title         text not null,
  total_modules int not null default 0,
  unlock_day    int,
  sort_order    int not null default 0
);

-- Lessons inside a track
create table if not exists public.modules (
  track_id         text not null references public.tracks (id) on delete cascade,
  module_index     int not null check (module_index >= 1),
  title            text not null,
  duration_seconds int not null default 0,
  video_url        text,
  notes            jsonb not null default '[]'::jsonb,
  primary key (track_id, module_index)
);

-- Per-user track status ("In progress" / "Started" / "Opens day N")
create table if not exists public.track_progress (
  user_id           uuid not null references auth.users (id) on delete cascade,
  track_id          text not null references public.tracks (id) on delete cascade,
  status            text not null default 'locked'
                      check (status in ('locked', 'started', 'in_progress')),
  completed_modules int not null default 0,
  updated_at        timestamptz not null default now(),
  primary key (user_id, track_id)
);

-- Video watch progress for "Resume video"
create table if not exists public.module_progress (
  user_id         uuid not null references auth.users (id) on delete cascade,
  track_id        text not null,
  module_index    int not null,
  watched_seconds int not null default 0 check (watched_seconds >= 0),
  completed       boolean not null default false,
  updated_at      timestamptz not null default now(),
  primary key (user_id, track_id, module_index),
  foreign key (track_id, module_index)
    references public.modules (track_id, module_index) on delete cascade
);

-- Quiz attempts ("2 quizzes done")
create table if not exists public.quiz_attempts (
  id         bigserial primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  quiz_id    text not null,
  passed     boolean not null default false,
  created_at timestamptz not null default now()
);

-- Live / upcoming Expinars (card + .ics export)
create table if not exists public.expinar_events (
  id          text primary key,
  title       text not null,
  detail      text not null default '',
  join_note   text not null default '',
  speaker     text,
  speaker_role text,
  starts_at   timestamptz not null
);

-- Badge catalog + earnings (2 of 12)
create table if not exists public.badges (
  id         text primary key,
  name       text not null,
  sort_order int not null default 0
);

create table if not exists public.user_badges (
  user_id   uuid not null references auth.users (id) on delete cascade,
  badge_id  text not null references public.badges (id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- Career-fit report (Day 30)
create table if not exists public.career_fit_report (
  user_id         uuid primary key references auth.users (id) on delete cascade,
  opens_day       int not null default 30,
  progress_percent int not null default 0
                    check (progress_percent between 0 and 100),
  blurb           text not null default '',
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.program_progress enable row level security;
alter table public.tracks enable row level security;
alter table public.modules enable row level security;
alter table public.track_progress enable row level security;
alter table public.module_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.expinar_events enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.career_fit_report enable row level security;

-- Catalog tables: readable by any signed-in learner
drop policy if exists "catalog_select" on public.tracks;
create policy "catalog_select" on public.tracks
  for select to authenticated using (true);

drop policy if exists "catalog_select" on public.modules;
create policy "catalog_select" on public.modules
  for select to authenticated using (true);

drop policy if exists "catalog_select" on public.badges;
create policy "catalog_select" on public.badges
  for select to authenticated using (true);

drop policy if exists "catalog_select" on public.expinar_events;
create policy "catalog_select" on public.expinar_events
  for select to authenticated using (true);

-- Per-user tables: owners only
drop policy if exists "own_rows" on public.program_progress;
create policy "own_rows" on public.program_progress
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own_rows" on public.track_progress;
create policy "own_rows" on public.track_progress
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own_rows" on public.module_progress;
create policy "own_rows" on public.module_progress
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own_rows" on public.quiz_attempts;
create policy "own_rows" on public.quiz_attempts
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own_rows" on public.user_badges;
create policy "own_rows" on public.user_badges
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own_rows" on public.career_fit_report;
create policy "own_rows" on public.career_fit_report
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

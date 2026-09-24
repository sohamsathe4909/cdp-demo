-- ============================================================
-- CDP learning-space dashboard — demo seed
-- Mirrors the dashboard design: day 12 of 30, Equity Research
-- module 3 of 8, 2 of 12 badges, live Expinar this Thursday.
-- Idempotent — safe to run more than once.
-- ============================================================

-- ---------- Tracks ----------
insert into public.tracks (id, title, total_modules, unlock_day, sort_order) values
  ('track-equity', 'Equity Research',      8, null, 1),
  ('track-ib',     'Investment Banking',   7, null, 2),
  ('track-pe',     'Private Equity and VC', 6, 15,  3),
  ('track-pw',     'Private Wealth',       6, 19,  4),
  ('track-fof',    'Future of Finance',    6, 23,  5)
on conflict (id) do nothing;

-- ---------- Lessons (modules) ----------
insert into public.modules (track_id, module_index, title, duration_seconds, video_url) values
  -- Equity Research (the active track in the demo dashboard)
  ('track-equity', 1, 'Reading a balance sheet end to end',              840,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-equity', 2, 'Income statements and cash flow links',           960,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-equity', 3, 'How analysts build an earnings model',           1330,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-equity', 4, 'Comparable company analysis in practice',        1120,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-equity', 5, 'Building a DCF from scratch',                    1440,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-equity', 6, 'Valuing growth without fooling yourself',         1020,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-equity', 7, 'Writing a buy recommendation',                    900,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-equity', 8, 'Presenting your thesis to a portfolio manager',   780,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  -- Investment Banking
  ('track-ib', 1, 'What an analyst actually does all day',               720,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-ib', 2, 'M&A accretion and dilution',                         1180,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-ib', 3, 'Valuation multiples that actually matter',            980,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-ib', 4, 'Building a comps and precedents table',              1260,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-ib', 5, 'The LBO at a glance',                                1140,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-ib', 6, 'Parsing a debt tranche',                              900,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-ib', 7, 'Building the pitch deck',                             840,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  -- Private Equity and VC
  ('track-pe', 1, 'How VCs read a pitch deck',                           760,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-pe', 2, 'Cap tables and dilution',                            1080,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-pe', 3, 'Term sheet essentials',                               940,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-pe', 4, 'SaaS unit economics',                                1160,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-pe', 5, 'Waterfall returns explained',                        1020,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-pe', 6, 'Running due diligence',                               880,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  -- Private Wealth
  ('track-pw', 1, 'Understanding a client''s goals',                     700,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-pw', 2, 'Asset allocation frameworks',                         980,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-pw', 3, 'Fixed income fundamentals',                          1060,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-pw', 4, 'Risk and drawdowns',                                  920,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-pw', 5, 'Tax-aware investing',                                 860,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-pw', 6, 'Running a client review',                             740,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  -- Future of Finance
  ('track-fof', 1, 'Fintech beyond the hype',                            720,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-fof', 2, 'AI in investment research',                          960,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-fof', 3, 'Digital assets and tokenisation',                   1040,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-fof', 4, 'Open banking and embedded finance',                  880,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-fof', 5, 'The future of payments',                             800,  'https://mdn.github.io/shared-assets/videos/flower.mp4'),
  ('track-fof', 6, 'Building a career in an AI-first world',             760,  'https://mdn.github.io/shared-assets/videos/flower.mp4')
on conflict (track_id, module_index) do nothing;

-- Generic notes everywhere, then module-3 specifics for the active lesson
update public.modules
set notes = '["Key takeaways", "Worked example", "Practice quiz"]'::jsonb
where notes = '[]'::jsonb;

update public.modules
set notes = '[
  "How analysts structure an earnings model from the ground up",
  "Revenue drivers vs. one-off items — what to strip out",
  "Building the consensus bridge and flagging surprises",
  "What to write when your numbers disagree with the street"
]'::jsonb
where track_id = 'track-equity' and module_index = 3;

-- ---------- Badges (2 of 12 earned by default) ----------
insert into public.badges (id, name, sort_order) values
  ('badge-first-step',     'First step',        1),
  ('badge-quiz-ace',       'Quiz ace',          2),
  ('badge-week-one',       'Week one',          3),
  ('badge-model-builder',  'Model builder',     4),
  ('badge-case-cracker',   'Case cracker',      5),
  ('badge-live-attendee',  'Live attendee',     6),
  ('badge-track-starter',  'Track starter',     7),
  ('badge-sim-survivor',   'Sim survivor',      8),
  ('badge-perfect-score',  'Perfect score',     9),
  ('badge-streak-seven',   '7-day streak',     10),
  ('badge-deep-diver',     'Deep diver',       11),
  ('badge-career-fit',     'Career-fit ready', 12)
on conflict (id) do nothing;

-- ---------- Live Expinar (next Thursday, 7:00 pm local) ----------
do $$
declare
  next_thursday timestamptz;
begin
  next_thursday := date_trunc('day', now())
    + make_interval(days => ((4 - extract(dow from now())::int + 7) % 7))
    + interval '19 hours';

  if next_thursday <= now() then
    next_thursday := next_thursday + interval '7 days';
  end if;

  insert into public.expinar_events
    (id, title, detail, join_note, speaker, speaker_role, starts_at)
  values (
    'exp-demo-1',
    'A day on an equity research desk',
    'Senior Analyst, equity research. Bring your questions from modules 1 to 3.',
    'The join link opens 10 minutes before the start.',
    'Senior Analyst',
    'Equity Research',
    next_thursday
  )
  on conflict (id) do nothing;
end $$;

-- ---------- Per-user demo state ----------
create or replace function public.provision_demo_dashboard(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Day 12 of 30 with the Expinar day markers from the design
  insert into public.program_progress (user_id, current_day, total_days, expinar_days)
  values (p_user_id, 12, 30, array[5, 9, 14, 20, 26])
  on conflict (user_id) do nothing;

  insert into public.track_progress (user_id, track_id, status, completed_modules) values
    (p_user_id, 'track-equity', 'in_progress', 3),
    (p_user_id, 'track-ib',     'started',     1),
    (p_user_id, 'track-pe',     'locked',      0),
    (p_user_id, 'track-pw',     'locked',      0),
    (p_user_id, 'track-fof',    'locked',      0)
  on conflict (user_id, track_id) do nothing;

  -- Modules 1-2 done, module 3 part-watched (9 of 22 min)
  insert into public.module_progress (user_id, track_id, module_index, watched_seconds, completed)
  select
    p_user_id,
    'track-equity',
    m.module_index,
    case when m.module_index = 3 then 540 else m.duration_seconds end,
    m.module_index <= 2
  from public.modules m
  where m.track_id = 'track-equity' and m.module_index <= 3
  on conflict (user_id, track_id, module_index) do nothing;

  -- 2 quizzes done
  insert into public.quiz_attempts (user_id, quiz_id, passed)
  select p_user_id, q.quiz_id, true
  from (values ('quiz-er-1'), ('quiz-er-2')) as q(quiz_id)
  where not exists (
    select 1 from public.quiz_attempts qa
    where qa.user_id = p_user_id and qa.quiz_id = q.quiz_id
  );

  -- 2 of 12 badges
  insert into public.user_badges (user_id, badge_id)
  select p_user_id, b.id
  from public.badges b
  where b.id in ('badge-first-step', 'badge-quiz-ace')
  on conflict (user_id, badge_id) do nothing;

  -- Career-fit report unlocks on day 30
  insert into public.career_fit_report (user_id, opens_day, progress_percent, blurb)
  values (
    p_user_id,
    30,
    15,
    'Builds from your quizzes, simulations and assessment. It opens once all five tracks are done.'
  )
  on conflict (user_id) do nothing;
end $$;

-- Backfill every existing user
select public.provision_demo_dashboard(id) from auth.users;

-- Provision every new user automatically
create or replace function public.provision_demo_dashboard_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.provision_demo_dashboard(new.id);
  return new;
end $$;

drop trigger if exists provision_demo_dashboard on auth.users;
create trigger provision_demo_dashboard
  after insert on auth.users
  for each row
  execute function public.provision_demo_dashboard_trigger();

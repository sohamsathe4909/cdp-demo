-- ============================================================
-- CDP learning-space dashboard — learning activity
-- Per-day minutes learned + modules completed. Powers the
-- Udemy-style streak card and the bar/line activity charts.
-- Idempotent — safe to run more than once.
-- ============================================================

-- One row per user per calendar day
create table if not exists public.learning_activity (
  user_id           uuid not null references auth.users (id) on delete cascade,
  activity_date     date not null default current_date,
  learned_seconds   int  not null default 0 check (learned_seconds >= 0),
  modules_completed int  not null default 0 check (modules_completed >= 0),
  updated_at        timestamptz not null default now(),
  primary key (user_id, activity_date)
);

create index if not exists learning_activity_user_date_idx
  on public.learning_activity (user_id, activity_date desc);

alter table public.learning_activity enable row level security;

drop policy if exists "own_rows" on public.learning_activity;
create policy "own_rows" on public.learning_activity
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Atomic per-day increment, called by POST /api/progress.
-- Increments learned_seconds and (on completion transitions) modules_completed.
create or replace function public.record_learning_activity(
  p_activity_date date,
  p_learned_seconds int,
  p_module_completed boolean
) returns void
language sql
security definer
set search_path = public
as $$
  insert into public.learning_activity as la
    (user_id, activity_date, learned_seconds, modules_completed)
  values (
    auth.uid(),
    p_activity_date,
    greatest(coalesce(p_learned_seconds, 0), 0),
    case when coalesce(p_module_completed, false) then 1 else 0 end
  )
  on conflict (user_id, activity_date) do update
    set learned_seconds   = la.learned_seconds + greatest(coalesce(p_learned_seconds, 0), 0),
        modules_completed = la.modules_completed
                          + case when coalesce(p_module_completed, false) then 1 else 0 end,
        updated_at        = now();
$$;

-- ---------- Demo seed (mirrors dashboard-demo.ts exactly) ----------
-- 12-day window (day 12 of 30), single gap 5 days ago →
-- current streak 5, longest 6; 4 modules completed → line reaches 12%.
create or replace function public.provision_demo_activity(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  i int;
begin
  for i in 0..11 loop
    if i <> 5 then -- gap 5 days ago
      insert into public.learning_activity
        (user_id, activity_date, learned_seconds, modules_completed)
      values (
        p_user_id,
        current_date - i,
        (15 + ((i * 7) % 34)) * 60, -- deterministic 15–48 minutes
        case when i in (11, 8, 6, 2) then 1 else 0 end
      )
      on conflict (user_id, activity_date) do nothing;
    end if;
  end loop;
end $$;

-- Backfill everyone already signed up
select public.provision_demo_activity(id) from auth.users;

-- Provision activity for newly signed-up users
create or replace function public.provision_demo_activity_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.provision_demo_activity(new.id);
  return new;
end $$;

drop trigger if exists provision_demo_activity on auth.users;
create trigger provision_demo_activity
  after insert on auth.users
  for each row execute function public.provision_demo_activity_on_signup();

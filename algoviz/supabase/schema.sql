-- AlgoViz Supabase Schema
-- Supabase Dashboard → SQL Editor에서 실행하세요.

-- 1. profiles 테이블 (사용자 프로필)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null default '',
  avatar_url text,
  solved_count int not null default 0,
  streak_days int not null default 0,
  last_solved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. learning_progress 테이블 (학습 진행률)
create table public.learning_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  topic_id text not null,
  is_completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, topic_id)
);

-- 3. submissions 테이블 (문제 제출 기록)
create table public.submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  problem_id text not null,
  code text not null,
  is_correct boolean not null default false,
  passed_tests int not null default 0,
  total_tests int not null default 0,
  execution_time_ms int,
  submitted_at timestamptz not null default now()
);

-- 4. bookmarks 테이블 (북마크)
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  problem_id text not null,
  created_at timestamptz not null default now(),
  unique(user_id, problem_id)
);

-- 인덱스
create index idx_submissions_user on public.submissions(user_id);
create index idx_submissions_problem on public.submissions(problem_id);
create index idx_learning_progress_user on public.learning_progress(user_id);

-- 랭킹 뷰
create or replace view public.ranking_view as
select
  p.id,
  p.display_name,
  p.avatar_url,
  p.solved_count,
  p.streak_days,
  rank() over (order by p.solved_count desc, p.streak_days desc) as rank
from public.profiles p
where p.solved_count > 0
order by rank;

-- RLS (Row Level Security) 활성화
alter table public.profiles enable row level security;
alter table public.learning_progress enable row level security;
alter table public.submissions enable row level security;
alter table public.bookmarks enable row level security;

-- RLS 정책: profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- RLS 정책: learning_progress
create policy "Users can view own progress"
  on public.learning_progress for select using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.learning_progress for insert with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.learning_progress for update using (auth.uid() = user_id);

-- RLS 정책: submissions
create policy "Users can view own submissions"
  on public.submissions for select using (auth.uid() = user_id);

create policy "Users can insert own submissions"
  on public.submissions for insert with check (auth.uid() = user_id);

-- RLS 정책: bookmarks
create policy "Users can view own bookmarks"
  on public.bookmarks for select using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.bookmarks for insert with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete using (auth.uid() = user_id);

-- 트리거: 회원가입 시 profiles 자동 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 트리거: updated_at 자동 갱신
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

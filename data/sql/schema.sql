-- Career Empire platform schema
-- Prototype SQL draft based on the auth, dashboard, module, and employability requirements.

create extension if not exists pgcrypto;

create table if not exists schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sector text,
  region text,
  created_at timestamptz not null default now()
);

create table if not exists teachers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  email_domain text not null check (email_domain = 'cewa.edu.au' or email_domain like '%.wa.edu.au'),
  password_hash text not null,
  school_id uuid not null references schools(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references teachers(id),
  school_id uuid not null references schools(id),
  name text not null,
  year_level text,
  class_code text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  username text not null unique,
  password_hash text not null,
  school_id uuid not null references schools(id),
  class_id uuid not null references classes(id),
  created_by_teacher_id uuid not null references teachers(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists modules (
  id text primary key,
  title text not null,
  curriculum_area text not null,
  theme text,
  status text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists class_modules (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id),
  module_id text not null references modules(id),
  is_enabled boolean not null default true,
  assigned_at timestamptz not null default now(),
  unique (class_id, module_id)
);

create table if not exists student_module_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  module_id text not null references modules(id),
  completion_percent integer not null default 0,
  mastery_percent integer not null default 0,
  attempts integer not null default 0,
  unlocked boolean not null default false,
  completed boolean not null default false,
  last_played_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (student_id, module_id)
);

create table if not exists employability_skills (
  id uuid primary key default gen_random_uuid(),
  category_id text not null,
  category_title text not null,
  subskill_id text not null,
  subskill_title text not null,
  description text,
  sort_order integer not null default 0
);

create table if not exists student_skill_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  skill_id uuid not null references employability_skills(id),
  xp integer not null default 0,
  level integer not null default 1,
  evidence_count integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (student_id, skill_id)
);

create table if not exists assessment_evidence (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  class_id uuid not null references classes(id),
  module_id text not null references modules(id),
  evidence_type text not null,
  prompt text not null,
  response_text text,
  auto_score numeric,
  teacher_feedback text,
  created_at timestamptz not null default now()
);

create table if not exists student_response_reviews (
  id uuid primary key default gen_random_uuid(),
  source_evidence_id uuid references assessment_evidence(id) on delete cascade,
  student_id uuid not null references students(id),
  class_id uuid not null references classes(id),
  school_id uuid not null references schools(id),
  module_id text not null references modules(id),
  evidence_type text not null,
  task_key text not null,
  task_label text not null,
  prompt_text text not null,
  raw_response_text text not null,
  approved_response_text text,
  status text not null default 'pending_review'
    check (status in ('pending_review', 'approved', 'rejected')),
  flags text[] not null default '{}',
  flag_notes text,
  reviewer_note text,
  reviewed_by_teacher_id uuid references teachers(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_evidence_id)
);

create table if not exists player_profiles (
  student_id uuid primary key references students(id),
  career_title text,
  annual_salary integer not null default 0,
  cumulative_net_worth integer not null default 0,
  savings integer not null default 0,
  tax_paid integer not null default 0,
  career_level numeric not null default 1,
  career_success integer not null default 0,
  job_security integer not null default 0,
  work_life_balance integer not null default 0,
  wellbeing integer not null default 0,
  social_status integer not null default 0,
  resilience integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists player_assets (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  asset_code text not null,
  asset_name text not null,
  asset_category text not null,
  purchase_cost integer not null default 0,
  purchased_at timestamptz not null default now()
);

create table if not exists community_votes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  class_id uuid not null references classes(id),
  module_id text not null references modules(id),
  vote_key text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_classes_teacher_id on classes(teacher_id);
create index if not exists idx_students_class_id on students(class_id);
create index if not exists idx_students_school_id on students(school_id);
create index if not exists idx_student_module_progress_student_id on student_module_progress(student_id);
create index if not exists idx_student_module_progress_module_id on student_module_progress(module_id);
create index if not exists idx_student_skill_progress_student_id on student_skill_progress(student_id);
create index if not exists idx_assessment_evidence_student_id on assessment_evidence(student_id);
create index if not exists idx_assessment_evidence_class_id on assessment_evidence(class_id);
create index if not exists idx_student_response_reviews_status on student_response_reviews(status, created_at desc);
create index if not exists idx_student_response_reviews_class_id on student_response_reviews(class_id, status, created_at desc);
create index if not exists idx_student_response_reviews_student_id on student_response_reviews(student_id, created_at desc);
create index if not exists idx_community_votes_class_id on community_votes(class_id);

-- Explicit Supabase Data API grants for core tables.
-- RLS policies still decide which rows each role may read or write.
grant usage on schema public to anon, authenticated, service_role;

grant select
  on table public.schools, public.modules, public.employability_skills
  to anon, authenticated;

grant select, insert
  on table public.teachers
  to anon;

grant select, update
  on table public.students
  to anon;

grant select
  on table public.classes
  to anon;

grant select, insert, update
  on table
    public.student_module_progress,
    public.assessment_evidence,
    public.student_response_reviews,
    public.player_profiles,
    public.player_assets,
    public.community_votes
  to anon;

grant select, insert, update
  on table public.teachers
  to authenticated;

grant select, insert, update, delete
  on table
    public.classes,
    public.students,
    public.class_modules,
    public.student_module_progress,
    public.student_skill_progress,
    public.assessment_evidence,
    public.student_response_reviews,
    public.player_profiles,
    public.player_assets,
    public.community_votes
  to authenticated;

grant all privileges
  on all tables in schema public
  to service_role;

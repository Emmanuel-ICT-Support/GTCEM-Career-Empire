-- Student free-text review queue for Career Empire
-- Run this before deploying the moderation inbox live.

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

create index if not exists idx_student_response_reviews_status
on student_response_reviews(status, created_at desc);

create index if not exists idx_student_response_reviews_class_id
on student_response_reviews(class_id, status, created_at desc);

create index if not exists idx_student_response_reviews_student_id
on student_response_reviews(student_id, created_at desc);

grant select, insert, update
  on table public.student_response_reviews
  to anon;

grant select, insert, update, delete
  on table public.student_response_reviews
  to authenticated;

grant all privileges
  on table public.student_response_reviews
  to service_role;

alter table student_response_reviews enable row level security;

drop policy if exists "Prototype can manage student response reviews" on student_response_reviews;
create policy "Prototype can manage student response reviews"
on student_response_reviews
for all
using (true)
with check (true);

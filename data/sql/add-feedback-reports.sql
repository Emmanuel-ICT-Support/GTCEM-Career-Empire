create table if not exists feedback_reports (
  id uuid primary key default gen_random_uuid(),
  page_path text not null,
  actor_role text,
  login_name text,
  feedback_type text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_feedback_reports_created_at on feedback_reports(created_at desc);

grant select, insert
  on table public.feedback_reports
  to anon;

grant select, insert, update, delete
  on table public.feedback_reports
  to authenticated;

grant all privileges
  on table public.feedback_reports
  to service_role;

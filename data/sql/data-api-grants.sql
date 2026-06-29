-- Explicit Supabase Data API grants for Career Empire.
--
-- Supabase no longer exposes new public tables to the Data API automatically.
-- Run this after table creation migrations so supabase-js, PostgREST, and
-- GraphQL have intentional table privileges. RLS policies still decide which
-- rows each role may read or write.
--
-- This file preserves the current browser-prototype behaviour. For production
-- privacy hardening, run rls-policies-school-privacy.sql after this file.

grant usage on schema public to anon, authenticated, service_role;

-- Public lookup data used before login and by the browser prototype.
grant select
  on table
    public.schools,
    public.modules,
    public.employability_skills
  to anon, authenticated;

-- Browser-prototype account flows currently use the anon role for teacher
-- profile creation and student login. Remove these anon grants only after
-- those flows move to RPC or a backend session flow.
grant select, insert
  on table public.teachers
  to anon;

grant select, update
  on table public.students
  to anon;

grant select
  on table public.classes
  to anon;

-- Student gameplay currently writes through the anon role after the local
-- student login check. RLS must remain enabled on these tables.
grant select, insert, update
  on table
    public.student_module_progress,
    public.assessment_evidence,
    public.student_response_reviews,
    public.player_profiles,
    public.player_assets,
    public.community_votes
  to anon;

grant select, insert
  on table public.feedback_reports
  to anon;

-- Teacher workflows use Supabase Auth and therefore the authenticated role.
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
    public.community_votes,
    public.feedback_reports
  to authenticated;

-- Service-role clients are server-side only and bypass RLS, but still need
-- object privileges once automatic grants are removed.
grant all privileges
  on all tables in schema public
  to service_role;

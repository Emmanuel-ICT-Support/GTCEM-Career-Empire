-- Prototype-only Row Level Security policies for Career Empire
-- These policies are intentionally broad so the current browser prototype can function.
-- Tighten these later for production.

alter table schools enable row level security;
alter table teachers enable row level security;
alter table classes enable row level security;
alter table students enable row level security;
alter table modules enable row level security;
alter table class_modules enable row level security;
alter table student_module_progress enable row level security;
alter table employability_skills enable row level security;
alter table student_skill_progress enable row level security;
alter table assessment_evidence enable row level security;
alter table student_response_reviews enable row level security;
alter table player_profiles enable row level security;
alter table player_assets enable row level security;
alter table community_votes enable row level security;
alter table feedback_reports enable row level security;

drop policy if exists "Public can read schools" on schools;
create policy "Public can read schools"
on schools
for select
using (true);

drop policy if exists "Prototype can manage teachers" on teachers;
create policy "Prototype can manage teachers"
on teachers
for all
using (true)
with check (true);

drop policy if exists "Prototype can read modules" on modules;
create policy "Prototype can read modules"
on modules
for select
using (true);

drop policy if exists "Prototype can read employability skills" on employability_skills;
create policy "Prototype can read employability skills"
on employability_skills
for select
using (true);

drop policy if exists "Prototype can manage classes" on classes;
create policy "Prototype can manage classes"
on classes
for all
using (true)
with check (true);

drop policy if exists "Prototype can manage class modules" on class_modules;
create policy "Prototype can manage class modules"
on class_modules
for all
using (true)
with check (true);

drop policy if exists "Prototype can manage students" on students;
create policy "Prototype can manage students"
on students
for all
using (true)
with check (true);

drop policy if exists "Prototype can manage module progress" on student_module_progress;
create policy "Prototype can manage module progress"
on student_module_progress
for all
using (true)
with check (true);

drop policy if exists "Prototype can manage student skill progress" on student_skill_progress;
create policy "Prototype can manage student skill progress"
on student_skill_progress
for all
using (true)
with check (true);

drop policy if exists "Prototype can manage assessment evidence" on assessment_evidence;
create policy "Prototype can manage assessment evidence"
on assessment_evidence
for all
using (true)
with check (true);

drop policy if exists "Prototype can manage student response reviews" on student_response_reviews;
create policy "Prototype can manage student response reviews"
on student_response_reviews
for all
using (true)
with check (true);

drop policy if exists "Prototype can manage player profiles" on player_profiles;
create policy "Prototype can manage player profiles"
on player_profiles
for all
using (true)
with check (true);

drop policy if exists "Prototype can manage player assets" on player_assets;
create policy "Prototype can manage player assets"
on player_assets
for all
using (true)
with check (true);

drop policy if exists "Prototype can manage community votes" on community_votes;
create policy "Prototype can manage community votes"
on community_votes
for all
using (true)
with check (true);

drop policy if exists "Prototype can manage feedback reports" on feedback_reports;
create policy "Prototype can manage feedback reports"
on feedback_reports
for all
using (true)
with check (true);

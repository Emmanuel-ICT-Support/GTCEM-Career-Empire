alter table schools enable row level security;

drop policy if exists "Public can read schools" on schools;
create policy "Public can read schools"
on schools
for select
using (true);

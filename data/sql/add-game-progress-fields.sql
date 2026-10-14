alter table player_profiles
  add column if not exists years_played integer not null default 0,
  add column if not exists tech_mastery integer not null default 0,
  add column if not exists climate_mastery integer not null default 0,
  add column if not exists demo_mastery integer not null default 0,
  add column if not exists economic_mastery integer not null default 0,
  add column if not exists last_community_vote text;

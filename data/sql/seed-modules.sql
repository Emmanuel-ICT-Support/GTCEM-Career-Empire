insert into modules (id, title, curriculum_area, theme, status, sort_order)
values
  ('megatrends', 'Megatrends', 'Careers and Employability', 'Future of work and career adaptation', 'prototype', 1),
  ('lifelong-learning', 'Lifelong Learning', 'Careers and Employability', 'Growth mindset, adaptation, and ongoing learning habits', 'draft', 2),
  ('est-prep', 'EST Prep', 'Careers and Employability', 'EST revision, glossary recall, command verbs, and written-response evidence', 'active', 3),
  ('archon-careers', 'Careers Archon', 'Careers and Employability', 'Archon-inspired board strategy with Careers written response clashes', 'prototype', 4)
on conflict (id) do update
set
  title = excluded.title,
  curriculum_area = excluded.curriculum_area,
  theme = excluded.theme,
  status = excluded.status,
  sort_order = excluded.sort_order;

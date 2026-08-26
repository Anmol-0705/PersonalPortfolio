-- Migrates the existing skills and services from data/skills.ts and
-- data/services.ts into Supabase. Run after 0005 and 0006. Idempotent:
-- each insert only runs if its table is currently empty, so re-running
-- this file is a no-op once seeded (including after the admin has
-- edited content — it won't re-seed over intentional changes).
--
-- Content is copied verbatim — no wording changed, nothing invented.
-- sort_order is the flattened original array order (0-indexed); category
-- grouping and display color are reconstructed from that order plus the
-- fixed category label, by lib/skills.ts and lib/skill-categories.ts.

insert into public.skills (name, category, sort_order)
select * from (values
  ('React', 'Frontend', 0),
  ('Next.js', 'Frontend', 1),
  ('TypeScript', 'Frontend', 2),
  ('Tailwind CSS', 'Frontend', 3),
  ('Framer Motion', 'Frontend', 4),
  ('Redux', 'Frontend', 5),
  ('Node.js', 'Backend', 6),
  ('Express', 'Backend', 7),
  ('PHP', 'Backend', 8),
  ('MySQL', 'Data & Services', 9),
  ('MongoDB', 'Data & Services', 10),
  ('Firebase', 'Data & Services', 11),
  ('Docker', 'DevOps & Deployment', 12),
  ('AWS', 'DevOps & Deployment', 13),
  ('Git', 'DevOps & Deployment', 14),
  ('Vercel', 'DevOps & Deployment', 15)
) as v(name, category, sort_order)
where not exists (select 1 from public.skills);

-- icon ids map to data/services.ts's Lucide icons via
-- lib/service-icons.ts: Rocket -> rocket, Layers -> layers,
-- PenTool -> pen-tool, Wrench -> wrench.
insert into public.services (title, description, icon, sort_order)
select * from (values
  (
    'High-Converting Websites',
    'Landing pages, portfolio sites, business websites, and marketing experiences designed to look sharp and guide visitors toward action.',
    'rocket',
    0
  ),
  (
    'Full-Stack Web Applications',
    'Scalable web applications with modern frontends, backend APIs, databases, authentication, and production-ready architecture.',
    'layers',
    1
  ),
  (
    'UI/UX Design & Frontend Systems',
    'Interfaces, design systems, responsive layouts, and polished frontend experiences built around clarity and usability.',
    'pen-tool',
    2
  ),
  (
    'Fixes, Upgrades & Technical Sprints',
    'Bug fixing, UI improvements, performance work, architecture analysis, feature development, and focused development sprints.',
    'wrench',
    3
  )
) as v(title, description, icon, sort_order)
where not exists (select 1 from public.services);

-- Migrates the 5 existing projects from data/projects.ts into
-- public.projects. Run after 0001 (requires the slug unique constraint
-- for ON CONFLICT to work). Idempotent: re-running does nothing once
-- the rows exist.
insert into public.projects
  (slug, title, short_description, problem, approach, solution, technologies, category, featured, published, sort_order)
values
  (
    'the-creation-edit',
    'The-Creation-Edit',
    'A visually engaging website for a video editing agency built with React, Tailwind CSS, and Framer Motion.',
    'Video editing agencies often rely on scattered portfolio links and social media to showcase their work, which makes it harder for potential clients to get a clear, consistent first impression.',
    'The site was built around a clean, motion-forward design using React, Tailwind CSS, and Framer Motion, so the agency''s editing style could be reflected in the way the website itself moves and responds.',
    'The result is a single, cohesive website that presents the agency''s services and work in a visually engaging way, giving visitors a consistent brand experience.',
    array['React', 'Tailwind CSS', 'Framer Motion'],
    'Agency Website',
    true,
    true,
    1
  ),
  (
    'electrotrans-solutions',
    'ElectroTrans Solutions',
    'An industrial B2B website created for a transformer manufacturer, focused on presenting technical services and business capabilities clearly.',
    'Industrial and manufacturing businesses often need to communicate technical services and capabilities clearly to other businesses, which is a different challenge from a typical consumer-facing website.',
    'The site was designed around presenting technical service information and business capabilities in a clear, organized format suited to a B2B industrial audience.',
    'The result is a business website that communicates ElectroTrans Solutions'' technical services and capabilities clearly to potential B2B clients.',
    array[]::text[],
    'Industrial B2B Website',
    true,
    true,
    2
  ),
  (
    'sundown-studios',
    'Sundown Studios',
    'A sleek interior design experience featuring smooth interactions and a dynamic visual gallery.',
    'Interior design work is highly visual, so a design brand needs a website that can showcase projects in a way that feels as considered as the design work itself.',
    'The site focuses on smooth interactions and a dynamic visual gallery to let the design work take center stage.',
    'The result is a sleek, interaction-driven experience that presents Sundown Studios'' interior design work through an engaging visual gallery.',
    array[]::text[],
    'Creative / Interior Design Website',
    true,
    true,
    3
  ),
  (
    'property-dealer-web-app',
    'Property Dealer Web App',
    'A real estate platform built with React, Node.js, and PostgreSQL for managing and exploring property listings.',
    'Managing and exploring property listings requires both a usable public-facing interface and reliable backend data handling, rather than just a static marketing site.',
    'The application was built with a React frontend, a Node.js backend, and a PostgreSQL database to support structured property data and listing management.',
    'The result is a real estate web application for managing and exploring property listings, built on a full-stack architecture.',
    array['React', 'Node.js', 'PostgreSQL'],
    'Real Estate Web Application',
    false,
    true,
    4
  ),
  (
    'teaching-institute-portal',
    'Teaching Institute Portal',
    'An EdTech platform designed to support teaching, learning, and institute operations.',
    'Teaching institutes often need to support several functions — teaching, learning, and operations — that are hard to manage without a dedicated digital platform.',
    'The portal was designed to bring teaching, learning, and institute operations together in a single platform.',
    'The result is an EdTech portal that supports the institute''s teaching, learning, and operational needs.',
    array[]::text[],
    'EdTech Platform',
    false,
    true,
    5
  )
on conflict (slug) do nothing;

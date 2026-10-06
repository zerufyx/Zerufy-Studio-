-- ─────────────────────────────────────────────────────────────
--  Zerufy Studio — solicitudes del formulario "Crear mi proyecto"
--  Pégalo en Supabase → SQL Editor → New query → Run.
--  Es seguro correrlo en el mismo proyecto de los catálogos: no toca
--  ninguna tabla existente.
-- ─────────────────────────────────────────────────────────────

-- 1. Quién puede ver las solicitudes (tú). Después de correr este archivo,
--    agrega tu usuario:  insert into studio_admins (user_id) values ('<tu-user-id>');
--    (tu user id está en Authentication → Users)
create table if not exists studio_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table studio_admins enable row level security;
-- sin políticas: nadie la lee desde el navegador, solo desde el panel de Supabase

-- 2. Las solicitudes
create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null check (char_length(name) between 2 and 80),
  business      text not null check (char_length(business) between 2 and 120),
  business_type text check (char_length(business_type) <= 60),
  email         text check (char_length(email) <= 120),
  phone         text not null check (char_length(phone) between 7 and 30),
  instagram     text check (char_length(instagram) <= 60),
  needs         text[] not null default '{}' check (cardinality(needs) between 1 and 7),
  budget        text check (char_length(budget) <= 40),
  message       text check (char_length(message) <= 2000),
  plan          text check (char_length(plan) <= 40),
  source_page   text check (char_length(source_page) <= 200),
  -- para el futuro panel: nuevo → en conversación → propuesta → cerrado / perdido
  status        text not null default 'nuevo'
                check (status in ('nuevo', 'en_conversacion', 'propuesta', 'cerrado', 'perdido')),
  notes         text
);
create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);

alter table leads enable row level security;

-- El público (la página) solo puede CREAR solicitudes nuevas, nunca leerlas.
drop policy if exists "leads: el sitio puede crear" on leads;
create policy "leads: el sitio puede crear" on leads
  for insert to anon
  with check (status = 'nuevo' and notes is null);

-- Solo los administradores del estudio pueden verlas y actualizarlas.
drop policy if exists "leads: admins leen" on leads;
create policy "leads: admins leen" on leads
  for select to authenticated
  using (exists (select 1 from studio_admins a where a.user_id = auth.uid()));

drop policy if exists "leads: admins actualizan" on leads;
create policy "leads: admins actualizan" on leads
  for update to authenticated
  using (exists (select 1 from studio_admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from studio_admins a where a.user_id = auth.uid()));

-- Permisos de columna: el sitio no puede escribir status ni notes directamente.
revoke insert on leads from anon;
grant insert (name, business, business_type, email, phone, instagram, needs, budget, message, plan, source_page) on leads to anon;


-- ─────────────────────────────────────────────────────────────
--  FUTURO (no correr todavía): tablas para el panel del estudio
--  en /dashboard. Se dejan escritas para que la estructura ya exista
--  cuando llegue el momento.
-- ─────────────────────────────────────────────────────────────
-- create table studio_clients (
--   id uuid primary key default gen_random_uuid(),
--   created_at timestamptz default now(),
--   business text not null, contact_name text, phone text, email text,
--   plan text, monthly_fee numeric, next_payment date,
--   store_id bigint,              -- enlaza con la tienda en la plataforma de catálogos
--   lead_id uuid references leads (id)
-- );
-- create table studio_projects (
--   id uuid primary key default gen_random_uuid(),
--   client_id uuid references studio_clients (id),
--   name text not null, type text, status text default 'diseño',  -- diseño, construcción, revisión, publicado
--   url text, started_at date, launched_at date
-- );
-- create table site_projects (       -- el portafolio, si algún día se edita desde el panel
--   slug text primary key, name text, sector text, type text,
--   categories text[], summary text, problem text[], solution text[], result text[],
--   features text[], stack text[], url text, cover text, published boolean default false, sort int
-- );

-- ─────────────────────────────────────────────────────────────
--  2.0 (ya aplicado): tiempo del proyecto y campo "Web o Instagram"
-- ─────────────────────────────────────────────────────────────
-- alter table public.leads add column if not exists timeline text check (char_length(timeline) <= 40);
-- alter table public.leads drop constraint if exists leads_instagram_check;
-- alter table public.leads add constraint leads_instagram_check check (char_length(instagram) <= 200);
-- grant insert (timeline) on public.leads to anon;

-- ─────────────────────────────────────────────────────────────
--  Origen del cliente (ya aplicado, migración leads_origin)
-- ─────────────────────────────────────────────────────────────
-- alter table public.leads add column if not exists origin jsonb
--   check (origin is null or (jsonb_typeof(origin) = 'object' and pg_column_size(origin) < 2000));
-- grant insert (origin) on public.leads to anon;

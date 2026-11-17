-- =====================================================================
-- TALENTO NOVA · ACTUALIZACIÓN DE LA BASE DE DATOS (ejecutar UNA vez)
-- Supabase > SQL Editor > New query > pegar todo > Run
-- Es seguro ejecutarlo de nuevo: no borra nada.
-- =====================================================================

-- 1) Contraseña para el inicio de sesión (se guarda cifrada, nunca en texto)
alter table public.users add column if not exists password_hash text;

-- 2) Habilidades de cada usuario (si todavía no existe)
create table if not exists public.skills (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    skill_name text not null,
    level text not null check (level in ('basic', 'intermediate', 'advanced')),
    category text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique (user_id, skill_name)
);
create index if not exists idx_skills_user on public.skills(user_id);

-- 3) Historial de cambios de estado de cada postulación
create table if not exists public.application_history (
    id uuid primary key default gen_random_uuid(),
    application_id uuid not null references public.applications(id) on delete cascade,
    status text not null,
    note text,
    changed_by uuid references public.users(id),
    created_at timestamptz default now()
);
create index if not exists idx_application_history_app on public.application_history(application_id);

-- 4) Seguridad: solo la API (con la clave secreta) puede leer y escribir
alter table public.users               enable row level security;
alter table public.curriculums         enable row level security;
alter table public.documents           enable row level security;
alter table public.companies           enable row level security;
alter table public.company_members     enable row level security;
alter table public.jobs                enable row level security;
alter table public.applications        enable row level security;
alter table public.skills              enable row level security;
alter table public.application_history enable row level security;

-- 5) Avisar a la API de Supabase que hay columnas y tablas nuevas
notify pgrst, 'reload schema';

-- =====================================================================
-- TALENTO NOVA · ESQUEMA COMPLETO (referencia / base de datos nueva)
-- MOTOR: PostgreSQL (Supabase)
-- Si tu base de datos YA tiene las tablas, NO ejecutes este archivo:
-- ejecuta solo 01_actualizacion.sql
-- =====================================================================

-- 1. USUARIOS
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  phone text,
  profile_photo text,
  role text not null check (role in ('candidate', 'recruiter', 'administrator')),
  account_status text default 'active',
  password_hash text,
  email_verified_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- 2. CURRICULUMS
create table if not exists public.curriculums (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  title text,
  description text,
  experience text,
  education text,
  skills text,
  languages text,
  updated_at timestamptz default now(),
  unique(user_id)
);

-- 3. DOCUMENTOS
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  document_type text,
  file_name text,
  storage_path text,
  mime_type text,
  file_size int,
  upload_date timestamptz default now(),
  verification_status text default 'pending',
  verification_date timestamptz,
  verified_by uuid references public.users(id),
  rejection_reason text,
  created_at timestamptz default now()
);

-- 4. EMPRESAS
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  tax_identification_number text unique not null,
  description text,
  industry text,
  company_size text,
  website text,
  email text,
  phone text,
  country text,
  department text,
  city text,
  address text,
  logo text,
  verification_status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. RECLUTADORES ↔ EMPRESAS
create table if not exists public.company_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  user_id uuid not null references public.users(id),
  created_at timestamptz default now(),
  unique(company_id, user_id)
);

-- 6. OFERTAS DE TRABAJO
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  created_by uuid references public.users(id),
  job_title text not null,
  description text,
  requirements text,
  responsibilities text,
  employment_type text,
  work_modality text,
  country text,
  department text,
  city text,
  salary_min numeric,
  salary_max numeric,
  salary_currency text,
  experience_required text,
  education_required text,
  vacancies int default 1,
  publication_status text default 'draft',
  publication_date timestamptz,
  expiration_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. POSTULACIONES
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  job_id uuid not null references public.jobs(id),
  application_status text default 'pending',
  application_date timestamptz default now(),
  unique(user_id, job_id)
);

-- 8. HABILIDADES
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

-- 9. HISTORIAL DE POSTULACIONES
create table if not exists public.application_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  status text not null,
  note text,
  changed_by uuid references public.users(id),
  created_at timestamptz default now()
);

-- 10. ÍNDICES
create index if not exists idx_documents_user on public.documents(user_id);
create index if not exists idx_jobs_company on public.jobs(company_id);
create index if not exists idx_jobs_status on public.jobs(publication_status);
create index if not exists idx_applications_user on public.applications(user_id);
create index if not exists idx_applications_job on public.applications(job_id);
create index if not exists idx_company_members_user on public.company_members(user_id);
create index if not exists idx_skills_user on public.skills(user_id);
create index if not exists idx_application_history_app on public.application_history(application_id);

-- 11. SEGURIDAD (solo la API con la clave secreta puede entrar)
alter table public.users               enable row level security;
alter table public.curriculums         enable row level security;
alter table public.documents           enable row level security;
alter table public.companies           enable row level security;
alter table public.company_members     enable row level security;
alter table public.jobs                enable row level security;
alter table public.applications        enable row level security;
alter table public.skills              enable row level security;
alter table public.application_history enable row level security;

notify pgrst, 'reload schema';

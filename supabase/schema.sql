-- Nexora marketplace schema
-- Apply through Supabase migrations, then test every RLS policy.
create extension if not exists pgcrypto;

create type public.user_role as enum ('customer','admin');
create type public.project_status as enum (
  'requirement_submitted','requirement_reviewed','contract_pending','payment_pending',
  'project_started','design_phase','development_phase','testing','client_review',
  'revisions','completed','delivered'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'customer',
  full_name text not null,
  email text not null,
  phone text,
  company text,
  country text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  active boolean not null default true,
  base_price bigint not null check (base_price >= 0),
  currency text not null default 'INR',
  delivery_days_min int,
  delivery_days_max int,
  revisions int not null default 2,
  support_days int not null default 30,
  features jsonb not null default '[]'::jsonb,
  add_ons jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_pricing (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  price bigint not null check (price >= 0),
  discount bigint not null default 0 check (discount >= 0),
  tax_rate numeric(6,4) not null default 0,
  effective_from timestamptz not null default now(),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  product_id uuid references public.products(id),
  status text not null default 'draft',
  currency text not null default 'INR',
  subtotal bigint not null default 0,
  discount bigint not null default 0,
  tax bigint not null default 0,
  total bigint not null default 0,
  requirements jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  order_id uuid unique references public.orders(id),
  customer_id uuid not null references public.profiles(id),
  product_id uuid references public.products(id),
  name text not null,
  status public.project_status not null default 'requirement_submitted',
  scope jsonb not null default '{}'::jsonb,
  assigned_to uuid references public.profiles(id),
  started_at timestamptz,
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contract_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  body text not null,
  version text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  template_id uuid references public.contract_templates(id),
  version text not null,
  snapshot_body text not null,
  price bigint not null,
  currency text not null default 'INR',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.contract_acceptances (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid unique not null references public.contracts(id) on delete cascade,
  customer_id uuid not null references public.profiles(id),
  accepted_at timestamptz not null default now(),
  acceptance_method text not null default 'checkbox',
  ip_hash text,
  user_agent text
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id),
  provider text not null,
  provider_order_id text,
  provider_payment_id text,
  amount bigint not null,
  currency text not null default 'INR',
  status text not null default 'created',
  raw_event jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid unique not null references public.orders(id),
  invoice_number text unique not null,
  total bigint not null,
  currency text not null default 'INR',
  issued_at timestamptz not null default now(),
  pdf_path text
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid unique not null references public.projects(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null check (length(body) between 1 and 10000),
  attachment_path text,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid unique not null references public.projects(id),
  customer_id uuid not null references public.profiles(id),
  rating int not null check (rating between 1 and 5),
  body text not null check (length(body) between 5 and 3000),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null,
  description text not null,
  technologies jsonb not null default '[]'::jsonb,
  image_paths jsonb not null default '[]'::jsonb,
  live_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  published boolean not null default true,
  sort_order int not null default 0
);

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.ai_knowledge (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  title text not null,
  content text not null,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index orders_customer_idx on public.orders(customer_id);
create index projects_customer_idx on public.projects(customer_id);
create index projects_status_idx on public.projects(status);
create index messages_conversation_created_idx on public.messages(conversation_id, created_at);
create index notifications_user_read_idx on public.notifications(user_id, read_at);
create index reviews_published_idx on public.reviews(published);

-- Helper functions.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

-- Enable RLS on all application tables.
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_pricing enable row level security;
alter table public.orders enable row level security;
alter table public.projects enable row level security;
alter table public.contract_templates enable row level security;
alter table public.contracts enable row level security;
alter table public.contract_acceptances enable row level security;
alter table public.payments enable row level security;
alter table public.invoices enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.reviews enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.faqs enable row level security;
alter table public.site_settings enable row level security;
alter table public.ai_knowledge enable row level security;
alter table public.audit_logs enable row level security;

-- Public catalog content.
create policy "public can read active products" on public.products for select using (active = true);
create policy "public can read active pricing" on public.product_pricing for select using (active = true);
create policy "public can read published portfolio" on public.portfolio_items for select using (published = true);
create policy "public can read published faqs" on public.faqs for select using (published = true);
create policy "public can read published reviews" on public.reviews for select using (published = true);

-- Customer-owned records.
create policy "customer reads own profile" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "customer updates own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "customer reads own orders" on public.orders for select to authenticated using (customer_id = auth.uid() or public.is_admin());
create policy "customer creates own orders" on public.orders for insert to authenticated with check (customer_id = auth.uid());
create policy "admin manages orders" on public.orders for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "customer reads own projects" on public.projects for select to authenticated using (customer_id = auth.uid() or public.is_admin());
create policy "admin manages projects" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "customer reads own contracts" on public.contracts for select to authenticated using (exists(select 1 from public.projects p where p.id = project_id and (p.customer_id = auth.uid() or public.is_admin())));
create policy "admin manages contracts" on public.contracts for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "customer accepts own contract" on public.contract_acceptances for insert to authenticated with check (customer_id = auth.uid());
create policy "customer reads own acceptance" on public.contract_acceptances for select to authenticated using (customer_id = auth.uid() or public.is_admin());
create policy "customer reads own payments" on public.payments for select to authenticated using (exists(select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or public.is_admin())));
create policy "admin manages payments" on public.payments for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "customer reads own invoices" on public.invoices for select to authenticated using (exists(select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or public.is_admin())));
create policy "conversation participants read" on public.conversations for select to authenticated using (exists(select 1 from public.projects p where p.id = project_id and (p.customer_id = auth.uid() or public.is_admin())));
create policy "conversation participants read messages" on public.messages for select to authenticated using (exists(select 1 from public.conversations c join public.projects p on p.id = c.project_id where c.id = conversation_id and (p.customer_id = auth.uid() or public.is_admin())));
create policy "participants send messages" on public.messages for insert to authenticated with check (sender_id = auth.uid() and exists(select 1 from public.conversations c join public.projects p on p.id = c.project_id where c.id = conversation_id and (p.customer_id = auth.uid() or public.is_admin())));
create policy "customer reads own notifications" on public.notifications for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "customer reads own reviews" on public.reviews for select to authenticated using (customer_id = auth.uid() or published = true or public.is_admin());
create policy "customer creates review for own project" on public.reviews for insert to authenticated with check (customer_id = auth.uid() and exists(select 1 from public.projects p where p.id = project_id and p.customer_id = auth.uid() and p.status = 'delivered'));
create policy "admin manages reviews" on public.reviews for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Admin-only knowledge/settings/audit.
create policy "admin manages pricing" on public.product_pricing for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manages products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manages site settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin manages AI knowledge" on public.ai_knowledge for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin reads audit logs" on public.audit_logs for select to authenticated using (public.is_admin());
create policy "admin inserts audit logs" on public.audit_logs for insert to authenticated with check (public.is_admin());

-- IMPORTANT:
-- In production, add Storage RLS policies for private customer files, and do not
-- expose the service/secret key in browser code. Test every policy with positive
-- and negative cases before launch.

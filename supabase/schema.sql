-- GRUPO GIT — esquema de base de datos
-- Ejecuta este script completo en Supabase: Dashboard > SQL Editor > New query > Run

-- ============ TABLAS ============

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  reference text not null,
  description text not null default '',
  price numeric(12, 2) not null default 0,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists catalogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);

-- ============ SEGURIDAD (Row Level Security) ============

alter table products enable row level security;
alter table catalogs enable row level security;

-- Lectura pública (para que la Tienda y el Portafolio se vean sin login)
create policy "products_public_read" on products
  for select using (true);

create policy "catalogs_public_read" on catalogs
  for select using (true);

-- Escritura solo para usuarios autenticados (el admin logueado)
create policy "products_admin_write" on products
  for insert to authenticated with check (true);
create policy "products_admin_update" on products
  for update to authenticated using (true) with check (true);
create policy "products_admin_delete" on products
  for delete to authenticated using (true);

create policy "catalogs_admin_write" on catalogs
  for insert to authenticated with check (true);
create policy "catalogs_admin_delete" on catalogs
  for delete to authenticated using (true);

-- ============ STORAGE (buckets para fotos y PDFs) ============

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('catalogs', 'catalogs', true)
on conflict (id) do nothing;

-- Lectura pública de los archivos
create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "catalogs_public_read_storage" on storage.objects
  for select using (bucket_id = 'catalogs');

-- Subida/borrado solo para usuarios autenticados
create policy "product_images_admin_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');
create policy "product_images_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');

create policy "catalogs_admin_write_storage" on storage.objects
  for insert to authenticated with check (bucket_id = 'catalogs');
create policy "catalogs_admin_delete_storage" on storage.objects
  for delete to authenticated using (bucket_id = 'catalogs');

-- ============ SIGUIENTE PASO ============
-- Crea el usuario admin en: Dashboard > Authentication > Users > Add user
-- (email + contraseña). Con ese usuario inicias sesión en /admin/login del sitio.

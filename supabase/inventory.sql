-- GRUPO GIT — módulo de INVENTARIO (interno, solo con login)
-- Ejecuta este script en Supabase: SQL Editor > New query > Run.
-- Es seguro correrlo más de una vez.

-- ============ TABLA ============

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,                              -- nombre (el link a la foto)
  reference text not null default '',              -- REFERENCIA
  brand text not null default '',                  -- MARCA
  description text not null default '',            -- DESCRIPCION BASICA
  quantity integer not null default 1 check (quantity >= 0),  -- CANTIDAD
  location text not null default '',               -- LOCALIZACION
  cost numeric(14, 2) not null default 0 check (cost >= 0),   -- COSTO (COP)
  photo_path text,                                 -- ruta en el bucket privado
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_inventory_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists inventory_items_updated_at on inventory_items;
create trigger inventory_items_updated_at
  before update on inventory_items
  for each row execute function set_inventory_updated_at();

-- ============ SEGURIDAD (RLS): TODO solo para usuarios autenticados ============
-- A diferencia de products/catalogs, el inventario NO es de lectura pública.

alter table inventory_items enable row level security;

drop policy if exists "inventory_auth_select" on inventory_items;
drop policy if exists "inventory_auth_insert" on inventory_items;
drop policy if exists "inventory_auth_update" on inventory_items;
drop policy if exists "inventory_auth_delete" on inventory_items;

create policy "inventory_auth_select" on inventory_items
  for select to authenticated using (true);
create policy "inventory_auth_insert" on inventory_items
  for insert to authenticated with check (true);
create policy "inventory_auth_update" on inventory_items
  for update to authenticated using (true) with check (true);
create policy "inventory_auth_delete" on inventory_items
  for delete to authenticated using (true);

-- ============ STORAGE: bucket PRIVADO para las fotos ============

insert into storage.buckets (id, name, public)
values ('inventory-photos', 'inventory-photos', false)
on conflict (id) do nothing;

drop policy if exists "inventory_photos_auth_read" on storage.objects;
drop policy if exists "inventory_photos_auth_insert" on storage.objects;
drop policy if exists "inventory_photos_auth_update" on storage.objects;
drop policy if exists "inventory_photos_auth_delete" on storage.objects;

create policy "inventory_photos_auth_read" on storage.objects
  for select to authenticated using (bucket_id = 'inventory-photos');
create policy "inventory_photos_auth_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'inventory-photos');
create policy "inventory_photos_auth_update" on storage.objects
  for update to authenticated using (bucket_id = 'inventory-photos');
create policy "inventory_photos_auth_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'inventory-photos');

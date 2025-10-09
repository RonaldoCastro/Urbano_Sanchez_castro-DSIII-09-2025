-- supabase/schema.sql

-- Extensión para uuid, si no está
create extension if not exists "pgcrypto";

-- Tabla de productos
create table if not exists productos (
  id serial primary key,
  nombre text not null,
  precio numeric(10,2) not null default 0,
  stock integer not null default 0,
  creado_at timestamp with time zone default now()
);

-- Tabla de movimientos
create table if not exists movimientos (
  id serial primary key,
  producto_id integer references productos(id) on delete set null,
  tipo text check (tipo in ('entrada','salida')),
  cantidad integer not null,
  fecha timestamp with time zone default now()
);
-- ============================================================
-- TechZone Bénin — création de la table produits
-- À coller dans Supabase Dashboard > SQL Editor > New query > Run
-- ============================================================

create table if not exists products (
  id serial primary key,
  slug text not null unique,
  name text not null,
  brand text not null default '',
  category text not null,
  subcategory text not null,
  subcategory_label text not null default '',
  condition text not null default 'neuf',
  condition_detail text not null default 'Neuf',
  warranty text,
  description text not null default '',
  images jsonb not null default '[]'::jsonb,
  price integer not null,
  price_note text,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on products (category);
create index if not exists products_subcategory_idx on products (subcategory);
create index if not exists products_price_idx on products (price);

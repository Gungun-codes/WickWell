-- Lumé — Supabase schema. Run in SQL Editor (or as a migration).
-- Prices are stored in paise (integer) to avoid float errors. ₹799 = 79900.

create extension if not exists "pgcrypto";

-- ───────── Enums ─────────
create type order_status as enum
  ('pending', 'paid', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded');

-- ───────── Profiles ─────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false)
$$;

-- ───────── Catalogue ─────────
create table moods (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,           -- calm, romantic, energetic, cozy, bold, sleepy, main-character
  name text not null,
  image_id text,                       -- Cloudinary public_id
  sort_order int not null default 0
);

create table occasions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,           -- date-night, self-care, study-work, gifting, festive, just-because
  name text not null,
  image_id text,
  sort_order int not null default 0
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  notes text[] not null default '{}',      -- {'Rose','Peony','Musk'}
  families text[] not null default '{}',   -- {'floral','woody','sweet','fresh'} used by quiz step 2
  burn_hours int,
  image_ids text[] not null default '{}',  -- Cloudinary public_ids, first = primary
  is_bestseller boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  sku text unique not null,
  size_label text not null,            -- '180g', '300g'
  price_paise int not null check (price_paise >= 0),
  stock int not null default 0 check (stock >= 0),
  unique (product_id, size_label)
);

-- weight 1–5: how strongly a candle fits a mood / occasion
create table product_moods (
  product_id uuid references products(id) on delete cascade,
  mood_id uuid references moods(id) on delete cascade,
  weight int not null default 3 check (weight between 1 and 5),
  primary key (product_id, mood_id)
);

create table product_occasions (
  product_id uuid references products(id) on delete cascade,
  occasion_id uuid references occasions(id) on delete cascade,
  primary key (product_id, occasion_id)
);

-- "Pairs well with" (wax melts, holders, gift boxes)
create table product_pairings (
  product_id uuid references products(id) on delete cascade,
  paired_product_id uuid references products(id) on delete cascade,
  primary key (product_id, paired_product_id),
  check (product_id <> paired_product_id)
);

-- ───────── Shopping ─────────
create table cart_items (
  user_id uuid references auth.users(id) on delete cascade,
  variant_id uuid references variants(id) on delete cascade,
  quantity int not null default 1 check (quantity between 1 and 20),
  updated_at timestamptz not null default now(),
  primary key (user_id, variant_id)
);

create table addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null check (pincode ~ '^[1-9][0-9]{5}$'),
  is_default boolean not null default false
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity (start with 1001),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  status order_status not null default 'pending',
  subtotal_paise int not null,
  shipping_paise int not null default 0,
  total_paise int not null,
  shipping_address jsonb not null,
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  variant_id uuid references variants(id) on delete set null,
  product_name text not null,          -- snapshot so old orders survive catalogue edits
  size_label text not null,
  unit_price_paise int not null,
  quantity int not null check (quantity > 0)
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create table newsletter_subscribers (
  email text primary key,
  created_at timestamptz not null default now()
);

create index on variants (product_id);
create index on product_moods (mood_id);
create index on orders (user_id, created_at desc);
create index on reviews (product_id);

-- Rating summary for cards ("★ 4.8 (184)")
create view product_ratings as
  select product_id, round(avg(rating)::numeric, 1) as avg_rating, count(*) as review_count
  from reviews group by product_id;

-- ───────── Row Level Security ─────────
alter table profiles enable row level security;
alter table moods enable row level security;
alter table occasions enable row level security;
alter table products enable row level security;
alter table variants enable row level security;
alter table product_moods enable row level security;
alter table product_occasions enable row level security;
alter table product_pairings enable row level security;
alter table cart_items enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table reviews enable row level security;
alter table newsletter_subscribers enable row level security;

-- Public catalogue (read-only)
create policy "moods public read" on moods for select using (true);
create policy "occasions public read" on occasions for select using (true);
create policy "products public read" on products for select using (is_active or is_admin());
create policy "variants public read" on variants for select using (true);
create policy "product_moods public read" on product_moods for select using (true);
create policy "product_occasions public read" on product_occasions for select using (true);
create policy "pairings public read" on product_pairings for select using (true);
create policy "reviews public read" on reviews for select using (true);

-- Admin writes on catalogue
create policy "admin all moods" on moods for all using (is_admin()) with check (is_admin());
create policy "admin all occasions" on occasions for all using (is_admin()) with check (is_admin());
create policy "admin all products" on products for all using (is_admin()) with check (is_admin());
create policy "admin all variants" on variants for all using (is_admin()) with check (is_admin());
create policy "admin all product_moods" on product_moods for all using (is_admin()) with check (is_admin());
create policy "admin all product_occasions" on product_occasions for all using (is_admin()) with check (is_admin());
create policy "admin all pairings" on product_pairings for all using (is_admin()) with check (is_admin());

-- Own data
create policy "own profile read" on profiles for select using (id = auth.uid() or is_admin());
create policy "own profile update" on profiles for update using (id = auth.uid())
  with check (id = auth.uid() and is_admin = (select is_admin from profiles where id = auth.uid()));
create policy "own cart" on cart_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own addresses" on addresses for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own reviews insert" on reviews for insert with check (user_id = auth.uid());
create policy "own reviews update" on reviews for update using (user_id = auth.uid());
create policy "own reviews delete" on reviews for delete using (user_id = auth.uid());

-- Orders: users can READ their own. All writes go through the Python API with the
-- service-role key (bypasses RLS), so clients can never forge prices or paid status.
create policy "own orders read" on orders for select using (user_id = auth.uid() or is_admin());
create policy "own order_items read" on order_items for select
  using (exists (select 1 from orders o where o.id = order_id and (o.user_id = auth.uid() or is_admin())));

-- Newsletter: anyone can subscribe, nobody can read the list from the client
create policy "newsletter insert" on newsletter_subscribers for insert with check (true);

-- ───────── Seed ─────────
insert into moods (slug, name, sort_order) values
  ('calm','Calm',1), ('romantic','Romantic',2), ('cozy','Cozy',3), ('fresh','Fresh',4),
  ('bold','Bold',5), ('sleepy','Sleepy',6), ('main-character','Main Character',7);

insert into occasions (slug, name, sort_order) values
  ('date-night','Date Night',1), ('self-care','Self Care',2), ('study-work','Study / Work',3),
  ('gifting','Gifting',4), ('festive','Festive',5), ('just-because','Just Because',6);

insert into products (slug, name, tagline, notes, families, burn_hours, is_bestseller) values
  ('vanilla-haze','Vanilla Haze','A warm, comforting scent for your cozy, peaceful moments.','{Vanilla,Amber,Tonka}','{sweet,woody}',50,true),
  ('rose-reverie','Rose Reverie','A romantic blend of blooming roses and soft peony.','{Rose,Peony,Musk}','{floral}',50,true),
  ('coffee-date','Coffee Date','Coffee, chocolate and vanilla for slow mornings.','{Coffee,Chocolate,Vanilla}','{sweet}',50,true),
  ('eucalyptus-calm','Eucalyptus Calm','Fresh, clean and grounding.','{Eucalyptus,Mint,Cedar}','{fresh,woody}',50,true);

insert into variants (product_id, sku, size_label, price_paise, stock)
select id, upper(slug) || '-180', '180g',
  case slug when 'vanilla-haze' then 79900 when 'rose-reverie' then 89900
            when 'coffee-date' then 79900 else 74900 end, 50
from products;

insert into variants (product_id, sku, size_label, price_paise, stock)
select id, upper(slug) || '-300', '300g',
  case slug when 'vanilla-haze' then 119900 when 'rose-reverie' then 129900
            when 'coffee-date' then 119900 else 109900 end, 30
from products;

-- Mood fit (weight 1–5)
insert into product_moods (product_id, mood_id, weight)
select p.id, m.id, w.weight from (values
  ('vanilla-haze','cozy',5), ('vanilla-haze','calm',4), ('vanilla-haze','sleepy',4),
  ('rose-reverie','romantic',5), ('rose-reverie','main-character',4), ('rose-reverie','calm',2),
  ('coffee-date','cozy',5), ('coffee-date','bold',3),
  ('eucalyptus-calm','fresh',5), ('eucalyptus-calm','calm',5), ('eucalyptus-calm','sleepy',2)
) as w(product_slug, mood_slug, weight)
join products p on p.slug = w.product_slug
join moods m on m.slug = w.mood_slug;

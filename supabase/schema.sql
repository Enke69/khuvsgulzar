-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  is_banned boolean not null default false,
  created_at timestamptz not null default now()
);

-- Categories table
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  icon text,
  parent_id uuid references public.categories(id),
  created_at timestamptz not null default now()
);

-- Locations table
create table public.locations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  parent_id uuid references public.locations(id),
  created_at timestamptz not null default now()
);

-- Ads table
create table public.ads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  location_id uuid references public.locations(id) on delete set null,
  title text not null,
  description text,
  price numeric(12,2),
  condition text check (condition in ('new', 'used', 'refurbished')),
  ad_type text not null default 'sell' check (ad_type in ('sell', 'buy', 'rent', 'service')),
  status text not null default 'pending' check (status in ('draft', 'pending', 'approved', 'rejected', 'sold')),
  is_featured boolean not null default false,
  is_sold boolean not null default false,
  views integer not null default 0,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ad images table
create table public.ad_images (
  id uuid primary key default uuid_generate_v4(),
  ad_id uuid references public.ads(id) on delete cascade not null,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Favorites table
create table public.favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  ad_id uuid references public.ads(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(user_id, ad_id)
);

-- Reports table
create table public.reports (
  id uuid primary key default uuid_generate_v4(),
  ad_id uuid references public.ads(id) on delete cascade not null,
  reporter_id uuid references auth.users(id) on delete cascade not null,
  reason text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

-- Messages table
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  ad_id uuid references public.ads(id) on delete cascade not null,
  sender_id uuid references auth.users(id) on delete cascade not null,
  receiver_id uuid references auth.users(id) on delete cascade not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Admin logs table
create table public.admin_logs (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid references auth.users(id) on delete cascade not null,
  action text not null,
  target_type text not null,
  target_id uuid,
  description text not null,
  created_at timestamptz not null default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at on ads
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger ads_updated_at
  before update on public.ads
  for each row execute procedure public.update_updated_at();

-- Increment ad views function
create or replace function public.increment_ad_views(ad_id uuid)
returns void as $$
begin
  update public.ads set views = views + 1 where id = ad_id;
end;
$$ language plpgsql security definer;

-- Storage bucket for ad images (run in Supabase dashboard or via API)
-- insert into storage.buckets (id, name, public) values ('ad-images', 'ad-images', true);

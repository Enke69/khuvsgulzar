-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.ads enable row level security;
alter table public.ad_images enable row level security;
alter table public.favorites enable row level security;
alter table public.reports enable row level security;
alter table public.messages enable row level security;
alter table public.admin_logs enable row level security;
alter table public.categories enable row level security;
alter table public.locations enable row level security;

-- =====================
-- PROFILES
-- =====================
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = user_id);

-- =====================
-- CATEGORIES (public read, admin write)
-- =====================
create policy "Categories are public"
  on public.categories for select using (true);

create policy "Admins can manage categories"
  on public.categories for all using (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

-- =====================
-- LOCATIONS (public read, admin write)
-- =====================
create policy "Locations are public"
  on public.locations for select using (true);

create policy "Admins can manage locations"
  on public.locations for all using (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

-- =====================
-- ADS
-- =====================
create policy "Approved ads viewable by everyone, own ads viewable by owner, all by admin"
  on public.ads for select using (
    status = 'approved'
    or user_id = auth.uid()
    or exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

create policy "Authenticated non-banned users can insert ads"
  on public.ads for insert with check (
    auth.uid() = user_id
    and not exists (
      select 1 from public.profiles where user_id = auth.uid() and is_banned = true
    )
  );

create policy "Users can update own ads, admins can update all"
  on public.ads for update using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

create policy "Users can delete own ads, admins can delete all"
  on public.ads for delete using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

-- =====================
-- AD IMAGES
-- =====================
create policy "Ad images are public"
  on public.ad_images for select using (true);

create policy "Users can manage images of own ads"
  on public.ad_images for all using (
    exists (select 1 from public.ads where id = ad_id and user_id = auth.uid())
    or exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

-- =====================
-- FAVORITES
-- =====================
create policy "Users can manage own favorites"
  on public.favorites for all using (auth.uid() = user_id);

-- =====================
-- REPORTS
-- =====================
create policy "Users can create reports"
  on public.reports for insert with check (auth.uid() = reporter_id);

create policy "Admins can view and manage all reports"
  on public.reports for all using (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

create policy "Reporters can view own reports"
  on public.reports for select using (auth.uid() = reporter_id);

-- =====================
-- MESSAGES
-- =====================
create policy "Users can view own messages"
  on public.messages for select using (
    auth.uid() = sender_id or auth.uid() = receiver_id
  );

create policy "Authenticated users can send messages"
  on public.messages for insert with check (auth.uid() = sender_id);

-- =====================
-- ADMIN LOGS
-- =====================
create policy "Admins can manage logs"
  on public.admin_logs for all using (
    exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin')
  );

-- =====================
-- STORAGE POLICIES (run in Supabase dashboard)
-- =====================
-- Allow public read of ad-images bucket
-- create policy "Public read ad images"
--   on storage.objects for select using (bucket_id = 'ad-images');
--
-- Allow authenticated users to upload
-- create policy "Authenticated upload ad images"
--   on storage.objects for insert with check (
--     bucket_id = 'ad-images' and auth.role() = 'authenticated'
--   );
--
-- Allow users to delete own uploads
-- create policy "Users delete own ad images"
--   on storage.objects for delete using (
--     bucket_id = 'ad-images' and auth.uid()::text = (storage.foldername(name))[1]
--   );

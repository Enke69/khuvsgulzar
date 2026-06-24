# Classico — Монголын Зар Сурталчилгааны Платформ

## Суулгах заавар

### 1. Supabase төсөл үүсгэх

1. [supabase.com](https://supabase.com) дээр бүртгүүлэх
2. "New project" дарж шинэ төсөл үүсгэх
3. Нэр, нууц үг оруулж үүсгэх (санах: ямар ч нууц үг дарна)
4. Төсөл үүссэний дараа **Settings → API** хэсэгт орно:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Database schema тохируулах

Supabase dashboard → **SQL Editor** → "New query":

```sql
-- Эхлээд schema.sql -ийн агуулгыг хуулж ажиллуулна
-- Дараа нь rls.sql -ийн агуулгыг хуулж ажиллуулна
-- Эцэст нь seed.sql -ийн агуулгыг хуулж ажиллуулна
```

Файлууд: `supabase/schema.sql`, `supabase/rls.sql`, `supabase/seed.sql`

### 3. Storage bucket тохируулах

Supabase dashboard → **Storage** → "New bucket":
- Name: `ad-images`
- Public bucket: ✅ (нийтийн)

Дараа нь **Storage → Policies** дээр дараах policy нэмнэ:

```sql
-- Public read
create policy "Public read ad images"
  on storage.objects for select using (bucket_id = 'ad-images');

-- Authenticated upload
create policy "Authenticated upload ad images"
  on storage.objects for insert with check (
    bucket_id = 'ad-images' and auth.role() = 'authenticated'
  );

-- Owner delete
create policy "Users delete own ad images"
  on storage.objects for delete using (
    bucket_id = 'ad-images' and auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 4. Authentication тохируулах

Supabase dashboard → **Authentication → Settings**:
- Email confirmations: шаардлагатай бол идэвхжүүлнэ
- Site URL: `http://localhost:3000` (development)

### 5. Орчны хувьсагч тохируулах

Төслийн root фолдерт `.env.local` файл үүсгэнэ:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 6. Эхлүүлэх

```bash
npm install
npm run dev
```

Browser дээр `http://localhost:3000` нээнэ.

### 7. Admin хэрэглэгч үүсгэх

1. `/register` хуудсаар бүртгүүлнэ
2. Supabase dashboard → **Table Editor → profiles** хүснэгт
3. Өөрийн profile-ийн `role` талбарыг `admin` болгож өөрчилнэ

---

## Хавтас бүтэц

```
src/
  app/               ← Next.js App Router хуудсууд
    page.tsx         ← Нүүр хуудас
    login/           ← Нэвтрэх
    register/        ← Бүртгүүлэх
    ads/[id]/        ← Зарын дэлгэрэнгүй
    categories/[slug]/ ← Ангиллын жагсаалт
    search/          ← Хайлтын үр дүн
    dashboard/       ← Хэрэглэгчийн самбар
    admin/           ← Админ самбар
  components/        ← UI компонентууд
  lib/               ← Туслах функцууд, тогтмолууд
supabase/
  schema.sql         ← Хүснэгтийн бүтэц
  rls.sql            ← Row Level Security
  seed.sql           ← Анхны өгөгдөл
```

## Технологи

- **Next.js 15** — App Router, Server Components
- **TypeScript** — Төрөл баталгаажуулалт
- **Tailwind CSS v4** — Загвар
- **Supabase** — Database, Auth, Storage
- **Recharts** — Диаграм
- **Lucide React** — Дүрс тэмдэг

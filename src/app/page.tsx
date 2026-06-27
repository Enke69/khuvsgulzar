import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/home/HeroSection'
import CategoryGrid from '@/components/home/CategoryGrid'
import AdGrid from '@/components/ads/AdGrid'
import Link from 'next/link'
import { Megaphone, FileText, Scale, Building, Shield, CheckCircle, Clock } from 'lucide-react'
import type { Ad, Category } from '@/lib/types'

const DEMO_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Үл хөдлөх',      slug: 'ul-hodloh',   icon: 'Building2',  parent_id: null, created_at: '' },
  { id: 'c2', name: 'Автомашин',       slug: 'auto',         icon: 'Car',         parent_id: null, created_at: '' },
  { id: 'c3', name: 'Ажил',            slug: 'ajil',         icon: 'Briefcase',   parent_id: null, created_at: '' },
  { id: 'c4', name: 'Цахилгаан бараа', slug: 'electronics',  icon: 'Smartphone',  parent_id: null, created_at: '' },
  { id: 'c5', name: 'Үйлчилгээ',       slug: 'uilchilgee',   icon: 'Wrench',      parent_id: null, created_at: '' },
  { id: 'c6', name: 'Мал амьтан',      slug: 'animals',      icon: 'Dog',         parent_id: null, created_at: '' },
  { id: 'c7', name: 'Зочид буудал',    slug: 'hotel',        icon: 'Building2',   parent_id: null, created_at: '' },
  { id: 'c8', name: 'Гэр түрээс',      slug: 'rent',         icon: 'Home',        parent_id: null, created_at: '' },
]

const DEMO_ADS: Ad[] = [
  {
    id: 'demo-1', user_id: '', category_id: '', location_id: '',
    title: '2 давхар шинэ байр',
    description: null, price: 150000000, condition: 'new', ad_type: 'sell',
    status: 'approved', is_featured: false, is_sold: false, views: 125, phone: null,
    created_at: '2024-05-20T00:00:00Z', updated_at: '2024-05-20T00:00:00Z',
    category: { id: '', name: 'Үл хөдлөх', slug: 'ul-hodloh', icon: 'Building2', parent_id: null, created_at: '' },
    location: { id: '', name: 'Мөрөн сум, 8-р баг', slug: 'moron', parent_id: null, created_at: '' },
    ad_images: [],
  },
  {
    id: 'demo-2', user_id: '', category_id: '', location_id: '',
    title: 'Toyota Prius 2015',
    description: null, price: 18500000, condition: 'used', ad_type: 'sell',
    status: 'approved', is_featured: false, is_sold: false, views: 98, phone: null,
    created_at: '2024-05-20T00:00:00Z', updated_at: '2024-05-20T00:00:00Z',
    category: { id: '', name: 'Автомашин', slug: 'auto', icon: 'Car', parent_id: null, created_at: '' },
    location: { id: '', name: 'Мөрөн сум', slug: 'moron', parent_id: null, created_at: '' },
    ad_images: [],
  },
  {
    id: 'demo-3', user_id: '', category_id: '', location_id: '',
    title: 'iPhone 13 Pro 128GB',
    description: null, price: 2600000, condition: 'used', ad_type: 'sell',
    status: 'approved', is_featured: false, is_sold: false, views: 76, phone: null,
    created_at: '2024-05-20T00:00:00Z', updated_at: '2024-05-20T00:00:00Z',
    category: { id: '', name: 'Цахилгаан бараа', slug: 'electronics', icon: 'Smartphone', parent_id: null, created_at: '' },
    location: { id: '', name: 'Мөрөн сум', slug: 'moron', parent_id: null, created_at: '' },
    ad_images: [],
  },
  {
    id: 'demo-4', user_id: '', category_id: '', location_id: '',
    title: 'Экскаватор түрээслүүлнэ',
    description: null, price: 350000, condition: null, ad_type: 'service',
    status: 'approved', is_featured: false, is_sold: false, views: 64, phone: null,
    created_at: '2024-05-20T00:00:00Z', updated_at: '2024-05-20T00:00:00Z',
    category: { id: '', name: 'Үйлчилгээ', slug: 'uilchilgee', icon: 'Wrench', parent_id: null, created_at: '' },
    location: { id: '', name: 'Мөрөн сум', slug: 'moron', parent_id: null, created_at: '' },
    ad_images: [],
  },
]

export const revalidate = 60

const HELPFUL_LINKS = [
  { icon: Building, label: 'Хөвсгөл аймгийн ЗДТГ', href: 'https://khovsgol.gov.mn/' },
  { icon: FileText, label: 'Татварын хэлтэс', href: 'https://www.mta.gov.mn/home' },
  { icon: Scale, label: 'Гааллийн газар', href: 'https://gaali.mn/' },
  { icon: Scale, label: 'Шүүхийн шийдвэр гүйцэтгэх газар', href: 'https://cd.gov.mn/index/' },
]

const TRUST_ITEMS = [
  { icon: Shield,        title: 'Аюулгүй', desc: 'Хэрэглэгчийн мэдээллийн аюулгүй байдлыг хангана.' },
  { icon: CheckCircle,   title: 'Хялбар',  desc: 'Хялбар интерфэйсээр хурдан хайлт хийнэ.' },
  { icon: Megaphone,     title: 'Үнэгүй',  desc: 'Зар байршуулахад төлбөргүй.' },
  { icon: Clock,         title: 'Хурдан',  desc: 'Таны зар олон хүнд хурдан хүрнэ.' },
]

async function getHomeData() {
  try {
    const supabase = await createClient()
    const [categoriesRes, latestRes] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase
        .from('ads')
        .select('*, category:categories(*), location:locations(*), ad_images(*)')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(4),
    ])
    return {
      categories: (categoriesRes.data || []) as Category[],
      latestAds: (latestRes.data || []) as Ad[],
    }
  } catch {
    return { categories: [] as Category[], latestAds: [] as Ad[] }
  }
}

export default async function HomePage() {
  const { categories: fetchedCats, latestAds: fetchedAds } = await getHomeData()
  const categories = fetchedCats.length > 0 ? fetchedCats : DEMO_CATEGORIES
  const latestAds = fetchedAds.length > 0 ? fetchedAds : DEMO_ADS

  return (
    <>
      <HeroSection />
      <CategoryGrid categories={categories} />

      {/* Main content + sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left: latest ads */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-extrabold uppercase tracking-wide" style={{ color: '#1a3a6b', fontFamily: 'Rubik, sans-serif' }}>
                  Шинэ зарууд
                </h2>
                <div className="h-0.5 w-10 mt-1 rounded" style={{ background: '#e8841a' }} />
              </div>
              <Link href="/search" className="text-sm font-medium hover:underline flex items-center gap-1" style={{ color: '#1a3a6b' }}>
                Бүгдийг харах →
              </Link>
            </div>
            <AdGrid ads={latestAds} cols={2} />
          </div>

          {/* Right sidebar */}
          <div className="lg:w-72 xl:w-80 flex-shrink-0 space-y-4">

            {/* CTA widget */}
            <div className="rounded-xl p-5 text-white" style={{ background: '#1a3a6b' }}>
              <div className="flex items-start gap-3 mb-4">
                <Megaphone size={28} className="flex-shrink-0 mt-0.5 opacity-90" />
                <div>
                  <p className="font-bold text-lg leading-tight">Зараа байршуул</p>
                  <p className="text-sm text-blue-200 mt-0.5">Үнэгүй, хялбар, хурдан</p>
                </div>
              </div>
              <Link
                href="/dashboard/post-ad"
                className="block w-full text-center font-bold py-3 rounded-lg text-sm transition-opacity cursor-pointer"
                style={{ background: '#e8841a', color: '#1a1a1a' }}
              >
                ЗАРАА БАЙРШУУЛАХ
              </Link>
            </div>

            {/* Helpful links widget */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Танд туслах холбоос</h3>
              <ul className="space-y-2">
                {HELPFUL_LINKS.map(({ icon: Icon, label, href }) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#1a3a6b] transition-colors cursor-pointer group">
                      <Icon size={14} className="text-gray-400 group-hover:text-[#1a3a6b] flex-shrink-0" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-gray-50 border-t border-gray-100 py-8 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

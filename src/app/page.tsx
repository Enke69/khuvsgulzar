import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/home/HeroSection'
import CategoryGrid from '@/components/home/CategoryGrid'
import AdGrid from '@/components/ads/AdGrid'
import Link from 'next/link'
import { Megaphone, FileText, Phone, Scale, Building } from 'lucide-react'
import type { Ad, Category } from '@/lib/types'

export const revalidate = 60

const HELPFUL_LINKS = [
  { icon: Building, label: 'Хөвсгөл аймгийн ЗДТГ' },
  { icon: FileText, label: 'Татварын хэлтэс' },
  { icon: Scale, label: 'Гааллийн газар' },
  { icon: Scale, label: 'Шүүхийн шийдвэр гүйцэтгэх газар' },
]

const TRUST_ITEMS = [
  { icon: '🛡️', title: 'Аюулгүй', desc: 'Хэрэглэгчийн мэдээллийн аюулгүй байдлыг хангана.' },
  { icon: '✅', title: 'Хялбар', desc: 'Хялбар интерфэйсээр хурдан хайлт хийнэ.' },
  { icon: '📢', title: 'Үнэгүй', desc: 'Зар байршуулахад төлбөргүй.' },
  { icon: '⚡', title: 'Хурдан', desc: 'Таны зар олон хүнд хурдан хүрнэ.' },
]

async function getHomeData() {
  const supabase = await createClient()

  const [categoriesRes, latestRes] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase
      .from('ads')
      .select('*, category:categories(*), location:locations(*), ad_images(*), profile:profiles(*)')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  return {
    categories: (categoriesRes.data || []) as Category[],
    latestAds: (latestRes.data || []) as Ad[],
  }
}

export default async function HomePage() {
  const { categories, latestAds } = await getHomeData()

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
              <h2 className="text-xl font-bold text-gray-900 border-b-2 pb-1" style={{ borderColor: '#0354c7', fontFamily: 'Rubik, sans-serif' }}>
                Шинэ зарууд
              </h2>
              <Link href="/search" className="text-sm font-medium hover:underline flex items-center gap-1" style={{ color: '#0354c7' }}>
                Бүгдийг харах →
              </Link>
            </div>
            <AdGrid ads={latestAds} />
          </div>

          {/* Right sidebar */}
          <div className="lg:w-72 xl:w-80 flex-shrink-0 space-y-4">

            {/* CTA widget */}
            <div className="rounded-xl p-5 text-white" style={{ background: '#0354c7' }}>
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
                style={{ background: '#ecc34a', color: '#1a1a1a' }}
              >
                ЗАРАА БАЙРШУУЛАХ
              </Link>
            </div>

            {/* Helpful links widget */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Танд туслах холбоос</h3>
              <ul className="space-y-2">
                {HELPFUL_LINKS.map(({ icon: Icon, label }) => (
                  <li key={label}>
                    <a href="#" className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#0354c7] transition-colors cursor-pointer group">
                      <Icon size={14} className="text-gray-400 group-hover:text-[#0354c7] flex-shrink-0" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <a href="#" className="flex items-center gap-1 text-xs mt-4 font-medium hover:underline" style={{ color: '#0354c7' }}>
                Бүгдийг үзэх →
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-gray-50 border-t border-gray-100 py-8 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(item => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-lg flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import AdGrid from '@/components/ads/AdGrid'
import AdFilters from '@/components/ads/AdFilters'
import AdSortBar from '@/components/ads/AdSortBar'
import type { Ad, Category } from '@/lib/types'
import { getFiltersForSlug } from '@/lib/categoryFilters'

const PAGE_SIZE = 20

function CategoryContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const [category, setCategory] = useState<Category | null>(null)
  const [ads, setAds] = useState<Ad[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const supabase = createClient()

  const page = Number(searchParams.get('page') || 1)
  const sort = searchParams.get('sort') || 'newest'
  const priceMin = searchParams.get('price_min')
  const priceMax = searchParams.get('price_max')
  const location = searchParams.get('location')
  const condition = searchParams.get('condition')
  const adType = searchParams.get('ad_type')

  const catFilters = getFiltersForSlug(slug)
  const metaParams = catFilters.map(f => ({ key: f.key, val: searchParams.get(`meta_${f.key}`) })).filter(x => x.val)
  const metaDep = metaParams.map(x => `${x.key}=${x.val}`).join(',')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: cat } = await supabase.from('categories').select('*').eq('slug', slug).single()
      setCategory(cat)

      if (!cat) { setLoading(false); return }

      let query = supabase
        .from('ads')
        .select('*, category:categories(*), location:locations(*), ad_images(*)', { count: 'exact' })
        .eq('status', 'approved')
        .eq('category_id', cat.id)

      if (priceMin) query = query.gte('price', Number(priceMin))
      if (priceMax) query = query.lte('price', Number(priceMax))
      if (location) {
        const { data: loc } = await supabase.from('locations').select('id').eq('name', location).single()
        if (loc) query = query.eq('location_id', loc.id)
      }
      if (condition) query = query.eq('condition', condition)
      if (adType) query = query.eq('ad_type', adType)

      for (const { key, val } of metaParams) {
        if (val) query = query.filter(`metadata->>${key}`, 'eq', val)
      }

      const orderMap: Record<string, { col: string; asc: boolean }> = {
        newest: { col: 'created_at', asc: false },
        oldest: { col: 'created_at', asc: true },
        price_asc: { col: 'price', asc: true },
        price_desc: { col: 'price', asc: false },
        views: { col: 'views', asc: false },
      }
      const { col, asc } = orderMap[sort] || orderMap.newest
      query = query.order(col, { ascending: asc })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

      const { data, count } = await query
      setAds((data || []) as Ad[])
      setTotal(count || 0)
      setLoading(false)
    }
    load()
  }, [slug, page, sort, priceMin, priceMax, location, condition, adType, metaDep])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600 cursor-pointer">Нүүр</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">{category?.name || slug}</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">{category?.name}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 flex-shrink-0">
          <AdFilters categorySlug={slug} />
        </div>
        <div className="flex-1 min-w-0">
          <AdSortBar total={total} view={view} onViewChange={setView} />
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl aspect-[4/5] animate-pulse" />
              ))}
            </div>
          ) : (
            <AdGrid ads={ads} emptyMessage="Энэ ангилалд зар олдсонгүй" />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1
                const params = new URLSearchParams(searchParams.toString())
                params.set('page', String(p))
                return (
                  <Link key={p} href={`?${params.toString()}`}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer
                      ${p === page ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                    {p}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <CategoryContent />
    </Suspense>
  )
}

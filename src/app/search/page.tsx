'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import AdGrid from '@/components/ads/AdGrid'
import AdFilters from '@/components/ads/AdFilters'
import AdSortBar from '@/components/ads/AdSortBar'
import type { Ad } from '@/lib/types'
import Link from 'next/link'

const PAGE_SIZE = 20

function SearchContent() {
  const searchParams = useSearchParams()
  const [ads, setAds] = useState<Ad[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const supabase = createClient()

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const location = searchParams.get('location') || ''
  const sort = searchParams.get('sort') || 'newest'
  const page = Number(searchParams.get('page') || 1)
  const priceMin = searchParams.get('price_min')
  const priceMax = searchParams.get('price_max')
  const condition = searchParams.get('condition')
  const adType = searchParams.get('ad_type')
  const featured = searchParams.get('featured')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const supabase = createClient()

      let query = supabase
        .from('ads')
        .select('*, category:categories(*), location:locations(*), ad_images(*), profile:profiles(*)', { count: 'exact' })
        .eq('status', 'approved')

      if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      if (featured === 'true') query = query.eq('is_featured', true)
      if (priceMin) query = query.gte('price', Number(priceMin))
      if (priceMax) query = query.lte('price', Number(priceMax))
      if (condition) query = query.eq('condition', condition)
      if (adType) query = query.eq('ad_type', adType)

      if (category) {
        const { data: cat } = await supabase.from('categories').select('id').eq('slug', category).single()
        if (cat) query = query.eq('category_id', cat.id)
      }

      const orderMap: Record<string, { col: string; asc: boolean }> = {
        newest: { col: 'created_at', asc: false },
        oldest: { col: 'created_at', asc: true },
        price_asc: { col: 'price', asc: true },
        price_desc: { col: 'price', asc: false },
        views: { col: 'views', asc: false },
      }
      const { col, asc } = orderMap[sort] || orderMap.newest
      query = query.order(col, { ascending: asc }).range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

      const { data, count } = await query
      setAds((data || []) as Ad[])
      setTotal(count || 0)
      setLoading(false)
    }
    load()
  }, [q, category, location, sort, page, priceMin, priceMax, condition, adType, featured])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {q ? `"${q}" хайлтын үр дүн` : 'Бүх зарууд'}
        </h1>
        {(category || location) && (
          <p className="text-gray-500 text-sm mt-1">
            {category && <span className="mr-2">Ангилал: {category}</span>}
            {location && <span>Байршил: {location}</span>}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 flex-shrink-0">
          <AdFilters />
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
            <AdGrid ads={ads} emptyMessage="Хайлтын үр дүн олдсонгүй" />
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => {
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <SearchContent />
    </Suspense>
  )
}

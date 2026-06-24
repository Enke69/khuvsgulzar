'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdGrid from '@/components/ads/AdGrid'
import type { Ad } from '@/lib/types'

export default function FavoritesPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('favorites')
        .select('ad:ads(*, category:categories(*), location:locations(*), ad_images(*), profile:profiles(*))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      const favAds = (data || []).map((f: { ad: unknown }) => f.ad).filter(Boolean) as Ad[]
      setAds(favAds)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Хадгалсан зарууд</h1>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl aspect-[4/5] animate-pulse" />
          ))}
        </div>
      ) : (
        <AdGrid ads={ads} emptyMessage="Хадгалсан зар байхгүй байна" />
      )}
    </div>
  )
}

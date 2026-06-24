'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin, Eye } from 'lucide-react'
import { formatPrice, formatRelativeDate } from '@/lib/utils'
import type { Ad } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

interface Props {
  ad: Ad
  showFavorite?: boolean
}

export default function AdCard({ ad, showFavorite = true }: Props) {
  const [isFav, setIsFav] = useState(false)
  const [toggling, setToggling] = useState(false)
  const supabase = createClient()

  const mainImage = ad.ad_images?.[0]?.image_url

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (toggling) return
    setToggling(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    if (isFav) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('ad_id', ad.id)
      setIsFav(false)
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, ad_id: ad.id })
      setIsFav(true)
    }
    setToggling(false)
  }

  return (
    <Link href={`/ads/${ad.id}`} className="group block bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={ad.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Eye size={28} className="text-gray-300" />
          </div>
        )}

        {/* Category badge top-left */}
        {ad.category && (
          <span
            className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide"
            style={{ background: '#0354c7' }}
          >
            {ad.category.name}
          </span>
        )}

        {/* Favorite button top-right */}
        {showFavorite && (
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-all cursor-pointer"
          >
            <Heart size={14} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1.5">
          {ad.title}
        </h3>

        <div className="font-bold text-base mb-2" style={{ color: '#0354c7' }}>
          {formatPrice(ad.price)}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin size={11} className="flex-shrink-0" />
            <span className="truncate">{ad.location?.name || '—'}</span>
          </span>
          <span>{formatRelativeDate(ad.created_at)}</span>
        </div>

        {ad.views > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-300 mt-1">
            <Eye size={10} />
            <span>{ad.views}</span>
          </div>
        )}
      </div>
    </Link>
  )
}

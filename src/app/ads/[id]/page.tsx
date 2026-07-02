import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Calendar, Eye, Tag, AlertTriangle, ChevronRight, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ImageGallery from '@/components/ads/ImageGallery'
import SellerCard from '@/components/ads/SellerCard'
import AdGrid from '@/components/ads/AdGrid'
import ReportButton from '@/components/ads/ReportButton'
import FavoriteButton from '@/components/ads/FavoriteButton'
import ShareButton from '@/components/ads/ShareButton'
import { formatPrice, formatDate } from '@/lib/utils'
import { AD_CONDITION_LABELS, AD_TYPE_LABELS, AD_STATUS_LABELS } from '@/lib/constants'
import type { Ad } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: ad } = await supabase
    .from('ads')
    .select('title, description, price, ad_images(image_url)')
    .eq('id', id)
    .single()

  if (!ad) return { title: 'Зар олдсонгүй' }

  const image = ad.ad_images?.[0]?.image_url
  return {
    title: `${ad.title} — KhuvsgulZar.mn`,
    description: ad.description?.slice(0, 160) || 'Хөвсгөлийн зарын нэгдсэн платформ',
    openGraph: {
      title: ad.title,
      description: ad.description?.slice(0, 160) || formatPrice(ad.price),
      images: image ? [{ url: image }] : [],
      type: 'website',
    },
  }
}

export default async function AdDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: ad } = await supabase
    .from('ads')
    .select('*, category:categories(*), location:locations(*), ad_images(*)')
    .eq('id', id)
    .single()

  if (!ad || ad.status !== 'approved') notFound()

  // Fetch seller profile separately (ads.user_id → auth.users, not profiles directly)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', ad.user_id)
    .single()

  // Increment views
  await supabase.rpc('increment_ad_views', { ad_id: id })

  // Related ads
  const { data: related } = await supabase
    .from('ads')
    .select('*, category:categories(*), location:locations(*), ad_images(*)')
    .eq('status', 'approved')
    .eq('category_id', ad.category_id)
    .neq('id', id)
    .limit(4)

  const typedAd = ad as Ad

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-blue-600 cursor-pointer">Нүүр</Link>
        <ChevronRight size={14} />
        {typedAd.category && (
          <>
            <Link href={`/categories/${typedAd.category.slug}`} className="hover:text-blue-600 cursor-pointer">
              {typedAd.category.name}
            </Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="text-gray-900 truncate max-w-xs">{typedAd.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: gallery + details */}
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery images={typedAd.ad_images || []} title={typedAd.title} />

          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {typedAd.is_featured && (
                <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Star size={12} /> Онцлох
                </span>
              )}
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                {AD_TYPE_LABELS[typedAd.ad_type]}
              </span>
              {typedAd.condition && (
                <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {AD_CONDITION_LABELS[typedAd.condition]}
                </span>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{typedAd.title}</h1>

            <div className="text-3xl font-bold text-blue-600">{formatPrice(typedAd.price)}</div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {typedAd.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-blue-500" />
                  {typedAd.location.name}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={15} className="text-blue-500" />
                {formatDate(typedAd.created_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={15} className="text-blue-500" />
                {typedAd.views} үзэлт
              </span>
              {typedAd.category && (
                <span className="flex items-center gap-1.5">
                  <Tag size={15} className="text-blue-500" />
                  {typedAd.category.name}
                </span>
              )}
            </div>

            <hr className="border-gray-100" />

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Тайлбар</h3>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {typedAd.description || 'Тайлбар байхгүй.'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 flex-wrap">
            <FavoriteButton adId={typedAd.id} />
            <ShareButton />
            <ReportButton adId={typedAd.id} />
          </div>

          {/* Safety warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
            <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">Аюулгүй байдлын зөвлөмж</p>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Мөнгө урьдчилж шилжүүлэхгүй байна уу</li>
                <li>• Бараа бүтээгдэхүүнийг харж, шалгаад авна уу</li>
                <li>• Хэт хямд үнэтэй зарт болгоомжтой хандаарай</li>
                <li>• Хуурамч зар илэрвэл мэдэгдэнэ үү</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: seller + contact */}
        <div className="space-y-4">
          {profile && (
            <SellerCard
              profile={profile}
              adPhone={typedAd.phone}
              adId={typedAd.id}
            />
          )}

          <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-800">
            <p className="font-semibold mb-1">Зарын ID</p>
            <p className="text-xs text-blue-600 font-mono break-all">{typedAd.id}</p>
          </div>
        </div>
      </div>

      {/* Related ads */}
      {related && related.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Төстэй зарууд</h2>
          <AdGrid ads={related as Ad[]} />
        </div>
      )}
    </div>
  )
}

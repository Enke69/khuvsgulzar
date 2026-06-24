'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { PlusCircle, Edit, Trash2, CheckCircle, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice, formatRelativeDate } from '@/lib/utils'
import { AD_STATUS_LABELS, AD_STATUS_COLORS } from '@/lib/constants'
import type { Ad } from '@/lib/types'

function MyAdsContent() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const submitted = searchParams.get('submitted')
  const supabase = createClient()

  const load = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('ads')
      .select('*, category:categories(*), location:locations(*), ad_images(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setAds((data || []) as Ad[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Энэ зарыг устгахдаа итгэлтэй байна уу?')) return
    setDeleting(id)
    await supabase.from('ads').delete().eq('id', id)
    setAds(prev => prev.filter(a => a.id !== id))
    setDeleting(null)
  }

  const handleMarkSold = async (id: string) => {
    await supabase.from('ads').update({ status: 'sold', is_sold: true }).eq('id', id)
    setAds(prev => prev.map(a => a.id === id ? { ...a, status: 'sold', is_sold: true } : a))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Миний зарууд</h1>
        <Link href="/dashboard/post-ad"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
          <PlusCircle size={16} /> Зар нэмэх
        </Link>
      </div>

      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
          Зар амжилттай илгээгдлээ! Админ зөвшөөрсний дараа нийтлэгдэнэ.
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-20 animate-pulse" />
          ))}
        </div>
      ) : ads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 mb-4">Одоогоор зар байхгүй байна</p>
          <Link href="/dashboard/post-ad"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
            <PlusCircle size={15} /> Анхны зараа нэмэх
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {ads.map(ad => {
            const mainImg = ad.ad_images?.[0]?.image_url
            return (
              <div key={ad.id} className="flex items-center gap-4 p-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  {mainImg ? (
                    <Image src={mainImg} alt={ad.title} width={64} height={64} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/ads/${ad.id}`} className="font-semibold text-sm text-gray-900 hover:text-blue-600 truncate block cursor-pointer">
                    {ad.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${AD_STATUS_COLORS[ad.status]}`}>
                      {AD_STATUS_LABELS[ad.status]}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Eye size={11} />{ad.views} үзэлт
                    </span>
                    <span className="text-xs text-gray-400">{formatRelativeDate(ad.created_at)}</span>
                  </div>
                  <div className="text-sm font-bold text-blue-600 mt-0.5">{formatPrice(ad.price)}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {ad.status === 'approved' && !ad.is_sold && (
                    <button onClick={() => handleMarkSold(ad.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer" title="Зарагдсан гэж тэмдэглэх">
                      <CheckCircle size={17} />
                    </button>
                  )}
                  <Link href={`/dashboard/edit-ad/${ad.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Засах">
                    <Edit size={17} />
                  </Link>
                  <button onClick={() => handleDelete(ad.id)} disabled={deleting === ad.id}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50" title="Устгах">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function MyAdsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <MyAdsContent />
    </Suspense>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, XCircle, Trash2, Star, StarOff, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice, formatRelativeDate } from '@/lib/utils'
import { AD_STATUS_LABELS, AD_STATUS_COLORS } from '@/lib/constants'
import type { Ad } from '@/lib/types'

const STATUSES = ['all', 'pending', 'approved', 'rejected', 'sold', 'draft']
const STATUS_LABELS: Record<string, string> = { all: 'Бүгд', ...AD_STATUS_LABELS }

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const supabase = createClient()

  const load = async () => {
    setLoading(true)
    let q = supabase.from('ads')
      .select('*, category:categories(*), location:locations(*), ad_images(*), profile:profiles(*)')
      .order('created_at', { ascending: false })
      .limit(100)
    if (status !== 'all') q = q.eq('status', status)
    if (search) q = q.ilike('title', `%${search}%`)
    const { data } = await q
    setAds((data || []) as Ad[])
    setLoading(false)
  }

  useEffect(() => { load() }, [status, search])

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('ads').update({ status: newStatus }).eq('id', id)
    // Log
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('admin_logs').insert({
        admin_id: user.id,
        action: newStatus === 'approved' ? 'approve_ad' : 'reject_ad',
        target_type: 'ad',
        target_id: id,
        description: `Зар ${newStatus === 'approved' ? 'зөвшөөрсөн' : 'татгалзсан'}`,
      })
    }
    setAds(prev => prev.map(a => a.id === id ? { ...a, status: newStatus as Ad['status'] } : a))
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('ads').update({ is_featured: !current }).eq('id', id)
    setAds(prev => prev.map(a => a.id === id ? { ...a, is_featured: !current } : a))
  }

  const deleteAd = async (id: string) => {
    if (!confirm('Энэ зарыг устгахдаа итгэлтэй байна уу?')) return
    await supabase.from('ads').delete().eq('id', id)
    setAds(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Зарууд удирдах</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Зарын гарчгаар хайх..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer
                ${status === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'}`}>
              {STATUS_LABELS[s] || s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Зар олдсонгүй</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">ЗАР</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">АНГИЛАЛ</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">ҮНЭ</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">СТАТУС</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">ОГНОО</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-500 font-semibold">ҮЙЛДЭЛ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ads.map(ad => {
                  const img = ad.ad_images?.[0]?.image_url
                  return (
                    <tr key={ad.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {img && <Image src={img} alt={ad.title} width={40} height={40} className="object-cover w-full h-full" />}
                          </div>
                          <div>
                            <Link href={`/ads/${ad.id}`} target="_blank"
                              className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-1 max-w-xs">
                              {ad.title}
                            </Link>
                            <p className="text-xs text-gray-400">{ad.profile?.full_name || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{ad.category?.name || '—'}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900 text-xs">{formatPrice(ad.price)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${AD_STATUS_COLORS[ad.status]}`}>
                          {AD_STATUS_LABELS[ad.status]}
                        </span>
                        {ad.is_featured && <span className="ml-1 text-xs text-amber-600">★</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{formatRelativeDate(ad.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          {ad.status === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(ad.id, 'approved')}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg cursor-pointer" title="Зөвшөөрөх">
                                <CheckCircle size={16} />
                              </button>
                              <button onClick={() => updateStatus(ad.id, 'rejected')}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer" title="Татгалзах">
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                          {ad.status === 'rejected' && (
                            <button onClick={() => updateStatus(ad.id, 'approved')}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg cursor-pointer" title="Зөвшөөрөх">
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button onClick={() => toggleFeatured(ad.id, ad.is_featured)}
                            className={`p-1.5 rounded-lg cursor-pointer ${ad.is_featured ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-400 hover:bg-gray-100'}`}
                            title={ad.is_featured ? 'Онцлох болгохгүй' : 'Онцлох болгох'}>
                            {ad.is_featured ? <StarOff size={16} /> : <Star size={16} />}
                          </button>
                          <button onClick={() => deleteAd(ad.id)}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg cursor-pointer" title="Устгах">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

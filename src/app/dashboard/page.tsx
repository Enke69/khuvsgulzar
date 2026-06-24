import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FileText, Eye, CheckCircle, Clock, PlusCircle } from 'lucide-react'
import { AD_STATUS_LABELS, AD_STATUS_COLORS } from '@/lib/constants'

export default async function DashboardOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: ads } = await supabase
    .from('ads')
    .select('id, status, views, title, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allAds = ads || []
  const statusCounts = {
    approved: allAds.filter(a => a.status === 'approved').length,
    pending: allAds.filter(a => a.status === 'pending').length,
    rejected: allAds.filter(a => a.status === 'rejected').length,
    draft: allAds.filter(a => a.status === 'draft').length,
    sold: allAds.filter(a => a.status === 'sold').length,
  }
  const totalViews = allAds.reduce((s, a) => s + (a.views || 0), 0)

  const stats = [
    { label: 'Нийт зар', value: allAds.length, icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: 'Нийт үзэлт', value: totalViews, icon: Eye, color: 'text-purple-600 bg-purple-50' },
    { label: 'Идэвхтэй', value: statusCounts.approved, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: 'Хүлээгдэж буй', value: statusCounts.pending, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Тойм</h1>
        <Link href="/dashboard/post-ad"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
          <PlusCircle size={16} /> Зар нэмэх
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent ads */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900">Сүүлийн зарууд</h2>
          <Link href="/dashboard/my-ads" className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
            Бүгдийг харах →
          </Link>
        </div>

        {allAds.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 mb-4">Одоогоор зар байхгүй байна</p>
            <Link href="/dashboard/post-ad"
              className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
              <PlusCircle size={15} /> Анхны зараа нэмэх
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {allAds.slice(0, 5).map(ad => (
              <div key={ad.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex-1 min-w-0 pr-4">
                  <Link href={`/ads/${ad.id}`} className="font-medium text-sm text-gray-900 hover:text-blue-600 truncate block cursor-pointer">
                    {ad.title}
                  </Link>
                  <span className="text-xs text-gray-400">{ad.views} үзэлт</span>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${AD_STATUS_COLORS[ad.status]}`}>
                  {AD_STATUS_LABELS[ad.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

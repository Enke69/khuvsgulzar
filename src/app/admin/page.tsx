import { createClient } from '@/lib/supabase/server'
import AdminCharts from '@/components/admin/AdminCharts'
import { Users, FileText, Clock, CheckCircle, XCircle, ShoppingBag, Eye, AlertTriangle, TrendingUp } from 'lucide-react'

async function getStats() {
  const supabase = await createClient()

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [usersRes, adsRes, pendingRes, approvedRes, rejectedRes, soldRes, viewsRes,
    newUsersRes, newAdsRes, reportsRes, adsByDayRes, catDistRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('ads').select('id', { count: 'exact', head: true }),
    supabase.from('ads').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('ads').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('ads').select('id', { count: 'exact', head: true }).eq('status', 'rejected'),
    supabase.from('ads').select('id', { count: 'exact', head: true }).eq('status', 'sold'),
    supabase.from('ads').select('views'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', oneWeekAgo),
    supabase.from('ads').select('id', { count: 'exact', head: true }).gte('created_at', oneWeekAgo),
    supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('ads').select('created_at').gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()).order('created_at'),
    supabase.from('ads').select('category:categories(name)').eq('status', 'approved'),
  ])

  const totalViews = (viewsRes.data || []).reduce((s: number, a: { views: number }) => s + (a.views || 0), 0)

  // Build ads by day
  const adsByDay: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    adsByDay[d.toLocaleDateString('en-CA')] = 0
  }
  for (const ad of (adsByDayRes.data || [])) {
    const d = new Date(ad.created_at).toLocaleDateString('en-CA')
    if (d in adsByDay) adsByDay[d]++
  }
  const chartAdsByDay = Object.entries(adsByDay).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString('mn-MN', { month: 'short', day: 'numeric' }),
    зар: count,
  }))

  // Category distribution
  const catCount: Record<string, number> = {}
  for (const ad of (catDistRes.data || [])) {
    const cat = ad.category as unknown as { name: string } | null
    const name = cat?.name || 'Бусад'
    catCount[name] = (catCount[name] || 0) + 1
  }
  const chartCatDist = Object.entries(catCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }))

  return {
    totalUsers: usersRes.count || 0,
    totalAds: adsRes.count || 0,
    pendingAds: pendingRes.count || 0,
    approvedAds: approvedRes.count || 0,
    rejectedAds: rejectedRes.count || 0,
    soldAds: soldRes.count || 0,
    totalViews,
    newUsers: newUsersRes.count || 0,
    newAds: newAdsRes.count || 0,
    pendingReports: reportsRes.count || 0,
    chartAdsByDay,
    chartCatDist,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  const statCards = [
    { label: 'Нийт хэрэглэгч', value: stats.totalUsers, icon: Users, color: 'text-blue-600 bg-blue-50', sub: `+${stats.newUsers} энэ долоо хоног` },
    { label: 'Нийт зар', value: stats.totalAds, icon: FileText, color: 'text-purple-600 bg-purple-50', sub: `+${stats.newAds} энэ долоо хоног` },
    { label: 'Хүлээгдэж буй', value: stats.pendingAds, icon: Clock, color: 'text-yellow-600 bg-yellow-50', sub: 'Зөвшөөрөл хүлээж байна' },
    { label: 'Зөвшөөрсөн', value: stats.approvedAds, icon: CheckCircle, color: 'text-green-600 bg-green-50', sub: 'Идэвхтэй зарууд' },
    { label: 'Татгалзсан', value: stats.rejectedAds, icon: XCircle, color: 'text-red-600 bg-red-50', sub: 'Цуцалсан зарууд' },
    { label: 'Зарагдсан', value: stats.soldAds, icon: ShoppingBag, color: 'text-teal-600 bg-teal-50', sub: 'Амжилттай борлуулсан' },
    { label: 'Нийт үзэлт', value: stats.totalViews, icon: Eye, color: 'text-indigo-600 bg-indigo-50', sub: 'Нийт харалтын тоо' },
    { label: 'Гомдол', value: stats.pendingReports, icon: AlertTriangle, color: 'text-orange-600 bg-orange-50', sub: 'Шийдвэрлэгдээгүй' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Админ самбар</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</div>
            <div className="text-sm font-medium text-gray-700 mt-0.5">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <AdminCharts adsByDay={stats.chartAdsByDay} catDist={stats.chartCatDist} />
    </div>
  )
}

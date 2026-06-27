'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatRelativeDate } from '@/lib/utils'
import type { Report } from '@/lib/types'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Хүлээгдэж буй',
  resolved: 'Шийдвэрлэсэн',
  dismissed: 'Орхисон',
}
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  dismissed: 'bg-gray-100 text-gray-600',
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const supabase = createClient()

  const load = async () => {
    setLoading(true)
    let q = supabase
      .from('reports')
      .select('*, ad:ads(id, title)')
      .order('created_at', { ascending: false })
    if (filter !== 'all') q = q.eq('status', filter)
    const { data } = await q
    setReports((data || []) as Report[])
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('reports').update({ status }).eq('id', id)
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: status as Report['status'] } : r))
  }

  const deleteAdFromReport = async (adId: string, reportId: string) => {
    if (!confirm('Зарыг бүрмөсөн устгах уу?')) return
    await supabase.from('ads').delete().eq('id', adId)
    await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId)
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r))
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Гомдол / Тайлан</h1>

      <div className="flex gap-2">
        {['pending', 'resolved', 'dismissed', 'all'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer
              ${filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'}`}>
            {s === 'all' ? 'Бүгд' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Гомдол олдсонгүй</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">ЗАР</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">ШАЛТГААН</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">МЭДЭГДЭГЧ</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">ОГНОО</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">СТАТУС</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 font-semibold">ҮЙЛДЭЛ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reports.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {r.ad ? (
                      <Link href={`/ads/${r.ad_id}`} target="_blank"
                        className="text-blue-600 hover:underline font-medium text-xs cursor-pointer">
                        {(r.ad as { title: string }).title}
                      </Link>
                    ) : <span className="text-xs text-gray-400">Устгагдсан зар</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-700">{r.reason}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {r.user_id?.slice(0, 8) || '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{formatRelativeDate(r.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[r.status]}`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      {r.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(r.id, 'resolved')}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg cursor-pointer" title="Шийдвэрлэсэн">
                            <CheckCircle size={16} />
                          </button>
                          <button onClick={() => updateStatus(r.id, 'dismissed')}
                            className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg cursor-pointer" title="Орхих">
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      {r.ad && (
                        <button onClick={() => deleteAdFromReport(r.ad_id, r.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer" title="Зарыг устгах">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Flag, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { REPORT_REASONS } from '@/lib/constants'

interface Props {
  adId: string
}

export default function ReportButton({ adId }: Props) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleReport = async () => {
    if (!reason) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setSubmitting(true)
    await supabase.from('reports').insert({
      ad_id: adId,
      reporter_id: user.id,
      reason,
      description: description || null,
    })
    setDone(true)
    setSubmitting(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-red-500 font-medium text-sm transition-all cursor-pointer"
      >
        <Flag size={16} />
        Гомдол гаргах
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">Зар мэдээлэх</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {done ? (
              <div className="text-center py-6">
                <p className="text-green-600 font-semibold mb-2">Гомдол амжилттай илгээгдлээ!</p>
                <p className="text-gray-500 text-sm mb-4">Бид удахгүй шалгах болно.</p>
                <button onClick={() => { setOpen(false); setDone(false) }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm cursor-pointer hover:bg-blue-700">
                  Хаах
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Шалтгаан</label>
                  <div className="space-y-2">
                    {REPORT_REASONS.map(r => (
                      <label key={r} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="reason" value={r} checked={reason === r}
                          onChange={() => setReason(r)} className="text-blue-600" />
                        <span className="text-sm text-gray-700">{r}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Нэмэлт тайлбар (заавал биш)</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Дэлгэрэнгүй мэдээлэл..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setOpen(false)}
                    className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 cursor-pointer">
                    Болих
                  </button>
                  <button onClick={handleReport} disabled={!reason || submitting}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer">
                    {submitting ? 'Илгээж байна...' : 'Мэдэгдэх'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

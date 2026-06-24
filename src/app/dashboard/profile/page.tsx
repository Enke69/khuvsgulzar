'use client'

import { useState, useEffect } from 'react'
import { User, Phone, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
      if (data) {
        setProfile(data)
        setFullName(data.full_name || '')
        setPhone(data.phone || '')
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    if (!fullName.trim()) { setError('Нэр заавал байх ёстой'); return }
    setSaving(true)
    setError('')
    const { error: err } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone: phone || null })
      .eq('id', profile?.id)
    if (err) { setError('Хадгалахад алдаа гарлаа'); setSaving(false); return }
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Профайл</h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={28} className="text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">{profile?.full_name || 'Хэрэглэгч'}</p>
            <p className="text-sm text-gray-400">{profile?.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}</p>
          </div>
        </div>

        <div className="space-y-5 max-w-md">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Нэр <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Таны нэр"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Утасны дугаар</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+976 9900-0000"
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl">
              Профайл амжилттай хадгалагдлаа!
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer text-sm"
          >
            <Save size={16} />
            {saving ? 'Хадгалж байна...' : 'Хадгалах'}
          </button>
        </div>
      </div>
    </div>
  )
}

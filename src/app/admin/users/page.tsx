'use client'

import { useState, useEffect } from 'react'
import { Ban, CheckCircle, Shield, User, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Profile } from '@/lib/types'

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  const load = async () => {
    setLoading(true)
    let q = supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(200)
    if (search) q = q.ilike('full_name', `%${search}%`)
    const { data } = await q
    setProfiles(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [search])

  const toggleBan = async (id: string, currentBanned: boolean) => {
    await supabase.from('profiles').update({ is_banned: !currentBanned }).eq('id', id)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('admin_logs').insert({
        admin_id: user.id,
        action: currentBanned ? 'unban_user' : 'ban_user',
        target_type: 'user',
        target_id: id,
        description: `Хэрэглэгч ${currentBanned ? 'хориог арилгасан' : 'хориглосон'}`,
      })
    }
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, is_banned: !currentBanned } : p))
  }

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    await supabase.from('profiles').update({ role: newRole }).eq('id', id)
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, role: newRole as Profile['role'] } : p))
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Хэрэглэгчид</h1>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Нэрээр хайх..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-400"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">ХЭРЭГЛЭГЧ</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">УТАС</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">РОЛЬ</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">СТАТУС</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">ОГНОО</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-500 font-semibold">ҮЙЛДЭЛ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {profiles.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User size={16} className="text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{p.full_name || 'Нэргүй'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{p.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                        {p.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.is_banned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {p.is_banned ? 'Хориглосон' : 'Идэвхтэй'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{formatDate(p.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => toggleBan(p.id, p.is_banned)}
                          className={`p-1.5 rounded-lg cursor-pointer ${p.is_banned ? 'text-green-600 hover:bg-green-50' : 'text-red-500 hover:bg-red-50'}`}
                          title={p.is_banned ? 'Хориог арилгах' : 'Хориглох'}>
                          {p.is_banned ? <CheckCircle size={16} /> : <Ban size={16} />}
                        </button>
                        <button onClick={() => toggleRole(p.id, p.role)}
                          className="p-1.5 text-purple-500 hover:bg-purple-50 rounded-lg cursor-pointer"
                          title={p.role === 'admin' ? 'Хэрэглэгч болгох' : 'Админ болгох'}>
                          <Shield size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

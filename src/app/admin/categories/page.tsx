'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/types'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [icon, setIcon] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setName(''); setSlug(''); setIcon(''); setModalOpen(true) }
  const openEdit = (c: Category) => { setEditing(c); setName(c.name); setSlug(c.slug); setIcon(c.icon || ''); setModalOpen(true) }

  const handleSave = async () => {
    if (!name.trim() || !slug.trim()) return
    setSaving(true)
    if (editing) {
      await supabase.from('categories').update({ name, slug, icon: icon || null }).eq('id', editing.id)
    } else {
      await supabase.from('categories').insert({ name, slug, icon: icon || null })
    }
    setSaving(false)
    setModalOpen(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Энэ ангиллыг устгахдаа итгэлтэй байна уу?')) return
    await supabase.from('categories').delete().eq('id', id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Ангилал удирдах</h1>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
          <Plus size={16} /> Ангилал нэмэх
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">НЭР</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">SLUG</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">ICON</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500 font-semibold">ҮЙЛДЭЛ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.icon || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => openEdit(c)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">{editing ? 'Ангилал засах' : 'Ангилал нэмэх'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Нэр</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Ангиллын нэр"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Slug</label>
                <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="angilliin-slug"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 font-mono" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Icon (Lucide нэр)</label>
                <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="Car, Building2, ..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalOpen(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50">Болих</button>
              <button onClick={handleSave} disabled={saving || !name || !slug}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-semibold cursor-pointer">
                {saving ? 'Хадгалж байна...' : 'Хадгалах'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

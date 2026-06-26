'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AdFormData } from './PostAdWizard'
import type { Location } from '@/lib/types'
import { AD_CONDITION_LABELS, AD_TYPE_LABELS } from '@/lib/constants'
import { getFiltersForSlug } from '@/lib/categoryFilters'

interface Props {
  data: AdFormData
  update: (patch: Partial<AdFormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepDetails({ data, update, onNext, onBack }: Props) {
  const [locations, setLocations] = useState<Location[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const supabase = createClient()
  const catFilters = getFiltersForSlug(data.category_slug || '')
  const setMeta = (key: string, val: string) =>
    update({ metadata: { ...data.metadata, [key]: val } })

  useEffect(() => {
    supabase.from('locations').select('*').order('name').then(({ data: locs }) => {
      setLocations(locs || [])
    })
  }, [])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!data.title.trim()) errs.title = 'Гарчиг заавал байх ёстой'
    if (data.title.trim().length < 5) errs.title = 'Гарчиг хамгийн багадаа 5 тэмдэгт байна'
    if (!data.location_id) errs.location = 'Байршил сонгоно уу'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (validate()) onNext()
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Зарын мэдээлэл</h2>
      <p className="text-gray-500 text-sm mb-6">Зарынхаа дэлгэрэнгүй мэдээллийг оруулна уу</p>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Гарчиг <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.title}
            onChange={e => update({ title: e.target.value })}
            placeholder="Жишээ: 2020 Toyota Camry, Улаанбаатар"
            maxLength={100}
            className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
              ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Тайлбар</label>
          <textarea
            value={data.description}
            onChange={e => update({ description: e.target.value })}
            placeholder="Барааны тухай дэлгэрэнгүй бичнэ үү..."
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
          />
        </div>

        {/* Category-specific fields */}
        {catFilters.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{f.label}</label>
            {f.type === 'select' ? (
              <select
                value={data.metadata?.[f.key] || ''}
                onChange={e => setMeta(f.key, e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
              >
                <option value="">Сонгоно уу</option>
                {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <div className="flex flex-wrap gap-2">
                {f.options.map(o => (
                  <button key={o.value} type="button"
                    onClick={() => setMeta(f.key, o.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors cursor-pointer
                      ${data.metadata?.[f.key] === o.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Үнэ (₮)</label>
          <input
            type="number"
            value={data.price}
            onChange={e => update({ price: e.target.value })}
            placeholder="Үнэ оруулна уу (хоосон бол тохиролцоно)"
            min="0"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        {/* Ad type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Зарын төрөл</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(AD_TYPE_LABELS).map(([val, label]) => (
              <button
                key={val}
                onClick={() => update({ ad_type: val })}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors cursor-pointer
                  ${data.ad_type === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Байдал</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(AD_CONDITION_LABELS).map(([val, label]) => (
              <button
                key={val}
                onClick={() => update({ condition: val })}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors cursor-pointer
                  ${data.condition === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Байршил <span className="text-red-500">*</span>
          </label>
          <select
            value={data.location_id}
            onChange={e => {
              const loc = locations.find(l => l.id === e.target.value)
              update({ location_id: e.target.value, location_name: loc?.name || '' })
            }}
            className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer
              ${errors.location ? 'border-red-400' : 'border-gray-200'}`}
          >
            <option value="">Байршил сонгоно уу</option>
            {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={onBack}
          className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-sm">
          ← Буцах
        </button>
        <button onClick={handleNext}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer text-sm">
          Үргэлжлүүлэх →
        </button>
      </div>
    </div>
  )
}

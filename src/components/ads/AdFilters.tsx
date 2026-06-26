'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { LOCATIONS, AD_CONDITION_LABELS, AD_TYPE_LABELS } from '@/lib/constants'
import { getFiltersForSlug } from '@/lib/categoryFilters'

interface Props { categorySlug?: string }

const NO_CONDITION_SLUGS = new Set(['jobs', 'ajil', 'services'])

export default function AdFilters({ categorySlug }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const catFilters = categorySlug ? getFiltersForSlug(categorySlug) : []

  const [priceMin, setPriceMin] = useState(searchParams.get('price_min') || '')
  const [priceMax, setPriceMax] = useState(searchParams.get('price_max') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [condition, setCondition] = useState(searchParams.get('condition') || '')
  const [adType, setAdType] = useState(searchParams.get('ad_type') || '')
  const [metaValues, setMetaValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const f of catFilters) init[f.key] = searchParams.get(`meta_${f.key}`) || ''
    return init
  })

  const setMeta = (key: string, val: string) =>
    setMetaValues(prev => ({ ...prev, [key]: val }))

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (priceMin) params.set('price_min', priceMin); else params.delete('price_min')
    if (priceMax) params.set('price_max', priceMax); else params.delete('price_max')
    if (location) params.set('location', location); else params.delete('location')
    if (condition) params.set('condition', condition); else params.delete('condition')
    if (adType) params.set('ad_type', adType); else params.delete('ad_type')
    for (const f of catFilters) {
      const v = metaValues[f.key]
      if (v) params.set(`meta_${f.key}`, v); else params.delete(`meta_${f.key}`)
    }
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    setPriceMin(''); setPriceMax(''); setLocation(''); setCondition(''); setAdType('')
    const cleared: Record<string, string> = {}
    for (const f of catFilters) cleared[f.key] = ''
    setMetaValues(cleared)
    const params = new URLSearchParams()
    const q = searchParams.get('q'); if (q) params.set('q', q)
    const cat = searchParams.get('category'); if (cat) params.set('category', cat)
    router.push(`?${params.toString()}`)
  }

  return (
    <aside className="bg-white rounded-2xl border border-gray-100 p-5 space-y-6 sticky top-20">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-blue-600" /> Шүүлтүүр
        </h3>
        <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 cursor-pointer">
          <X size={12} /> Цэвэрлэх
        </button>
      </div>

      {/* Category-specific filters */}
      {catFilters.map(f => (
        <div key={f.key}>
          <label className="text-sm font-semibold text-gray-700 block mb-3">{f.label}</label>
          {f.type === 'select' ? (
            <select value={metaValues[f.key] || ''} onChange={e => setMeta(f.key, e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 cursor-pointer">
              <option value="">Бүгд</option>
              {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : (
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name={f.key} value="" checked={!metaValues[f.key]} onChange={() => setMeta(f.key, '')} className="text-blue-600" />
                <span className="text-sm text-gray-700">Бүгд</span>
              </label>
              {f.options.map(o => (
                <label key={o.value} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name={f.key} value={o.value} checked={metaValues[f.key] === o.value} onChange={() => setMeta(f.key, o.value)} className="text-blue-600" />
                  <span className="text-sm text-gray-700">{o.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Price */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-3">Үнэ (₮)</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Доод" value={priceMin} onChange={e => setPriceMin(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
          <input type="number" placeholder="Дээд" value={priceMax} onChange={e => setPriceMax(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-3">Байршил</label>
        <select value={location} onChange={e => setLocation(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 cursor-pointer">
          <option value="">Бүх байршил</option>
          {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Condition — hidden for jobs/services */}
      {!NO_CONDITION_SLUGS.has(categorySlug ?? '') && (
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-3">Байдал</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="condition" value="" checked={condition === ''} onChange={() => setCondition('')} className="text-blue-600" />
              <span className="text-sm text-gray-700">Бүгд</span>
            </label>
            {Object.entries(AD_CONDITION_LABELS).map(([val, label]) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="condition" value={val} checked={condition === val} onChange={() => setCondition(val)} className="text-blue-600" />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Ad type */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-3">Зарын төрөл</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="ad_type" value="" checked={adType === ''} onChange={() => setAdType('')} className="text-blue-600" />
            <span className="text-sm text-gray-700">Бүгд</span>
          </label>
          {Object.entries(AD_TYPE_LABELS).map(([val, label]) => (
            <label key={val} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="ad_type" value={val} checked={adType === val} onChange={() => setAdType(val)} className="text-blue-600" />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={applyFilters}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-sm">
        Хайх
      </button>
    </aside>
  )
}

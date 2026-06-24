'use client'

import Image from 'next/image'
import { MapPin, Phone, Tag, Layers } from 'lucide-react'
import type { AdFormData } from './PostAdWizard'
import { formatPrice } from '@/lib/utils'
import { AD_CONDITION_LABELS, AD_TYPE_LABELS } from '@/lib/constants'

interface Props {
  data: AdFormData
  onBack: () => void
  onSubmit: () => void
  submitting: boolean
  error: string
}

export default function StepPreview({ data, onBack, onSubmit, submitting, error }: Props) {
  const previewUrl = data.images.length > 0 ? URL.createObjectURL(data.images[0]) : null

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Урьдчилан харах</h2>
      <p className="text-gray-500 text-sm mb-6">Зараа нийтлэхийн өмнө шалгаарай</p>

      <div className="border border-gray-100 rounded-2xl overflow-hidden mb-6">
        {/* Image */}
        <div className="aspect-video bg-gray-100 relative">
          {previewUrl ? (
            <Image src={previewUrl} alt="preview" fill className="object-cover" sizes="600px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              Зураг байхгүй
            </div>
          )}
          {data.images.length > 1 && (
            <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              +{data.images.length - 1} зураг
            </span>
          )}
        </div>

        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
              {AD_TYPE_LABELS[data.ad_type] || data.ad_type}
            </span>
            {data.condition && (
              <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                {AD_CONDITION_LABELS[data.condition]}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900">{data.title || '—'}</h3>

          <div className="text-2xl font-bold text-blue-600">
            {formatPrice(data.price ? Number(data.price) : null)}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-blue-500" />
              <span>{data.category_name || '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-500" />
              <span>{data.location_name || '—'}</span>
            </div>
            {data.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-blue-500" />
                <span>{data.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-blue-500" />
              <span>{data.images.length} зураг</span>
            </div>
          </div>

          {data.description && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Тайлбар</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line line-clamp-3">
                {data.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 mb-6">
        Зар нийтлэгдсэний дараа админ шалгаж зөвшөөрнө. Хянах хугацаа 24 цаг хүртэл болно.
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} disabled={submitting}
          className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-sm disabled:opacity-50">
          ← Буцах
        </button>
        <button onClick={onSubmit} disabled={submitting}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer text-sm flex items-center justify-center gap-2">
          {submitting ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Илгээж байна...</>
          ) : 'Зар нийтлэх'}
        </button>
      </div>
    </div>
  )
}

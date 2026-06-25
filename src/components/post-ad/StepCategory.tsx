import { Package } from 'lucide-react'
import type { AdFormData } from './PostAdWizard'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/types'
import { CATEGORY_ICON_MAP } from '@/lib/icons'

interface Props {
  data: AdFormData
  update: (patch: Partial<AdFormData>) => void
  onNext: () => void
}

export default function StepCategory({ data, update, onNext }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data: cats }) => {
      setCategories(cats || [])
    })
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Ангилал сонгох</h2>
      <p className="text-gray-500 text-sm mb-6">Зарынхаа ангиллыг сонгоно уу</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {categories.map(cat => {
          const Icon = CATEGORY_ICON_MAP[cat.icon || 'Package'] || Package
          const selected = data.category_id === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => update({ category_id: cat.id, category_name: cat.name })}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer text-left
                ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Icon size={22} className={selected ? 'text-blue-600' : 'text-gray-500'} />
              </div>
              <span className={`text-xs font-semibold text-center leading-tight ${selected ? 'text-blue-700' : 'text-gray-700'}`}>
                {cat.name}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!data.category_id}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition-colors cursor-pointer text-sm"
        >
          Үргэлжлүүлэх →
        </button>
      </div>
    </div>
  )
}

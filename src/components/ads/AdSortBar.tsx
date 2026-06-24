'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { LayoutGrid, List } from 'lucide-react'
import { SORT_OPTIONS } from '@/lib/constants'

interface Props {
  total: number
  view: 'grid' | 'list'
  onViewChange: (v: 'grid' | 'list') => void
}

export default function AdSortBar({ total, view, onViewChange }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') || 'newest'

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-800">{total}</span> зар олдлоо
      </p>
      <div className="flex items-center gap-3">
        <select
          value={sort}
          onChange={e => handleSort(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400 cursor-pointer"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => onViewChange('grid')}
            className={`p-2 transition-colors cursor-pointer ${view === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={`p-2 transition-colors cursor-pointer ${view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

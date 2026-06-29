'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Package, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Category } from '@/lib/types'
import { CATEGORY_ICON_MAP } from '@/lib/icons'

interface Props {
  categories: Category[]
}

export default function CategoryGrid({ categories }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sorted = [...categories].sort((a, b) =>
    a.name === 'Бусад' ? 1 : b.name === 'Бусад' ? -1 : 0
  )

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  return (
    <section className="bg-white border-b border-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>

        <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide px-10">
          {sorted.map(cat => {
            const Icon = CATEGORY_ICON_MAP[cat.icon || 'Package'] || Package
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col items-center gap-2 py-4 bg-white hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-[#1a3a6b] transition-all duration-150 cursor-pointer w-[96px] flex-shrink-0"
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center transition-colors duration-150"
                  style={{ background: '#eef2f9' }}
                >
                  <Icon size={22} className="group-hover:scale-110 transition-transform duration-150 text-[#1a3a6b]" />
                </div>
                <span className="text-xs font-semibold text-gray-800 group-hover:text-[#1a3a6b] text-center leading-tight transition-colors px-1 w-full">
                  {cat.name}
                </span>
              </Link>
            )
          })}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>
    </section>
  )
}

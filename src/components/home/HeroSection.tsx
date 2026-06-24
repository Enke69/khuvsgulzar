'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Megaphone, Building, Hotel, Home } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

const QUICK_LINKS = [
  { icon: Megaphone, label: 'Зар байршуулах', href: '/dashboard/post-ad' },
  { icon: Building, label: 'Байр захиалах', href: '/categories/ul-hodloh' },
  { icon: Hotel, label: 'Зочид буудал', href: '/search?q=зочид буудал' },
  { icon: Home, label: 'Гэр түрээс', href: '/search?q=гэр түрээс' },
]

export default function HeroSection() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword) params.set('q', keyword)
    if (category) params.set('category', category)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden" style={{ minHeight: 340 }}>
      {/* Hero background — place your landscape image at public/hero-bg.jpg */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/homepage%20bg.png'), linear-gradient(160deg, #1a3a6b 0%, #2a5298 40%, #3a74c4 70%, #7a9fd4 100%)",
        }}
      />
      {/* Subtle dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-16 pb-0 text-center">
        {/* Search bar */}
        <form onSubmit={handleSearch}
          className="flex items-center bg-white rounded-xl shadow-2xl overflow-hidden mb-0 mx-auto max-w-2xl">
          <div className="flex items-center flex-1 px-4 py-3.5 gap-3">
            <Search size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Юу хайж байна вэ?"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-sm min-w-0 bg-transparent"
            />
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="px-3">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="outline-none text-gray-600 text-sm bg-transparent cursor-pointer pr-1 py-3.5"
            >
              <option value="">Бүгд</option>
              {CATEGORIES.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="text-white font-bold px-7 py-3.5 text-sm transition-opacity cursor-pointer"
            style={{ background: '#1a3a6b' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
          >
            ХАЙХ
          </button>
        </form>
      </div>

      {/* Quick links bar */}
      <div className="relative z-10 mt-6 pb-0">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-center gap-6 flex-wrap pb-10">
            {QUICK_LINKS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-2 text-white text-sm font-semibold hover:text-[#e8841a] transition-colors cursor-pointer"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
              >
                <Icon size={16} />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

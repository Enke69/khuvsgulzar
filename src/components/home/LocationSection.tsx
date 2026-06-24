import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { LOCATIONS } from '@/lib/constants'

export default function LocationSection() {
  const featured = LOCATIONS.slice(0, 8)
  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Rubik, sans-serif' }}>
            Байршлаар хайх
          </h2>
          <p className="text-gray-500 mt-2">Монголын бүх аймаг дүүргийн зарууд</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {featured.map(loc => (
            <Link
              key={loc}
              href={`/search?location=${encodeURIComponent(loc)}`}
              className="flex items-center gap-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl px-4 py-3 transition-all cursor-pointer group"
            >
              <MapPin size={16} className="text-blue-500 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{loc}</span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/search" className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer">
            Бүх байршил харах →
          </Link>
        </div>
      </div>
    </section>
  )
}

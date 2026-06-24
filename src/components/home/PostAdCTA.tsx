import Link from 'next/link'
import { Plus, ArrowRight } from 'lucide-react'

export default function PostAdCTA() {
  return (
    <section className="py-14 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>
              Зараа одоо нийтлээрэй!
            </h2>
            <p className="text-blue-100 mt-2">
              Мянга мянган худалдан авагчид таны зарыг хүлээж байна
            </p>
          </div>
          <Link
            href="/dashboard/post-ad"
            className="flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer text-sm shadow-lg flex-shrink-0"
          >
            <Plus size={18} />
            Зар нэмэх
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

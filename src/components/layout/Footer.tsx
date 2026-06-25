import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="mb-4">
              <span className="text-xl font-extrabold tracking-tight" style={{ fontFamily: 'Rubik, sans-serif' }}>
                <span style={{ color: '#7a9fd4' }}>Khuvsgul</span><span style={{ color: '#e8841a' }}>Zar</span><span style={{ color: '#7a9fd4' }}>.mn</span>
              </span>
              <p className="text-xs text-gray-500 mt-0.5">Хөвсгөлийн зарын нэгдсэн платформ</p>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Хөвсгөл аймгийн хамгийн том зар сурталчилгааны платформ. Аюулгүй, хурдан, найдвартай.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Ангилал</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categories/real-estate" className="hover:text-white transition-colors cursor-pointer">Үл хөдлөх хөрөнгө</Link></li>
              <li><Link href="/categories/vehicles" className="hover:text-white transition-colors cursor-pointer">Автомашин</Link></li>
              <li><Link href="/categories/electronics" className="hover:text-white transition-colors cursor-pointer">Электроник</Link></li>
              <li><Link href="/categories/jobs" className="hover:text-white transition-colors cursor-pointer">Ажлын байр</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors cursor-pointer">Бүх ангилал →</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Холбоос</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard/post-ad" className="hover:text-white transition-colors cursor-pointer">Зар нэмэх</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors cursor-pointer">Миний самбар</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors cursor-pointer">Нэвтрэх</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors cursor-pointer">Бүртгүүлэх</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Мэдээлэл</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-400">Утас: +976 9947-9978</span></li>
              <li><span className="text-gray-400">Имэйл: info@khuvsgulzar.mn</span></li>
              <li><span className="text-gray-400">Хөвсгөл, Монгол</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm text-gray-500">© 2026 KhuvsgulZar.mn. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span className="hover:text-gray-300 cursor-pointer">Нууцлалын бодлого</span>
            <span className="hover:text-gray-300 cursor-pointer">Үйлчилгээний нөхцөл</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

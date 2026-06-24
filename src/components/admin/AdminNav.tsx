'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, Users, Tag, MapPin, Flag, ScrollText, ArrowLeft
} from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Самбар', icon: LayoutDashboard, exact: true },
  { href: '/admin/ads', label: 'Зарууд', icon: FileText },
  { href: '/admin/users', label: 'Хэрэглэгчид', icon: Users },
  { href: '/admin/categories', label: 'Ангилал', icon: Tag },
  { href: '/admin/locations', label: 'Байршил', icon: MapPin },
  { href: '/admin/reports', label: 'Тайлан/Гомдол', icon: Flag },
  { href: '/admin/logs', label: 'Лог', icon: ScrollText },
]

export default function AdminNav() {
  const pathname = usePathname()
  const isActive = (href: string, exact?: boolean) => exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="w-56 bg-gray-900 flex-shrink-0 flex flex-col">
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div>
            <span className="font-extrabold text-sm" style={{ fontFamily: 'Rubik, sans-serif' }}>
              <span style={{ color: '#7a9fd4' }}>Khuvsgul</span><span style={{ color: '#e8841a' }}>Zar</span><span style={{ color: '#7a9fd4' }}>.mn</span>
            </span>
            <p className="text-gray-400 text-xs">Админ самбар</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer
              ${isActive(href, exact)
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-800">
        <Link href="/"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer">
          <ArrowLeft size={17} /> Сайт руу буцах
        </Link>
      </div>
    </aside>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, PlusCircle, Heart, User } from 'lucide-react'
import type { Profile } from '@/lib/types'

const NAV = [
  { href: '/dashboard', label: 'Тойм', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/my-ads', label: 'Миний зарууд', icon: FileText },
  { href: '/dashboard/post-ad', label: 'Зар нэмэх', icon: PlusCircle },
  { href: '/dashboard/favorites', label: 'Хадгалсан', icon: Heart },
  { href: '/dashboard/profile', label: 'Профайл', icon: User },
]

interface Props {
  profile: Profile | null
}

export default function DashboardNav({ profile }: Props) {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      {/* User info */}
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={18} className="text-blue-600" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{profile?.full_name || 'Хэрэглэгч'}</p>
          <p className="text-xs text-gray-400">Хувийн самбар</p>
        </div>
      </div>

      <nav className="space-y-1">
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer
              ${isActive(href, exact)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

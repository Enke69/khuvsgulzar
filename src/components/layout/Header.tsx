'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, User, Heart, LogOut, LayoutDashboard, Shield, ChevronDown, Megaphone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

const NAV_LINKS = [
  { href: '/', label: 'Нүүр' },
  { href: '/search', label: 'Зарууд' },
  { href: '/categories/ul-hodloh', label: 'Үл хөдлөх' },
  { href: '/categories/auto', label: 'Авто' },
  { href: '/categories/ajil', label: 'Ажил' },
  { href: '/categories/uilchilgee', label: 'Үйлчилгээ' },
  { href: '/search?q=туслах', label: 'Тусламж' },
]

export default function Header() {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase.from('profiles').select('*').eq('user_id', data.user.id).single()
          .then(({ data: p }) => setProfile(p))
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('profiles').select('*').eq('user_id', session.user.id).single()
          .then(({ data: p }) => setProfile(p))
      } else {
        setProfile(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    setDropdownOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 leading-none">
            <div className="flex flex-col">
              <div className="flex items-start">
                <span className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  <span style={{ color: '#1a3a6b' }}>Khuvsgul</span><span style={{ color: '#e8841a' }}>zar.mn</span>
                </span>
                <Megaphone size={16} className="ml-0.5 mt-0.5 flex-shrink-0" style={{ color: '#e8841a' }} />
              </div>
              <span className="text-[10px] text-gray-400 font-normal tracking-wide">Хөвсгөлийн зарын нэгдсэн платформ</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-[#1a3a6b] px-3 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-blue-50 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-[#1a3a6b] transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-blue-50"
                >
                  <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={14} style={{ color: '#1a3a6b' }} />
                  </div>
                  <span className="text-sm font-medium">{profile?.full_name || 'Профайл'}</span>
                  <ChevronDown size={13} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                      <LayoutDashboard size={15} /> Самбар
                    </Link>
                    <Link href="/dashboard/my-ads" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                      <User size={15} /> Миний зарууд
                    </Link>
                    <Link href="/dashboard/favorites" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                      <Heart size={15} /> Хадгалсан зар
                    </Link>
                    {profile?.role === 'admin' && (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer" style={{ color: '#1a3a6b' }}>
                        <Shield size={15} /> Админ самбар
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
                      <LogOut size={15} /> Гарах
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg border-2 transition-colors cursor-pointer"
                  style={{ color: '#1a3a6b', borderColor: '#1a3a6b' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f0f5ff' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <User size={15} />
                  Нэвтрэх
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-bold px-4 py-2 rounded-lg transition-opacity cursor-pointer"
                  style={{ background: '#e8841a', color: '#1a1a1a' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
                >
                  Бүртгүүлэх
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium cursor-pointer">
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-gray-100" />
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm cursor-pointer">Самбар</Link>
                <Link href="/dashboard/my-ads" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm cursor-pointer">Миний зарууд</Link>
                {profile?.role === 'admin' && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 hover:bg-blue-50 rounded-lg text-sm cursor-pointer" style={{ color: '#1a3a6b' }}>
                    Админ самбар
                  </Link>
                )}
                <button onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg text-sm cursor-pointer">
                  Гарах
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-4 pt-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-sm font-semibold px-4 py-2.5 rounded-lg border-2 cursor-pointer"
                  style={{ color: '#1a3a6b', borderColor: '#1a3a6b' }}>
                  Нэвтрэх
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-sm font-bold px-4 py-2.5 rounded-lg cursor-pointer"
                  style={{ background: '#e8841a', color: '#1a1a1a' }}>
                  Бүртгүүлэх
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

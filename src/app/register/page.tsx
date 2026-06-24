'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Нууц үг тохирохгүй байна.'); return }
    if (password.length < 6) { setError('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.'); return }
    setLoading(true)
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (err) {
      setError(err.message === 'User already registered'
        ? 'Энэ имэйл хаяг аль хэдийн бүртгэгдсэн байна.'
        : 'Бүртгэл үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.')
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Баталгаажуулах имэйл илгээгдлээ!</h2>
          <p className="text-gray-500 text-sm mb-6">
            {email} хаяг руу баталгаажуулах линк илгээлээ. Имэйлээ шалгаад бүртгэлээ баталгаажуулна уу.
          </p>
          <Link href="/login" className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer text-sm">
            Нэвтрэх хуудас руу
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center mb-6">
              <span className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: 'Rubik, sans-serif' }}>
                <span style={{ color: '#0354c7' }}>Khuvsgul</span><span style={{ color: '#ecc34a' }}>Zar</span><span style={{ color: '#0354c7' }}>.mn</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Бүртгүүлэх</h1>
            <p className="text-gray-500 text-sm mt-1">Шинэ бүртгэл үүсгэнэ үү</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Нэр</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Таны нэр"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Имэйл хаяг</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Нууц үг</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Хамгийн багадаа 6 тэмдэгт"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Нууц үг давтах</label>
              <input
                type={showPw ? 'text' : 'password'}
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Нууц үгийг давтана уу"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><UserPlus size={18} /> Бүртгүүлэх</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Бүртгэлтэй юу?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
              Нэвтрэх
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

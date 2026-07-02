'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Phone, MessageCircle, User, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

interface Props {
  profile: Profile
  adPhone: string | null
  adId: string
}

export default function SellerCard({ profile, adPhone, adId }: Props) {
  const [phoneVisible, setPhoneVisible] = useState(false)
  const [msgOpen, setMsgOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSendMessage = async () => {
    if (!msg.trim()) return
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    if (user.id === profile.user_id) { setError('Та өөрийн зард мессеж илгээх боломжгүй.'); return }

    setSending(true)
    const { error: insertError } = await supabase.from('messages').insert({
      ad_id: adId,
      sender_id: user.id,
      receiver_id: profile.user_id,
      message: msg.trim(),
    })
    setSending(false)
    if (insertError) { setError('Мессеж илгээхэд алдаа гарлаа. Дахин оролдоно уу.'); return }
    setSent(true)
    setMsg('')
    setMsgOpen(false)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
      <h3 className="font-bold text-gray-900">Зараач</h3>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {profile.avatar_url ? (
            <Image src={profile.avatar_url} alt={profile.full_name || ''} width={48} height={48} className="object-cover" />
          ) : (
            <User size={22} className="text-blue-600" />
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{profile.full_name || 'Хэрэглэгч'}</p>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar size={11} /> {formatDate(profile.created_at)} -с гишүүн
          </p>
        </div>
      </div>

      {adPhone && (
        <button
          onClick={() => setPhoneVisible(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
        >
          <Phone size={16} />
          {phoneVisible ? adPhone : 'Утас харах'}
        </button>
      )}

      <button
        onClick={() => setMsgOpen(!msgOpen)}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
      >
        <MessageCircle size={16} />
        Мессеж илгээх
      </button>

      {msgOpen && (
        <div className="space-y-2">
          <textarea
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder="Мессежийн агуулга..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || !msg.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2 rounded-xl transition-colors cursor-pointer text-sm"
          >
            {sending ? 'Илгээж байна...' : 'Илгээх'}
          </button>
          {error && <p className="text-red-600 text-xs text-center">{error}</p>}
          {sent && <p className="text-green-600 text-xs text-center">Мессеж амжилттай илгээгдлээ!</p>}
        </div>
      )}
    </div>
  )
}

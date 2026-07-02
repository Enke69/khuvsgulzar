'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Send, User as UserIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatRelativeDate } from '@/lib/utils'
import type { Message, Profile, Ad } from '@/lib/types'

interface Thread {
  adId: string
  otherUserId: string
  ad: Ad | null
  otherProfile: Profile | null
  messages: Message[]
  lastAt: string
}

export default function MessagesPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  const load = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    setUserId(user.id)

    const { data: msgs } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true })

    const list = (msgs || []) as Message[]

    // Group by ad_id + the other participant
    const grouped: Record<string, Thread> = {}
    for (const m of list) {
      const otherUserId = m.sender_id === user.id ? m.receiver_id : m.sender_id
      const key = `${m.ad_id}__${otherUserId}`
      if (!grouped[key]) {
        grouped[key] = { adId: m.ad_id, otherUserId, ad: null, otherProfile: null, messages: [], lastAt: m.created_at }
      }
      grouped[key].messages.push(m)
      grouped[key].lastAt = m.created_at
    }

    const threadList = Object.values(grouped).sort((a, b) => b.lastAt.localeCompare(a.lastAt))

    // Fetch related ads and profiles
    const adIds = [...new Set(threadList.map(t => t.adId))]
    const userIds = [...new Set(threadList.map(t => t.otherUserId))]

    const [adsRes, profilesRes] = await Promise.all([
      adIds.length ? supabase.from('ads').select('*, ad_images(*)').in('id', adIds) : Promise.resolve({ data: [] }),
      userIds.length ? supabase.from('profiles').select('*').in('user_id', userIds) : Promise.resolve({ data: [] }),
    ])

    const adsMap = new Map((adsRes.data || []).map((a: Ad) => [a.id, a]))
    const profilesMap = new Map((profilesRes.data || []).map((p: Profile) => [p.user_id, p]))

    for (const t of threadList) {
      t.ad = adsMap.get(t.adId) || null
      t.otherProfile = profilesMap.get(t.otherUserId) || null
    }

    setThreads(threadList)
    if (threadList.length > 0 && !activeKey) {
      setActiveKey(`${threadList[0].adId}__${threadList[0].otherUserId}`)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const activeThread = threads.find(t => `${t.adId}__${t.otherUserId}` === activeKey)

  const handleReply = async () => {
    if (!reply.trim() || !activeThread || !userId) return
    setSending(true)
    const { error } = await supabase.from('messages').insert({
      ad_id: activeThread.adId,
      sender_id: userId,
      receiver_id: activeThread.otherUserId,
      message: reply.trim(),
    })
    setSending(false)
    if (!error) {
      setReply('')
      load()
    }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  }

  if (threads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Мессежүүд</h1>
        <p className="text-gray-400 text-sm">Танд одоогоор мессеж алга байна.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row h-[70vh]">
      {/* Thread list */}
      <div className="w-full md:w-72 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-100 overflow-y-auto">
        <h1 className="text-lg font-bold text-gray-900 px-4 py-4 border-b border-gray-100">Мессежүүд</h1>
        {threads.map(t => {
          const key = `${t.adId}__${t.otherUserId}`
          const img = t.ad?.ad_images?.[0]?.image_url
          const last = t.messages[t.messages.length - 1]
          return (
            <button
              key={key}
              onClick={() => setActiveKey(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors
                ${activeKey === key ? 'bg-blue-50' : ''}`}
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {img && <Image src={img} alt="" width={40} height={40} className="object-cover w-full h-full" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{t.ad?.title || 'Устгагдсан зар'}</p>
                <p className="text-xs text-gray-500 truncate">{t.otherProfile?.full_name || 'Хэрэглэгч'}</p>
                <p className="text-xs text-gray-400 truncate">{last?.message}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Active conversation */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeThread ? (
          <>
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <UserIcon size={16} className="text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{activeThread.otherProfile?.full_name || 'Хэрэглэгч'}</p>
                {activeThread.ad && (
                  <Link href={`/ads/${activeThread.adId}`} target="_blank" className="text-xs text-blue-600 hover:underline truncate block">
                    {activeThread.ad.title}
                  </Link>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {activeThread.messages.map(m => {
                const mine = m.sender_id === userId
                return (
                  <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${mine ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      <p className="whitespace-pre-line">{m.message}</p>
                      <p className={`text-[10px] mt-1 ${mine ? 'text-blue-200' : 'text-gray-400'}`}>{formatRelativeDate(m.created_at)}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-2">
              <input
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleReply() }}
                placeholder="Мессеж бичих..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              />
              <button
                onClick={handleReply}
                disabled={sending || !reply.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 rounded-xl cursor-pointer transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Харилцан яриа сонгоно уу</div>
        )}
      </div>
    </div>
  )
}

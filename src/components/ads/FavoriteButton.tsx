'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  adId: string
}

export default function FavoriteButton({ adId }: Props) {
  const [isFav, setIsFav] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('ad_id', adId)
        .single()
      setIsFav(!!data)
    }
    check()
  }, [adId])

  const toggle = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setLoading(true)
    if (isFav) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('ad_id', adId)
      setIsFav(false)
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, ad_id: adId })
      setIsFav(true)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-medium text-sm transition-all cursor-pointer
        ${isFav
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
    >
      <Heart size={18} className={isFav ? 'fill-red-500 text-red-500' : ''} />
      {isFav ? 'Хадгалсан' : 'Хадгалах'}
    </button>
  )
}

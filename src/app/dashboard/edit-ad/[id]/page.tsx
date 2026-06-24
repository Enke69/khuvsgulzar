import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PostAdWizard from '@/components/post-ad/PostAdWizard'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditAdPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: ad } = await supabase
    .from('ads')
    .select('*, ad_images(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!ad) notFound()

  const existingAd = {
    id: ad.id,
    category_id: ad.category_id || '',
    title: ad.title,
    description: ad.description || '',
    price: ad.price?.toString() || '',
    condition: ad.condition || 'used',
    ad_type: ad.ad_type,
    location_id: ad.location_id || '',
    phone: ad.phone || '',
    images: [],
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Зар засах</h1>
      <PostAdWizard existingAd={existingAd} />
    </div>
  )
}

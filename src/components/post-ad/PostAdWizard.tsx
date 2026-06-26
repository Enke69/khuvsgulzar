'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import StepCategory from './StepCategory'
import StepDetails from './StepDetails'
import StepImages from './StepImages'
import StepContact from './StepContact'
import StepPreview from './StepPreview'
import { Check } from 'lucide-react'

export interface AdFormData {
  category_id: string
  category_name: string
  category_slug: string
  title: string
  description: string
  price: string
  condition: string
  ad_type: string
  location_id: string
  location_name: string
  images: File[]
  phone: string
  metadata: Record<string, string>
}

const STEPS = [
  'Ангилал',
  'Дэлгэрэнгүй',
  'Зураг',
  'Холбоо барих',
  'Урьдчилан харах',
]

const defaultData: AdFormData = {
  category_id: '',
  category_name: '',
  category_slug: '',
  title: '',
  description: '',
  price: '',
  condition: 'used',
  ad_type: 'sell',
  location_id: '',
  location_name: '',
  images: [],
  phone: '',
  metadata: {},
}

export default function PostAdWizard({ existingAd }: { existingAd?: Partial<AdFormData> & { id?: string } }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<AdFormData>({ ...defaultData, ...existingAd })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const update = (patch: Partial<AdFormData>) => setData(prev => ({ ...prev, ...patch }))

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Нэвтэрч орно уу')

      // Insert or update ad
      const adPayload = {
        user_id: user.id,
        category_id: data.category_id || null,
        location_id: data.location_id || null,
        title: data.title,
        description: data.description || null,
        price: data.price ? Number(data.price) : null,
        condition: data.condition || null,
        ad_type: data.ad_type,
        phone: data.phone || null,
        status: 'pending' as const,
        metadata: Object.keys(data.metadata).length > 0 ? data.metadata : null,
      }

      let adId: string
      if (existingAd?.id) {
        const { data: updated, error: updErr } = await supabase
          .from('ads').update(adPayload).eq('id', existingAd.id).select('id').single()
        if (updErr) throw updErr
        adId = updated.id
        // Delete old images
        await supabase.from('ad_images').delete().eq('ad_id', adId)
      } else {
        const { data: inserted, error: insErr } = await supabase
          .from('ads').insert(adPayload).select('id').single()
        if (insErr) throw insErr
        adId = inserted.id
      }

      // Upload images
      for (let i = 0; i < data.images.length; i++) {
        const file = data.images[i]
        const ext = file.name.split('.').pop()
        const path = `${user.id}/${adId}/${Date.now()}-${i}.${ext}`
        const { error: uploadErr } = await supabase.storage.from('ad-images').upload(path, file)
        if (uploadErr) continue
        const { data: urlData } = supabase.storage.from('ad-images').getPublicUrl(path)
        await supabase.from('ad_images').insert({
          ad_id: adId,
          image_url: urlData.publicUrl,
          sort_order: i,
        })
      }

      router.push('/dashboard/my-ads?submitted=true')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа. Дахин оролдоно уу.')
    }
    setSubmitting(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                ${i < step ? 'bg-green-500 text-white'
                  : i === step ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-400'}`}>
                {i < step ? <Check size={15} /> : i + 1}
              </div>
              <span className={`text-xs mt-1 hidden sm:block ${i === step ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        {step === 0 && <StepCategory data={data} update={update} onNext={() => setStep(1)} />}
        {step === 1 && <StepDetails data={data} update={update} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
        {step === 2 && <StepImages data={data} update={update} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <StepContact data={data} update={update} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && (
          <StepPreview
            data={data}
            onBack={() => setStep(3)}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={error}
          />
        )}
      </div>
    </div>
  )
}

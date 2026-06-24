'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'
import type { AdFormData } from './PostAdWizard'

interface Props {
  data: AdFormData
  update: (patch: Partial<AdFormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepContact({ data, update, onNext, onBack }: Props) {
  const [error, setError] = useState('')

  const handleNext = () => {
    if (data.phone && !/^[0-9+\-\s()]{8,15}$/.test(data.phone.trim())) {
      setError('Утасны дугаар буруу форматтай байна')
      return
    }
    setError('')
    onNext()
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Холбоо барих мэдээлэл</h2>
      <p className="text-gray-500 text-sm mb-6">Худалдан авагч таньтай холбоо барих дугаар</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Утасны дугаар
          </label>
          <div className="relative">
            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={data.phone}
              onChange={e => { update({ phone: e.target.value }); setError('') }}
              placeholder="+976 9900-0000"
              className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
                ${error ? 'border-red-400' : 'border-gray-200'}`}
            />
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          <p className="text-xs text-gray-400 mt-1.5">Утасны дугаар оруулаагүй тохиолдолд зөвхөн мессежээр холбоо барина</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
          <p className="font-semibold mb-1">Анхааруулга</p>
          <p className="text-xs leading-relaxed">Таны утасны дугаарыг зарыг харж буй хэрэглэгчид харах боломжтой. Хувийн дугаарыг нийтлэх эсэхэлдэж бодоорой.</p>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={onBack}
          className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-sm">
          ← Буцах
        </button>
        <button onClick={handleNext}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer text-sm">
          Урьдчилан харах →
        </button>
      </div>
    </div>
  )
}

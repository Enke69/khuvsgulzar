'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Upload, X, GripVertical } from 'lucide-react'
import type { AdFormData } from './PostAdWizard'

const MAX_IMAGES = 10
const MAX_SIZE_MB = 5

interface Props {
  data: AdFormData
  update: (patch: Partial<AdFormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepImages({ data, update, onNext, onBack }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const addImages = (files: FileList | null) => {
    if (!files) return
    const valid = Array.from(files).filter(f => {
      if (!f.type.startsWith('image/')) return false
      if (f.size > MAX_SIZE_MB * 1024 * 1024) return false
      return true
    })
    const total = [...data.images, ...valid].slice(0, MAX_IMAGES)
    update({ images: total })
  }

  const remove = (i: number) => {
    const imgs = [...data.images]
    imgs.splice(i, 1)
    update({ images: imgs })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    addImages(e.dataTransfer.files)
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Зураг нэмэх</h2>
      <p className="text-gray-500 text-sm mb-6">
        Хамгийн ихдээ {MAX_IMAGES} зураг, {MAX_SIZE_MB}MB хэмжээтэй байна
      </p>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl p-8 text-center cursor-pointer transition-colors mb-4"
      >
        <Upload size={32} className="text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500 font-medium">Зурагнуудаа энд чирж оруулах эсвэл товшино уу</p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — {MAX_SIZE_MB}MB хүртэл</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => addImages(e.target.files)}
      />

      {/* Preview */}
      {data.images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
          {data.images.map((file, i) => (
            <div key={i} className="relative group aspect-square">
              <Image
                src={URL.createObjectURL(file)}
                alt={`img-${i}`}
                fill
                className="object-cover rounded-xl"
                sizes="120px"
              />
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  Гол зураг
                </span>
              )}
              <button
                onClick={() => remove(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {data.images.length < MAX_IMAGES && (
            <button
              onClick={() => inputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl flex items-center justify-center text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
            >
              <Upload size={24} />
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 mb-6">{data.images.length} / {MAX_IMAGES} зураг нэмэгдсэн</p>

      <div className="flex gap-3">
        <button onClick={onBack}
          className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-sm">
          ← Буцах
        </button>
        <button onClick={onNext}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer text-sm">
          Үргэлжлүүлэх →
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { AdImage } from '@/lib/types'

interface Props {
  images: AdImage[]
  title: string
}

export default function ImageGallery({ images, title }: Props) {
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
        <p className="text-gray-400">Зураг байхгүй</p>
      </div>
    )
  }

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div
          className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden cursor-zoom-in"
          onClick={() => setLightbox(true)}
        >
          <Image
            src={images[current].image_url}
            alt={`${title} - ${current + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority={current === 0}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {current + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setCurrent(i)}
                className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${i === current ? 'border-blue-500' : 'border-transparent'}`}
              >
                <Image src={img.image_url} alt={`thumb-${i}`} fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white cursor-pointer"
          >
            <X size={28} />
          </button>
          <div className="relative max-w-4xl max-h-full w-full" onClick={e => e.stopPropagation()}>
            <Image
              src={images[current].image_url}
              alt={title}
              width={1200}
              height={800}
              className="object-contain max-h-[85vh] w-auto mx-auto rounded-lg"
            />
          </div>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center cursor-pointer">
                <ChevronLeft size={22} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center cursor-pointer">
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}

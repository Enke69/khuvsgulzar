import AdCard from './AdCard'
import type { Ad } from '@/lib/types'

interface Props {
  ads: Ad[]
  emptyMessage?: string
}

export default function AdGrid({ ads, emptyMessage = 'Зар олдсонгүй' }: Props) {
  if (ads.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {ads.map(ad => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  )
}

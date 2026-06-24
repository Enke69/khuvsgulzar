import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl font-bold text-blue-100 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Хуудас олдсонгүй</h1>
      <p className="text-gray-500 mb-8">Таны хайсан хуудас байхгүй эсвэл устгагдсан байна.</p>
      <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer">
        Нүүр хуудас руу буцах
      </Link>
    </div>
  )
}

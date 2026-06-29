import type { Metadata } from 'next'
import { Rubik, Nunito_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rubik',
  display: 'swap',
})

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KhuvsgulZar.mn — Хөвсгөлийн зар сурталчилгааны платформ',
  description: 'Хөвсгөлийн хамгийн том зар сурталчилгааны платформ. Зарна уу, авна уу — хурдан, аюулгүй, хялбар.',
  keywords: 'зар, сурталчилгаа, хөвсгөл, зарна, авна, үл хөдлөх, автомашин',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${rubik.variable} ${nunitoSans.variable}`}>
      <body className="min-h-screen flex flex-col bg-white antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

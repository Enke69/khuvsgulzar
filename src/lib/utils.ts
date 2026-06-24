import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | null | undefined): string {
  if (price == null) return 'Үнэ тохиролцоно'
  return new Intl.NumberFormat('mn-MN').format(price) + ' ₮'
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Өнөөдөр'
  if (diffDays === 1) return 'Өчигдөр'
  if (diffDays < 7) return `${diffDays} өдрийн өмнө`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} долоо хоногийн өмнө`
  return formatDate(dateStr)
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}


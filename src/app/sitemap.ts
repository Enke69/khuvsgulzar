import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE = 'https://khuvsgulzar.mn'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'hourly', priority: 1 },
    { url: `${BASE}/search`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE}/privacy`, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${BASE}/terms`, changeFrequency: 'monthly', priority: 0.2 },
  ]

  try {
    const supabase = await createClient()
    const [{ data: categories }, { data: ads }] = await Promise.all([
      supabase.from('categories').select('slug'),
      supabase
        .from('ads')
        .select('id, updated_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(1000),
    ])

    const categoryPages: MetadataRoute.Sitemap = (categories || []).map(c => ({
      url: `${BASE}/categories/${c.slug}`,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    }))

    const adPages: MetadataRoute.Sitemap = (ads || []).map(a => ({
      url: `${BASE}/ads/${a.id}`,
      lastModified: a.updated_at ? new Date(a.updated_at) : undefined,
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...categoryPages, ...adPages]
  } catch {
    return staticPages
  }
}

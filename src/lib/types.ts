export type UserRole = 'user' | 'admin'
export type AdStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'sold'
export type AdCondition = 'new' | 'used' | 'refurbished'
export type AdType = 'sell' | 'buy' | 'rent' | 'service'
export type ReportStatus = 'pending' | 'resolved' | 'dismissed'

export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  is_banned: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  parent_id: string | null
  created_at: string
  ad_count?: number
}

export interface Location {
  id: string
  name: string
  slug: string
  parent_id: string | null
  created_at: string
}

export interface Ad {
  id: string
  user_id: string
  category_id: string
  location_id: string
  title: string
  description: string | null
  price: number | null
  condition: AdCondition | null
  ad_type: AdType
  status: AdStatus
  is_featured: boolean
  is_sold: boolean
  views: number
  phone: string | null
  created_at: string
  updated_at: string
  category?: Category
  location?: Location
  profile?: Profile
  ad_images?: AdImage[]
}

export interface AdImage {
  id: string
  ad_id: string
  image_url: string
  sort_order: number
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  ad_id: string
  created_at: string
  ad?: Ad
}

export interface Report {
  id: string
  ad_id: string
  reporter_id: string
  reason: string
  description: string | null
  status: ReportStatus
  created_at: string
  ad?: Ad
  profile?: Profile
}

export interface Message {
  id: string
  ad_id: string
  sender_id: string
  receiver_id: string
  message: string
  created_at: string
}

export interface AdminLog {
  id: string
  admin_id: string
  action: string
  target_type: string
  target_id: string | null
  description: string
  created_at: string
  profile?: Profile
}

export interface AdminStats {
  total_users: number
  total_ads: number
  pending_ads: number
  approved_ads: number
  rejected_ads: number
  sold_ads: number
  total_views: number
  new_users_week: number
  new_ads_week: number
  total_reports: number
}

export const CATEGORIES = [
  { name: 'Үл хөдлөх хөрөнгө', slug: 'real-estate', icon: 'Building2' },
  { name: 'Автомашин', slug: 'vehicles', icon: 'Car' },
  { name: 'Гар утас', slug: 'phones', icon: 'Smartphone' },
  { name: 'Компьютер, электроник', slug: 'electronics', icon: 'Monitor' },
  { name: 'Тавилга', slug: 'furniture', icon: 'Armchair' },
  { name: 'Ажлын байр', slug: 'jobs', icon: 'Briefcase' },
  { name: 'Үйлчилгээ', slug: 'services', icon: 'Wrench' },
  { name: 'Хувцас, хэрэглэл', slug: 'fashion', icon: 'Shirt' },
  { name: 'Спорт, хобби', slug: 'sports', icon: 'Trophy' },
  { name: 'Мал, амьтан', slug: 'animals', icon: 'Dog' },
  { name: 'Бусад', slug: 'other', icon: 'Package' },
]

export const LOCATIONS = [
  'Улаанбаатар', 'Архангай', 'Баян-Өлгий', 'Баянхонгор', 'Булган',
  'Говь-Алтай', 'Говьсүмбэр', 'Дархан-Уул', 'Дорноговь', 'Дорнод',
  'Дундговь', 'Завхан', 'Орхон', 'Өвөрхангай', 'Өмнөговь',
  'Сүхбаатар', 'Сэлэнгэ', 'Төв', 'Увс', 'Ховд', 'Хөвсгөл', 'Хэнтий',
]

export const AD_STATUS_LABELS: Record<string, string> = {
  draft: 'Ноорог',
  pending: 'Хүлээгдэж буй',
  approved: 'Зөвшөөрсөн',
  rejected: 'Татгалзсан',
  sold: 'Зарагдсан',
}

export const AD_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  sold: 'bg-blue-100 text-blue-700',
}

export const AD_CONDITION_LABELS: Record<string, string> = {
  new: 'Шинэ',
  used: 'Хэрэглэсэн',
  refurbished: 'Шинэчилсэн',
}

export const AD_TYPE_LABELS: Record<string, string> = {
  sell: 'Зарна',
  buy: 'Авна',
  rent: 'Түрээслэнэ',
  service: 'Үйлчилгээ',
}

export const REPORT_REASONS = [
  'Хуурамч зар',
  'Хориотой бараа',
  'Залилан мэхлэлт',
  'Зохисгүй агуулга',
  'Давхардсан зар',
  'Бусад',
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Шинэ эхэндээ' },
  { value: 'oldest', label: 'Хуучин эхэндээ' },
  { value: 'price_asc', label: 'Үнэ: бага → их' },
  { value: 'price_desc', label: 'Үнэ: их → бага' },
  { value: 'views', label: 'Их үзэгдсэн' },
]

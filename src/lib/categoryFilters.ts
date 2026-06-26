export type FilterField = {
  key: string
  label: string
  type: 'radio' | 'select'
  options: { value: string; label: string }[]
}

export const CATEGORY_FILTERS: Record<string, FilterField[]> = {
  jobs: [
    {
      key: 'job_type',
      label: 'Ажлын төрөл',
      type: 'radio',
      options: [
        { value: 'full_time', label: 'Бүтэн цагийн' },
        { value: 'part_time', label: 'Хагас цагийн' },
        { value: 'freelance', label: 'Фрилансер' },
        { value: 'remote', label: 'Зайнаас' },
      ],
    },
    {
      key: 'salary_type',
      label: 'Цалингийн төрөл',
      type: 'radio',
      options: [
        { value: 'monthly', label: 'Сар бүр' },
        { value: 'hourly', label: 'Цагаар' },
        { value: 'negotiable', label: 'Тохиролцоно' },
      ],
    },
  ],
  vehicles: [
    {
      key: 'brand',
      label: 'Марк',
      type: 'select',
      options: [
        { value: 'toyota', label: 'Toyota' },
        { value: 'lexus', label: 'Lexus' },
        { value: 'honda', label: 'Honda' },
        { value: 'hyundai', label: 'Hyundai' },
        { value: 'kia', label: 'Kia' },
        { value: 'mitsubishi', label: 'Mitsubishi' },
        { value: 'nissan', label: 'Nissan' },
        { value: 'mercedes', label: 'Mercedes-Benz' },
        { value: 'bmw', label: 'BMW' },
        { value: 'land_rover', label: 'Land Rover' },
        { value: 'other', label: 'Бусад' },
      ],
    },
    {
      key: 'fuel_type',
      label: 'Хөдөлгүүр',
      type: 'radio',
      options: [
        { value: 'petrol', label: 'Бензин' },
        { value: 'diesel', label: 'Дизель' },
        { value: 'hybrid', label: 'Хибрид' },
        { value: 'electric', label: 'Цахилгаан' },
      ],
    },
    {
      key: 'transmission',
      label: 'Хурд хайрцаг',
      type: 'radio',
      options: [
        { value: 'auto', label: 'Автомат' },
        { value: 'manual', label: 'Механик' },
      ],
    },
  ],
  'real-estate': [
    {
      key: 'property_type',
      label: 'Хөрөнгийн төрөл',
      type: 'radio',
      options: [
        { value: 'apartment', label: 'Орон сууц' },
        { value: 'house', label: 'Байшин' },
        { value: 'land', label: 'Газар' },
        { value: 'commercial', label: 'Арилжааны' },
      ],
    },
    {
      key: 'rooms',
      label: 'Өрөөний тоо',
      type: 'select',
      options: [
        { value: '1', label: '1 өрөө' },
        { value: '2', label: '2 өрөө' },
        { value: '3', label: '3 өрөө' },
        { value: '4', label: '4 өрөө' },
        { value: '5+', label: '5+ өрөө' },
      ],
    },
  ],
  phones: [
    {
      key: 'brand',
      label: 'Брэнд',
      type: 'radio',
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'samsung', label: 'Samsung' },
        { value: 'xiaomi', label: 'Xiaomi' },
        { value: 'huawei', label: 'Huawei' },
        { value: 'oppo', label: 'OPPO' },
        { value: 'other', label: 'Бусад' },
      ],
    },
  ],
  electronics: [
    {
      key: 'sub_type',
      label: 'Төрөл',
      type: 'radio',
      options: [
        { value: 'laptop', label: 'Зөөврийн компьютер' },
        { value: 'desktop', label: 'Суурин компьютер' },
        { value: 'tablet', label: 'Таблет' },
        { value: 'tv', label: 'Телевиз' },
        { value: 'camera', label: 'Камер' },
        { value: 'other', label: 'Бусад' },
      ],
    },
    {
      key: 'brand',
      label: 'Брэнд',
      type: 'select',
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'samsung', label: 'Samsung' },
        { value: 'lg', label: 'LG' },
        { value: 'sony', label: 'Sony' },
        { value: 'dell', label: 'Dell' },
        { value: 'hp', label: 'HP' },
        { value: 'lenovo', label: 'Lenovo' },
        { value: 'asus', label: 'ASUS' },
        { value: 'other', label: 'Бусад' },
      ],
    },
  ],
  animals: [
    {
      key: 'animal_type',
      label: 'Амьтны төрөл',
      type: 'radio',
      options: [
        { value: 'horse', label: 'Морь' },
        { value: 'cow', label: 'Үхэр' },
        { value: 'sheep', label: 'Хонь' },
        { value: 'goat', label: 'Ямаа' },
        { value: 'camel', label: 'Тэмээ' },
        { value: 'dog', label: 'Нохой' },
        { value: 'cat', label: 'Муур' },
        { value: 'other', label: 'Бусад' },
      ],
    },
  ],
  fashion: [
    {
      key: 'gender',
      label: 'Хүйс',
      type: 'radio',
      options: [
        { value: 'male', label: 'Эрэгтэй' },
        { value: 'female', label: 'Эмэгтэй' },
        { value: 'unisex', label: 'Хоёулаа' },
        { value: 'kids', label: 'Хүүхэд' },
      ],
    },
    {
      key: 'size',
      label: 'Хэмжээ',
      type: 'select',
      options: [
        { value: 'XS', label: 'XS' },
        { value: 'S', label: 'S' },
        { value: 'M', label: 'M' },
        { value: 'L', label: 'L' },
        { value: 'XL', label: 'XL' },
        { value: 'XXL', label: 'XXL' },
      ],
    },
  ],
  sports: [
    {
      key: 'sport_type',
      label: 'Спортын төрөл',
      type: 'select',
      options: [
        { value: 'football', label: 'Хөл бөмбөг' },
        { value: 'basketball', label: 'Сагсан бөмбөг' },
        { value: 'wrestling', label: 'Бөх' },
        { value: 'boxing', label: 'Боксын' },
        { value: 'fitness', label: 'Фитнес' },
        { value: 'cycling', label: 'Дугуй' },
        { value: 'fishing', label: 'Загас агнуур' },
        { value: 'hunting', label: 'Ан агнуур' },
        { value: 'other', label: 'Бусад' },
      ],
    },
  ],
  services: [
    {
      key: 'service_type',
      label: 'Үйлчилгээний төрөл',
      type: 'select',
      options: [
        { value: 'repair', label: 'Засвар үйлчилгээ' },
        { value: 'construction', label: 'Барилга' },
        { value: 'transport', label: 'Тээвэр' },
        { value: 'cleaning', label: 'Цэвэрлэгээ' },
        { value: 'beauty', label: 'Гоо сайхан' },
        { value: 'education', label: 'Сургалт' },
        { value: 'it', label: 'IT үйлчилгээ' },
        { value: 'other', label: 'Бусад' },
      ],
    },
  ],
  furniture: [
    {
      key: 'furniture_type',
      label: 'Тавилгын төрөл',
      type: 'select',
      options: [
        { value: 'sofa', label: 'Диван' },
        { value: 'bed', label: 'Ортой' },
        { value: 'table', label: 'Ширээ' },
        { value: 'chair', label: 'Сандал' },
        { value: 'wardrobe', label: 'Шкаф' },
        { value: 'kitchen', label: 'Гал тогооны' },
        { value: 'other', label: 'Бусад' },
      ],
    },
  ],
}

export function getFiltersForSlug(slug: string): FilterField[] {
  return CATEGORY_FILTERS[slug] ?? []
}

// Labels for display in post-ad form
export const CATEGORY_FIELD_LABELS: Record<string, string> = {
  job_type: 'Ажлын төрөл',
  salary_type: 'Цалингийн төрөл',
  brand: 'Брэнд / Марк',
  fuel_type: 'Хөдөлгүүр',
  transmission: 'Хурд хайрцаг',
  property_type: 'Хөрөнгийн төрөл',
  rooms: 'Өрөөний тоо',
  sub_type: 'Дэд төрөл',
  animal_type: 'Амьтны төрөл',
  gender: 'Хүйс',
  size: 'Хэмжээ',
  sport_type: 'Спортын төрөл',
  service_type: 'Үйлчилгээний төрөл',
  furniture_type: 'Тавилгын төрөл',
}

export enum GarmentCategory {
  Tops = 'tops',
  Bottoms = 'bottoms',
  Outerwear = 'outerwear',
  Footwear = 'footwear',
  Accessories = 'accessories',
}

export interface Garment {
  id: string
  name: string
  brand: string
  category: GarmentCategory
  image_url: string
  color: string
  times_worn: number
  last_worn: string | null
  purchase_price: number
}

export interface Outfit {
  id: string
  name: string
  items: Garment[]
  created_at: Date
}

export interface Garment {
  id: string
  name: string
  brand: string
  category: 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories'
  imageUrl: string
  color: string
  purchasePrice?: number
  lastWorn?: Date
  timesWorn: number
}

export interface Outfit {
  id: string
  name: string
  items: Garment[]
  createdAt: Date
}

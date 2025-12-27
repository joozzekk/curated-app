import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useWardrobeStore } from './wardrobe'
import type { Garment } from '@/types'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() =>
          Promise.resolve({ data: [{ id: 1, name: 'Test Shirt', category: 'tops' }], error: null }),
        ),
      })),
    })),
  },
}))

describe('Wardrobe Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with an empty list', () => {
    const wardrobe = useWardrobeStore()
    expect(wardrobe.garments).toEqual([])
  })

  it('filters garments by category correctly', () => {
    const wardrobe = useWardrobeStore()
    wardrobe.garments = [
      { id: '1', name: 'Shirt', category: 'tops' },
      { id: '2', name: 'Jeans', category: 'bottoms' },
    ] as Garment[]

    wardrobe.setCategory('bottoms')
    expect(wardrobe.filteredGarments).toHaveLength(1)
    expect(wardrobe.filteredGarments[0]?.name).toBe('Jeans')
  })

  it('removes garment from list correctly', () => {
    const wardrobe = useWardrobeStore()
    wardrobe.garments = [{ id: '123', name: 'Delete Me' }] as Garment[]

    wardrobe.removeGarmentFromList('123')
    expect(wardrobe.garments).toHaveLength(0)
  })

  it('loads garments from supabase', async () => {
    const wardrobe = useWardrobeStore()
    await wardrobe.fetchGarments()

    expect(wardrobe.garments).toHaveLength(1)
    expect(wardrobe.garments[0]?.name).toBe('Test Shirt')
  })
})

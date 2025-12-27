import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GarmentModal from './GarmentModal.vue'
import { createPinia, setActivePinia } from 'pinia'
import { GarmentCategory } from '@/types'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() =>
            Promise.resolve({
              data: [{ id: '1', name: 'Updated Shirt', times_worn: 1 }],
              error: null,
            }),
          ),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}))

vi.mock('@/stores/toast', () => ({
  useToastStore: () => ({
    show: vi.fn(),
  }),
}))

describe('GarmentModal.vue', () => {
  const mockGarment = {
    id: '1',
    name: 'Silk Scarf',
    brand: 'Hermès',
    color: 'Red',
    category: GarmentCategory.Accessories,
    image_url: 'test.jpg',
    purchase_price: 200,
    times_worn: 0,
    last_worn: null,
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    document.body.innerHTML = ''
  })

  it('does not render content when isOpen is false', () => {
    mount(GarmentModal, {
      props: { garment: mockGarment, isOpen: false },
    })

    const modalContainer = document.body.querySelector('.fixed')
    expect(modalContainer).toBeNull()
  })

  it('renders garment details correctly when open', async () => {
    mount(GarmentModal, {
      props: { garment: mockGarment, isOpen: true },
    })

    expect(document.body.textContent).toContain('Hermès')
    expect(document.body.textContent).toContain('Silk Scarf')
    expect(document.body.textContent).toContain('£200')
  })

  it('emits close event when clicking the backdrop', async () => {
    const wrapper = mount(GarmentModal, {
      props: { garment: mockGarment, isOpen: true },
    })

    const backdrop = document.querySelector('.bg-black\\/40')
    if (backdrop) {
      ;(backdrop as HTMLElement).click()
      expect(wrapper.emitted()).toHaveProperty('close')
    }
  })

  it('triggers update flow when "Mark as Worn" is clicked', async () => {
    const wrapper = mount(GarmentModal, {
      props: { garment: mockGarment, isOpen: true },
    })

    const button = document.querySelector('button.border-brand-black') as HTMLElement
    button.click()

    await vi.waitFor(() => {
      expect(wrapper.emitted()).toHaveProperty('updated')
    })
  })
})

import { cleanup, render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
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

const mockToast = { show: vi.fn() }
vi.mock('@/stores/toast', () => ({
  useToastStore: () => mockToast,
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
    cleanup()
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('does not render when isOpen is false', () => {
    render(GarmentModal, {
      props: { garment: mockGarment, isOpen: false },
    })

    expect(screen.queryByText(/hermès/i)).toBeNull()
  })

  it('renders garment details correctly when open', () => {
    render(GarmentModal, {
      props: { garment: mockGarment, isOpen: true },
    })

    expect(screen.getByText(/hermès/i)).toBeTruthy()
    expect(screen.getByText(/silk scarf/i)).toBeTruthy()
    expect(screen.getByText(/£200/i)).toBeTruthy()
  })

  it('emits close event when clicking the close button', async () => {
    const user = userEvent.setup()
    const { emitted } = render(GarmentModal, {
      props: { garment: mockGarment, isOpen: true },
    })

    const closeBtn = screen.getByRole('button', { name: /close/i })
    await user.click(closeBtn)

    expect(emitted()).toHaveProperty('close')
  })

  it('triggers update flow when "Mark as Worn Today" is clicked', async () => {
    const user = userEvent.setup()
    const { emitted } = render(GarmentModal, {
      props: { garment: mockGarment, isOpen: true },
    })

    const updateBtn = screen.getByRole('button', { name: /mark as worn today/i })
    await user.click(updateBtn)

    await vi.waitFor(() => {
      expect(emitted()).toHaveProperty('updated')
      expect(mockToast.show).toHaveBeenCalledWith('Garment updated!', 'success')
    })
  })
})

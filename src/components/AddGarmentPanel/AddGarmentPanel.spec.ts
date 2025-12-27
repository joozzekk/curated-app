import { cleanup, render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AddGarmentPanel from './AddGarmentPanel.vue'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}))

const mockToast = { show: vi.fn() }
vi.mock('@/stores/toast', () => ({
  useToastStore: () => mockToast,
}))

describe('AddGarmentPanel.vue', () => {
  beforeEach(() => {
    cleanup()
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const renderPanel = () =>
    render(AddGarmentPanel, {
      props: { isOpen: true },
      global: { plugins: [createPinia()] },
    })

  it('renders correctly when open', () => {
    renderPanel()
    expect(screen.getByRole('heading', { name: /add new piece/i })).toBeTruthy()
    expect(screen.getByLabelText(/item name/i)).toBeTruthy()
  })

  it('toggles the custom category dropdown', async () => {
    const user = userEvent.setup()
    renderPanel()

    const dropdownTrigger = screen.getByText(/tops/i)

    expect(screen.queryByText(/footwear/i)).toBeNull()

    await user.click(dropdownTrigger)
    expect(screen.getByText(/footwear/i)).toBeTruthy()

    await user.click(dropdownTrigger)
    await vi.waitFor(() => {
      expect(screen.queryByText(/footwear/i)).toBeNull()
    })
  })

  it('shows error toast if required fields are missing', async () => {
    const user = userEvent.setup()
    renderPanel()

    const submitBtn = screen.getByRole('button', { name: /add to collection/i })
    await user.click(submitBtn)

    expect(mockToast.show).toHaveBeenCalledWith('Please fill in all required fields', 'error')
  })

  it('submits correctly when form is valid', async () => {
    const user = userEvent.setup()
    const { emitted } = renderPanel()

    await user.type(screen.getByLabelText(/item name/i), 'New Jacket')
    await user.type(screen.getByLabelText(/brand/i), 'Brand X')
    await user.type(screen.getByLabelText(/image url/i), 'https://image.com/test.jpg')
    await user.type(screen.getByLabelText(/color/i), 'White')

    const priceInput = screen.getByLabelText(/price/i)
    await user.clear(priceInput)
    await user.type(priceInput, '40')

    await user.click(screen.getByRole('button', { name: /add to collection/i }))

    await vi.waitFor(() => {
      expect(emitted()).toHaveProperty('added')
      expect(mockToast.show).toHaveBeenCalledWith('New garment added to collection', 'success')
    })
  })
})

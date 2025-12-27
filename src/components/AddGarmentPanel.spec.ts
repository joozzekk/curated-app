import { mount } from '@vue/test-utils'
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

const mockToast = {
  show: vi.fn(),
}
vi.mock('@/stores/toast', () => ({
  useToastStore: () => mockToast,
}))

describe('AddGarmentPanel.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  it('renders correctly when open', () => {
    mount(AddGarmentPanel, {
      props: { isOpen: true },
    })

    expect(document.body.textContent).toContain('Add New Piece')
    expect(document.body.querySelector('input[type="text"]')).toBeTruthy()
  })

  it('toggles the custom category dropdown', async () => {
    mount(AddGarmentPanel, {
      props: { isOpen: true },
    })

    const trigger = document.body.querySelector('.cursor-pointer') as HTMLElement
    expect(trigger.textContent).not.toContain('footwear')

    trigger.click()
    expect(trigger.textContent).toContain('tops')

    trigger.click()
    await vi.waitFor(() => {
      expect(document.body.querySelector('.absolute.z-10')).toBeNull()
    })
  })

  it('shows error toast if required fields are missing', async () => {
    mount(AddGarmentPanel, {
      props: { isOpen: true },
    })

    const submitBtn = document.body.querySelector('button[type="submit"]') as HTMLElement
    submitBtn.click()

    expect(mockToast.show).toHaveBeenCalledWith('Please fill in all required fields', 'error')
  })

  it('submits correctly when form is valid', async () => {
    const wrapper = mount(AddGarmentPanel, {
      props: { isOpen: true },
    })

    const inputs = document.body.querySelectorAll('input')

    const fillInput = (input: HTMLInputElement, value: string) => {
      input.value = value
      input.dispatchEvent(new Event('input'))
    }

    fillInput(inputs[0], 'New Jacket')
    fillInput(inputs[1], 'Brand X')
    fillInput(inputs[2], 'https://image.com/test.jpg')
    fillInput(inputs[3], 'White')
    fillInput(inputs[4], '40')

    const submitBtn = document.body.querySelector('button[type="submit"]') as HTMLElement
    submitBtn.click()

    await vi.waitFor(() => {
      expect(wrapper.emitted()).toHaveProperty('added')
      expect(wrapper.emitted()).toHaveProperty('close')
      expect(mockToast.show).toHaveBeenCalledWith('New garment added to collection', 'success')
    })
  })
})

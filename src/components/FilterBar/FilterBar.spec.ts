import { cleanup, render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import FilterBar from './FilterBar.vue'

describe('FilterBar.vue', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders all category options correctly', () => {
    render(FilterBar, {
      props: { activeCategory: 'all' },
    })

    expect(screen.getByText(/outerwear/i)).toBeTruthy()
    expect(screen.getByText(/tops/i)).toBeTruthy()
    expect(screen.getByText(/bottoms/i)).toBeTruthy()
  })

  it('marks the active category visually', () => {
    render(FilterBar, {
      props: { activeCategory: 'tops' },
    })

    const topsButton = screen.getByRole('button', { name: /tops/i })

    expect(topsButton.className).toContain('text-brand-black')
  })

  it('emits select event with correct category when clicked', async () => {
    const user = userEvent.setup()
    const { emitted } = render(FilterBar, {
      props: { activeCategory: 'all' },
    })

    const outerwearButton = screen.getByRole('button', { name: /outerwear/i })

    await user.click(outerwearButton)

    expect(emitted()).toHaveProperty('select')
    expect(emitted().select[0]).toEqual(['outerwear'])
  })
})

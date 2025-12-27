import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import FilterBar from './FilterBar.vue'

describe('FilterBar.vue', () => {
  it('renders categories correctly', () => {
    const wrapper = mount(FilterBar, {
      props: { activeCategory: 'all' },
    })

    expect(wrapper.text()).toContain('outerwear')
    expect(wrapper.text()).toContain('tops')
  })

  it('emits select event when a category is clicked', async () => {
    const wrapper = mount(FilterBar, {
      props: { activeCategory: 'all' },
    })

    const buttons = wrapper.findAll('button')
    const topsButton = buttons.find((b) => b.text().includes('tops'))

    await topsButton?.trigger('click')

    expect(wrapper.emitted('select')?.[0]).toEqual(['tops'])
  })
})

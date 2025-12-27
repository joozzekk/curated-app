<script setup lang="ts">
import type { GarmentCategory } from '@/types'

const categories = [
  'all',
  'tops',
  'bottoms',
  'outerwear',
  'footwear',
  'accessories',
] as GarmentCategory[]

defineProps<{
  activeCategory: string
}>()

defineEmits<{
  (e: 'select', category: GarmentCategory): void
}>()
</script>

<template>
  <nav
    class="flex items-center overflow-x-auto whitespace-nowrap scrollbar-hide px-6 md:px-0 md:justify-center gap-x-8 py-8 md:py-12 border-b border-brand-gray/30"
  >
    <button
      v-for="cat in categories"
      :key="cat"
      @click="$emit('select', cat)"
      class="relative text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 pb-2 cursor-pointer shrink-0"
      :class="[
        activeCategory === cat
          ? 'text-brand-black font-semibold'
          : 'text-brand-dark-gray hover:text-brand-black font-light',
      ]"
    >
      {{ cat }}
      <span
        v-if="activeCategory === cat"
        class="absolute bottom-0 left-0 w-full h-px bg-brand-black transition-all duration-500"
      />
    </button>
  </nav>
</template>

<style scoped>
/* Ukrywamy scrollbar, żeby zachować minimalistyczny wygląd, zachowując funkcjonalność scrolla */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

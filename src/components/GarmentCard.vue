<script setup lang="ts">
import type { Garment } from '@/types'

defineProps<{
  garment: Garment
}>()
</script>

<template>
  <div class="group cursor-pointer">
    <div class="relative aspect-3/4 overflow-hidden bg-brand-gray">
      <img
        :src="garment.imageUrl"
        :alt="garment.name"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        class="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100"
      />
    </div>

    <div class="mt-4 flex justify-between items-start px-1">
      <div>
        <h3 class="text-xs font-medium uppercase tracking-widest text-brand-black">
          {{ garment.brand }}
        </h3>
        <p class="mt-1 text-sm text-brand-dark-gray font-light">
          {{ garment.name }}
        </p>
      </div>
      <span class="text-xs font-serif italic text-brand-dark-gray">
        {{ garment.category }}
      </span>
    </div>
  </div>
</template>

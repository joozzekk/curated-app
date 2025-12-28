<script setup lang="ts">
import '@/assets/main.css'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Curated — Your Minimalist Digital Wardrobe',
  meta: [
    {
      name: 'description',
      content:
        'A luxury digital closet for the modern minimalist. Track and curate your collection.',
    },
    { property: 'og:title', content: 'Curated — Digital Wardrobe' },
    {
      property: 'og:description',
      content: 'Effortless wardrobe management for high-end collections.',
    },
    { property: 'og:image', content: 'https://curated-art.netlify.app/og-image.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
})
</script>

<template>
  <DefaultLayout />
</template>

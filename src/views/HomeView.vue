<script setup lang="ts">
import GarmentCard from '@/components/GarmentCard.vue'
import type { Garment } from '@/types'
import { reactive } from 'vue'

const garments = reactive<Garment[]>([
  {
    id: '1',
    name: 'Fluffy Jacket',
    imageUrl:
      'https://img.ltwebstatic.com/v4/j/pi/2025/12/10/ad/1765361064ec107c6e9ba17e1d3f2ae008255d5be8_thumbnail_405x.webp',
    brand: 'CozyWear',
    category: 'outerwear',
    color: 'black',
    timesWorn: 3,
    lastWorn: new Date('2024-12-01'),
    purchasePrice: 89.99,
  },
  {
    id: '2',
    name: 'Black Joggers',
    imageUrl:
      'https://boutique-warszawa.com/cdn/shop/files/image_5_3cf3f0b5-559c-4270-80c3-6186705900fe.png?v=1761828444&width=5000',
    brand: 'Boutique Warszawa',
    category: 'bottoms',
    color: 'black',
    timesWorn: 3,
    lastWorn: new Date('2024-12-01'),
    purchasePrice: 89.99,
  },
  {
    id: '3',
    name: 'White Jordans',
    imageUrl:
      'https://storamore.pl/images/sh193/237000-238000/Air-Jordan-4-308497-100-Biale_%5B237839%5D_1200.jpg',
    brand: 'Staramore',
    category: 'footwear',
    color: 'white',
    timesWorn: 1,
    lastWorn: new Date('2025-12-30'),
    purchasePrice: 109.99,
  },
  {
    id: '4',
    name: "White Levi's T-Shirt",
    imageUrl:
      'https://img.kwcdn.com/product/open/6cac1dcfd8cb4142a4ffa5d761786239-goods.jpeg?imageView2/2/w/800/q/70/format/avif',
    brand: "Levi's",
    category: 'tops',
    color: 'white',
    timesWorn: 1,
    lastWorn: new Date('2025-12-28'),
    purchasePrice: 79.99,
  },
])
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8 py-12">
    <GarmentCard v-for="garment in garments" :key="garment.id" :garment="garment" />
  </div>
</template>

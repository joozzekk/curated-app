<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Garment } from '@/types'
import GarmentCard from '@/components/GarmentCard.vue'
import FilterBar from '@/components/FilterBar.vue'
import GarmentModal from '@/components/GarmentModal.vue'
import CoreToast from '@/components/CoreToast.vue'
import AddGarmentPanel from '@/components/AddGarmentPanel.vue'

const garments = ref<Garment[]>([])
const currentCategory = ref('all')
const isAddPanelOpen = ref(false)
const loading = ref(true)

const fetchGarments = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('garments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Błąd pobierania:', error.message)
  } else {
    garments.value = data
  }
  loading.value = false
}

const filteredGarments = computed(() => {
  if (currentCategory.value === 'all') return garments.value
  return garments.value.filter((g) => g.category === currentCategory.value)
})

const selectedGarment = ref<Garment | null>(null)
const isModalOpen = ref(false)

const openModal = (garment: Garment) => {
  selectedGarment.value = garment
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleUpdate = (newGarment: Garment) => {
  selectedGarment.value = newGarment

  const index = garments.value.findIndex((g) => g.id === newGarment.id)
  if (index !== -1) {
    garments.value[index] = newGarment
  }
}

const handleDeleted = (id: string) => {
  garments.value = garments.value.filter((g) => g.id !== id)
}

onMounted(() => {
  fetchGarments()
})
</script>

<template>
  <main class="bg-brand-white">
    <button
      @click="isAddPanelOpen = true"
      class="text-[10px] flex my-4 mx-auto uppercase tracking-widest border border-brand-black px-4 py-2 hover:bg-brand-black hover:text-brand-white transition-all cursor-pointer"
    >
      + Add Piece
    </button>

    <FilterBar :active-category="currentCategory" @select="(cat) => (currentCategory = cat)" />

    <div v-if="loading" class="flex justify-center py-20">
      <p class="text-[10px] uppercase tracking-widest animate-pulse">Loading Collection...</p>
    </div>

    <TransitionGroup
      name="grid"
      tag="div"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-12"
    >
      <GarmentCard
        v-for="garment in filteredGarments"
        :key="garment.id"
        :garment="garment"
        @click="openModal(garment)"
      />
    </TransitionGroup>

    <GarmentModal
      :garment="selectedGarment"
      :is-open="isModalOpen"
      @close="closeModal"
      @updated="handleUpdate"
      @deleted="handleDeleted"
    />
    <AddGarmentPanel
      :is-open="isAddPanelOpen"
      @close="isAddPanelOpen = false"
      @added="fetchGarments"
    />
    <CoreToast />
  </main>
</template>

<style scoped>
.grid-enter-active,
.grid-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.grid-enter-from,
.grid-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.grid-move {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.grid-leave-active {
  position: absolute;
  width: calc(100% - 6rem);
}

@media (min-width: 768px) {
  .grid-leave-active {
    width: calc((100% - 6rem - 3rem) / 2);
  }
}

@media (min-width: 1024px) {
  .grid-leave-active {
    width: calc((100% - 6rem - 9rem) / 4);
  }
}
</style>

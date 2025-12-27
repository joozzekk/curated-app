<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Garment } from '@/types'
import GarmentCard from '@/components/UI/GarmentCard.vue'
import FilterBar from '@/components/FilterBar/FilterBar.vue'
import GarmentModal from '@/components/GarmentModal/GarmentModal.vue'
import CoreToast from '@/components/UI/CoreToast.vue'
import AddGarmentPanel from '@/components/AddGarmentPanel/AddGarmentPanel.vue'
import { useWardrobeStore } from '@/stores/wardrobe'
import GarmentSkeleton from '@/components/UI/GarmentSkeleton.vue'

const isAddPanelOpen = ref(false)
const wardrobe = useWardrobeStore()

const isModalOpen = ref(false)

const openModal = (garment: Garment) => {
  wardrobe.selectGarment(garment)
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

onMounted(() => {
  wardrobe.fetchGarments()
})
</script>

<template>
  <main class="bg-brand-white">
    <Teleport to="#actions">
      <button
        @click="isAddPanelOpen = true"
        class="text-[10px] flex my-4 mx-auto uppercase tracking-widest border border-brand-black px-4 py-2 hover:bg-brand-black hover:text-brand-white transition-all cursor-pointer"
      >
        + Add Piece
      </button>
    </Teleport>

    <FilterBar
      :active-category="wardrobe.currentCategory"
      @select="(cat) => wardrobe.setCategory(cat)"
    />

    <div class="px-12 w-full relative">
      <div v-if="wardrobe.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <GarmentSkeleton v-for="n in 8" :key="n" />
      </div>

      <TransitionGroup
        v-else-if="wardrobe.filteredGarments.length > 0"
        name="grid"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative"
      >
        <GarmentCard
          v-for="garment in wardrobe.filteredGarments"
          :key="garment.id"
          :garment="garment"
          @click="openModal(garment)"
        />
      </TransitionGroup>

      <div v-else class="flex flex-col items-center justify-center py-32 animate-fade-in">
        <span class="text-[10px] uppercase tracking-[0.4em] text-brand-dark-gray mb-4">
          Collection Empty
        </span>
        <p class="font-serif italic text-xl text-brand-black mb-8">
          No items found in {{ wardrobe.currentCategory }}
        </p>
        <button
          v-if="wardrobe.currentCategory !== 'all'"
          @click="wardrobe.setCategory('all')"
          class="text-[9px] uppercase tracking-widest underline underline-offset-8 opacity-60 hover:opacity-100 transition-opacity"
        >
          View All Categories
        </button>
      </div>
    </div>

    <GarmentModal
      :garment="wardrobe.selectedGarment"
      :is-open="isModalOpen"
      @close="closeModal"
      @updated="wardrobe.updateGarmentInList($event)"
      @deleted="wardrobe.removeGarmentFromList($event)"
    />
    <AddGarmentPanel
      :is-open="isAddPanelOpen"
      @close="isAddPanelOpen = false"
      @added="wardrobe.fetchGarments"
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
  width: calc(100%);
}

@media (min-width: 768px) {
  .grid-leave-active {
    width: calc((100% - 3rem) / 2);
  }
}

@media (min-width: 1024px) {
  .grid-leave-active {
    width: calc((100% - 9rem) / 4);
  }
}
</style>

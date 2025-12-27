import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Garment } from '@/types'

export const useWardrobeStore = defineStore('wardrobe', () => {
  const garments = ref<Garment[]>([])
  const selectedGarment = ref<Garment | null>(null)
  const currentCategory = ref('all')
  const loading = ref(false)

  const fetchGarments = async () => {
    loading.value = true
    const { data, error } = await supabase
      .from('garments')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      garments.value = data
    }
    loading.value = false
  }

  const filteredGarments = computed(() => {
    if (currentCategory.value === 'all') return garments.value
    return garments.value.filter((g) => g.category === currentCategory.value)
  })

  const updateGarmentInList = (newGarment: Garment) => {
    selectedGarment.value = newGarment

    const index = garments.value.findIndex((g) => g.id === newGarment.id)
    if (index !== -1) {
      garments.value[index] = newGarment
    }
  }

  const removeGarmentFromList = (id: string) => {
    garments.value = garments.value.filter((g) => g.id !== id)
  }

  const setCategory = (category: string) => {
    currentCategory.value = category
  }

  const selectGarment = (garment: Garment | null) => {
    selectedGarment.value = garment
  }

  return {
    loading,
    garments,
    filteredGarments,
    currentCategory,
    selectedGarment,
    selectGarment,
    setCategory,
    fetchGarments,
    updateGarmentInList,
    removeGarmentFromList,
  }
})

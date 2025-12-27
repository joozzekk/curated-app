<script setup lang="ts">
import { supabase } from '@/lib/supabase'
import { type Garment } from '@/types'
import { useToastStore } from '@/stores/toast'
import { ref } from 'vue'
import { ToastType } from '@/types/toast'

const toast = useToastStore()
const isDeleting = ref(false)
const showConfirm = ref(false)

const props = defineProps<{
  garment: Garment | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated', newGarment: Garment): void
  (e: 'deleted', id: string): void
}>()

const markAsWorn = async () => {
  if (!props.garment) return

  const { data, error } = await supabase
    .from('garments')
    .update({
      times_worn: props.garment.times_worn + 1,
      last_worn: new Date().toISOString(),
    })
    .eq('id', props.garment.id)
    .select()

  if (error) {
    toast.show('Error updating', ToastType.ERROR)
  } else if (data && data[0]) {
    toast.show('Garment updated!', ToastType.SUCCESS)
    emit('updated', data[0])
  }
}

const closeModal = () => {
  isDeleting.value = false
  showConfirm.value = false

  emit('close')
}

const deleteGarment = async () => {
  if (!props.garment) return

  isDeleting.value = true
  const { error } = await supabase.from('garments').delete().eq('id', props.garment.id)

  if (error) {
    toast.show('Error deleting item', ToastType.ERROR)
    isDeleting.value = false
  } else {
    toast.show('Item removed from collection', ToastType.SUCCESS)
    emit('deleted', props.garment.id)
    closeModal()
  }
}
</script>
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen && garment"
        class="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-md hover:cursor-pointer"
          @click="closeModal"
        />

        <div
          class="relative w-full h-full md:h-auto md:max-w-4xl bg-brand-white overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col md:flex-row animate-slide-up"
        >
          <button
            @click="closeModal"
            class="fixed md:absolute top-6 right-6 z-50 text-brand-black bg-brand-white/80 p-2 rounded-full md:bg-transparent md:p-0 transition-transform active:scale-90 cursor-pointer"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="w-full md:w-1/2 shrink-0 bg-brand-gray aspect-3/4 md:aspect-auto">
            <img :src="garment.image_url" :alt="garment.name" class="w-full h-full object-cover" />
          </div>

          <div class="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
            <div class="mb-6 md:mb-10">
              <h3
                class="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-brand-dark-gray mb-2"
              >
                {{ garment.brand }}
              </h3>
              <h2 class="font-serif text-2xl md:text-4xl text-brand-black italic leading-tight">
                {{ garment.name }}
              </h2>
            </div>

            <div class="space-y-4 md:space-y-6 border-t border-brand-gray pt-6 md:pt-8">
              <div class="grid grid-cols-2 gap-4 md:flex md:flex-col md:space-y-6">
                <div
                  class="flex flex-col md:flex-row md:justify-between border-b border-brand-gray/50 pb-2 md:border-none md:pb-0"
                >
                  <span
                    class="text-[8px] md:text-[10px] uppercase tracking-widest text-brand-dark-gray mb-1 md:mb-0"
                    >Category</span
                  >
                  <span class="text-xs md:text-sm font-light uppercase tracking-wider">{{
                    garment.category
                  }}</span>
                </div>

                <div
                  class="flex flex-col md:flex-row md:justify-between border-b border-brand-gray/50 pb-2 md:border-none md:pb-0"
                >
                  <span
                    class="text-[8px] md:text-[10px] uppercase tracking-widest text-brand-dark-gray mb-1 md:mb-0"
                    >Price</span
                  >
                  <span class="text-xs md:text-sm font-medium">£{{ garment.purchase_price }}</span>
                </div>

                <div
                  class="flex flex-col md:flex-row md:justify-between border-b border-brand-gray/50 pb-2 md:border-none md:pb-0"
                >
                  <span
                    class="text-[8px] md:text-[10px] uppercase tracking-widest text-brand-dark-gray mb-1 md:mb-0"
                    >Times Worn</span
                  >
                  <span class="text-xs md:text-sm font-medium">{{ garment.times_worn }}</span>
                </div>

                <div class="flex flex-col md:flex-row md:justify-between">
                  <span
                    class="text-[8px] md:text-[10px] uppercase tracking-widest text-brand-dark-gray mb-1 md:mb-0"
                    >Last Worn</span
                  >
                  <span class="text-xs md:text-sm font-light italic">
                    {{
                      garment.last_worn ? new Date(garment.last_worn).toLocaleDateString() : 'Never'
                    }}
                  </span>
                </div>
              </div>
            </div>

            <button
              class="mt-8 md:mt-12 w-full border border-brand-black py-4 text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:bg-brand-black hover:text-brand-white active:bg-brand-black active:text-brand-white transition-all duration-300 z-50 cursor-pointer"
              @click="markAsWorn"
            >
              Mark as Worn Today
            </button>

            <div class="mt-8 flex justify-center">
              <template v-if="!showConfirm">
                <button
                  @click="showConfirm = true"
                  class="text-[9px] uppercase tracking-widest text-brand-dark-gray hover:text-red-800 transition-colors underline underline-offset-4"
                >
                  Remove from collection
                </button>
              </template>

              <div v-else class="flex items-center gap-4">
                <span class="text-[9px] uppercase tracking-widest text-red-800">Are you sure?</span>
                <button
                  @click="deleteGarment"
                  :disabled="isDeleting"
                  class="text-[9px] uppercase tracking-widest font-bold text-red-800 hover:underline"
                >
                  Yes, delete
                </button>
                <button
                  @click="showConfirm = false"
                  class="text-[9px] uppercase tracking-widest text-brand-black hover:underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-slide-up {
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>

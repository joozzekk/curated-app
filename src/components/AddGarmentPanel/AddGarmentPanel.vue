<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useToastStore } from '@/stores/toast'
import { ToastType } from '@/types/toast'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'added'): void }>()
const toast = useToastStore()
const isSaving = ref(false)

const categories = ['tops', 'bottoms', 'outerwear', 'footwear', 'accessories'] as const

const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const selectCategory = (cat: (typeof categories)[number]) => {
  form.category = cat
  isDropdownOpen.value = false
}

// Zamykanie dropdowna przy kliknięciu poza nim
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

const form = reactive({
  name: '',
  brand: '',
  category: 'tops' as (typeof categories)[number],
  image_url: '',
  color: '',
  purchase_price: 0,
})

const resetForm = () => {
  form.name = ''
  form.brand = ''
  form.category = 'tops'
  form.image_url = ''
  form.color = ''
  form.purchase_price = 0
}

const saveGarment = async () => {
  if (!form.name || !form.brand || !form.image_url) {
    toast.show('Please fill in all required fields', ToastType.ERROR)
    return
  }

  isSaving.value = true
  const { error } = await supabase.from('garments').insert([form])

  if (error) {
    toast.show('Error adding garment', ToastType.ERROR)
    console.error(error.message)
  } else {
    toast.show('New garment added to collection', ToastType.SUCCESS)
    resetForm()
    emit('added')
    emit('close')
  }
  isSaving.value = false
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<template>
  <Teleport to="body">
    <Transition name="slide">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden">
        <div
          class="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
          @click="emit('close')"
        />

        <div class="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div class="w-screen max-w-md transform bg-brand-white shadow-2xl transition-all">
            <div class="flex h-full flex-col p-8 md:p-12">
              <div class="flex items-center justify-between mb-12">
                <h2 class="font-serif text-2xl italic text-brand-black">Add New Piece</h2>
                <button
                  @click="emit('close')"
                  class="text-brand-black hover:scale-110 transition-transform"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form @submit.prevent="saveGarment" class="space-y-8 flex-1">
                <div>
                  <label
                    class="block text-[10px] uppercase tracking-widest text-brand-dark-gray mb-2"
                    >Item Name</label
                  >
                  <input
                    v-model="form.name"
                    type="text"
                    class="w-full border-b border-brand-gray bg-transparent py-2 text-sm focus:border-brand-black outline-none transition-colors"
                    placeholder="e.g. Cashmere Sweater"
                  />
                </div>

                <div>
                  <label
                    class="block text-[10px] uppercase tracking-widest text-brand-dark-gray mb-2"
                    >Brand</label
                  >
                  <input
                    v-model="form.brand"
                    type="text"
                    class="w-full border-b border-brand-gray bg-transparent py-2 text-sm focus:border-brand-black outline-none transition-colors"
                    placeholder="e.g. Loro Piana"
                  />
                </div>

                <div class="relative" ref="dropdownRef">
                  <label
                    class="block text-[10px] uppercase tracking-widest text-brand-dark-gray mb-2"
                  >
                    Category
                  </label>

                  <div
                    @click="isDropdownOpen = !isDropdownOpen"
                    class="w-full border-b border-brand-gray bg-transparent py-2 text-sm cursor-pointer flex justify-between items-center group"
                  >
                    <span
                      class="uppercase tracking-wider transition-colors"
                      :class="isDropdownOpen ? 'text-brand-black' : 'text-brand-dark-gray'"
                    >
                      {{ form.category }}
                    </span>
                    <svg
                      class="transition-transform duration-300"
                      :class="{ 'rotate-180': isDropdownOpen }"
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                    >
                      <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1" />
                    </svg>
                  </div>

                  <Transition name="fade-slide">
                    <div
                      v-if="isDropdownOpen"
                      class="absolute z-10 w-full mt-1 bg-brand-white border border-brand-gray shadow-xl py-2"
                    >
                      <div
                        v-for="cat in categories"
                        :key="cat"
                        @click="selectCategory(cat)"
                        class="px-4 py-3 text-[10px] uppercase tracking-widest cursor-pointer transition-colors hover:bg-brand-gray/30"
                        :class="
                          form.category === cat
                            ? 'text-brand-black font-semibold'
                            : 'text-brand-dark-gray'
                        "
                      >
                        {{ cat }}
                      </div>
                    </div>
                  </Transition>
                </div>

                <div>
                  <label
                    class="block text-[10px] uppercase tracking-widest text-brand-dark-gray mb-2"
                    >Image URL</label
                  >
                  <input
                    v-model="form.image_url"
                    type="url"
                    class="w-full border-b border-brand-gray bg-transparent py-2 text-sm focus:border-brand-black outline-none transition-colors"
                    placeholder="https://..."
                  />
                </div>

                <div class="grid grid-cols-2 gap-8">
                  <div>
                    <label
                      class="block text-[10px] uppercase tracking-widest text-brand-dark-gray mb-2"
                      >Color</label
                    >
                    <input
                      v-model="form.color"
                      type="text"
                      class="w-full border-b border-brand-gray bg-transparent py-2 text-sm focus:border-brand-black outline-none transition-colors"
                      placeholder="e.g. Beige"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-[10px] uppercase tracking-widest text-brand-dark-gray mb-2"
                      >Price (£)</label
                    >
                    <input
                      v-model.number="form.purchase_price"
                      type="number"
                      class="w-full border-b border-brand-gray bg-transparent py-2 text-sm focus:border-brand-black outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="isSaving"
                  class="w-full mt-12 border border-brand-black py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-brand-black hover:text-brand-white transition-all duration-300 disabled:opacity-50"
                >
                  {{ isSaving ? 'Saving...' : 'Add to Collection' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(100%);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Backdrop fade */
.slide-enter-active .bg-black\/20 {
  transition: opacity 0.5s ease;
}
.slide-enter-from .bg-black\/20 {
  opacity: 0;
}
</style>

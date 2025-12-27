import { ToastType } from '@/types/toast'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const type = ref<ToastType>(ToastType.SUCCESS)
  const isVisible = ref(false)
  let timeoutId: number | null = null

  const show = (msg: string, t: ToastType = ToastType.SUCCESS) => {
    message.value = msg
    type.value = t
    isVisible.value = true

    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = window.setTimeout(() => {
      isVisible.value = false
    }, 3000)
  }

  return { message, type, isVisible, show }
})

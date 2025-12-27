<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
const toast = useToastStore()
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-fade">
      <div
        v-if="toast.isVisible"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 z-100 px-6 py-3 shadow-xl flex items-center gap-4"
        :class="
          toast.type === 'success' ? 'bg-brand-black text-brand-white' : 'bg-red-900 text-white'
        "
      >
        <span class="text-[9px] uppercase tracking-[0.25em] whitespace-nowrap">
          {{ toast.message }}
        </span>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, 20px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}
</style>

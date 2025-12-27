<script lang="ts" setup></script>

<template>
  <div class="min-h-screen flex flex-col bg-brand-white">
    <header>
      <h1
        class="text-3xl font-sans font-black uppercase mt-4 text-center text-brand-black tracking-[0.55rem]"
      >
        Curated
      </h1>

      <p class="text-center font-serif mt-2">Your new outfit for every occasion</p>
    </header>

    <router-view />

    <footer class="mt-auto text-center w-full text-xs py-2">
      <p>© 2024 Curated App</p>
    </footer>
  </div>
</template>

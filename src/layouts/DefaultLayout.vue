<script lang="ts" setup></script>

<template>
  <div class="min-h-screen flex flex-col bg-brand-white">
    <header class="relative flex flex-col lg:flex-row w-full justify-between px-10 py-4">
      <div class="flex w-full flex-col items-center pt-8 pb-4">
        <h1
          class="text-3xl font-sans font-black uppercase text-center text-brand-black tracking-[0.55rem]"
        >
          Curated
        </h1>

        <p class="text-center font-serif mt-2">Your new outfit for every occasion</p>
      </div>

      <div id="actions" class="relative lg:absolute lg:right-10"></div>
    </header>

    <router-view />

    <footer class="mt-auto text-center w-full text-xs py-2">
      <p>© 2024 Curated App</p>
    </footer>
  </div>
</template>

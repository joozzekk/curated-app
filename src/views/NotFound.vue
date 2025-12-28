<template>
  <main class="my-auto bg-brand-white flex flex-col items-center justify-center px-6 text-center">
    <span class="text-[12px] uppercase tracking-[0.5em] text-brand-dark-gray mb-4">Error 404</span>
    <h1 class="font-serif italic text-4xl md:text-6xl text-brand-black mb-8">
      This piece is not in your collection
    </h1>
    <p
      class="max-w-md text-brand-dark-gray text-sm leading-relaxed mb-12 uppercase tracking-widest"
    >
      The page you are looking for has been moved or does not exist.
    </p>
    <router-link
      to="/"
      class="text-[10px] uppercase tracking-[0.3em] border-b border-brand-black pb-2 hover:opacity-60 transition-opacity"
    >
      Back to Collection
    </router-link>
  </main>
</template>

<script lang="ts" setup>
const { context } = useContext()

const pathData = computed(() => {
  return context.value === 'professional'
    ? 'M0,0 L1440,0 L1440,250 Q720,230 0,250 Z'
    : 'M0,0 L1440,0 L1440,220 Q720,300 0,220 Z'
})
</script>

<template>
  <header class="relative py-24">
    <div class="absolute inset-0">
      <svg width="100%" height="100%" viewBox="0 0 1440 300" preserveAspectRatio="none">
        <path :d="pathData" fill="currentColor" class="text-brand-secundary transition-all duration-1000 ease-in-out" />
      </svg>
    </div>

    <div class="relative text-center">
      <h1 class="font-bold text-4xl mb-8" :class="context === 'professional' ? 'text-white' : 'text-black'">
        cawe.dev
      </h1>

      <div class="inline-flex bg-black/10 p-1 rounded-full">
        <button @click="context = 'professional'" class="px-8 py-2 rounded-full text-sm font-bold"
          :class="context === 'professional' ? 'bg-brand-secundary text-white' : 'text-brand-text'">
          Profissional
        </button>
        <button @click="context = 'personal'" class="px-8 py-2 rounded-full text-sm font-bold"
          :class="context === 'personal' ? 'bg-brand-secundary text-white' : 'text-brand-text'">
          Pessoal
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
</script>
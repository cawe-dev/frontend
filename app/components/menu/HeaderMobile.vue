<script lang="ts" setup>
const { context } = useContext()
</script>

<template>
  <header class="bg-brand-secundary py-28">
    <h1 class="font-bold text-center text-white text-2xl mb-1.5">Cawe.dev</h1>

    <div class="grid grid-rows-2 justify-center-safe">
      <div class="bg-black/10 p-1 rounded-full">
        <button @click="context = 'professional'" class="px-6 py-2 rounded-full text-sm font-medium transition-all"
          :class="context === 'professional' ? 'bg-brand-secundary text-white' : 'text-brand-text'">
          Profissional
        </button>
        <button @click="context = 'personal'" class="px-6 py-2 rounded-full text-sm font-medium transition-all"
          :class="context === 'personal' ? 'bg-brand-secundary text-white' : 'text-brand-text'">
          Pessoal
        </button>
      </div>
    </div>

  </header>
</template>

<style scoped>
header {
  clip-path: polygon(0% 0%, 100% 0%, 100% 85%, 50% 80%, 0% 85%);
}
</style>
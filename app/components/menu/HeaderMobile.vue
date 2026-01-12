<script lang="ts" setup>
const { context } = useContext()

</script>

<template>
  <UHeader :toggle="{ disabled: true, class: 'hidden' }" class="bg-brand-secundary">
    <template #title>
      <Logo class="h-6 w-auto" />
      <h1 :class="context === 'professional' ? 'text-white' : 'text-black'">
        cawe.dev
      </h1>
    </template>

    <UNavigationMenu />

    <template #right>
      <div class="inline-flex bg-black/10 p-1 mr-2 rounded-full">
        <button @click="context = 'professional'" class="px-1 py-2 rounded-full text-sm font-bold"
          :class="context === 'professional' ? 'bg-brand-secundary text-white' : 'text-brand-text'">
          Profissional
        </button>
        <button @click="context = 'personal'" class="px-1 py-2 rounded-full text-sm font-bold"
          :class="context === 'personal' ? 'bg-brand-secundary text-white' : 'text-brand-text'">
          Pessoal
        </button>
      </div>

      <UTooltip text="News" :kbds="['meta', 'G']">
        <UButton class="active:bg-brand-secundary" :class="context === 'professional' ? 'text-white' : 'text-black'"
          variant="ghost" icon="i-mdi-light:bell" aria-label="GitHub" />
      </UTooltip>

      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton class="active:bg-brand-secundary" :class="context === 'professional' ? 'text-white' : 'text-black'"
          variant="ghost" to="https://github.com/cawe-dev" target="_blank" icon="i-simple-icons-github"
          aria-label="GitHub" />
      </UTooltip>
    </template>

    <template #bottom>
    </template>

  </UHeader>
</template>

<script setup>
</script>
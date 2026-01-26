<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth'

definePageMeta({
  layout: 'dashboard',
})

const authStore = useAuthStore()
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Bem vindo(a), {{ authStore.user?.name || 'User' }}!</h2>
    <p class="text-gray-600">Sobre o que vamos falar hoje?</p>
  </div>

  <div class="flex space-x-4 py-4 justify-end">
    <UButton label="Criar Novo Post" icon="i-lucide-plus" class="bg-primary" @click="navigateTo('/admin/posts/new')" />
    <UButton label="Gerenciar Posts" icon="i-lucide-list" class="bg-accented text-black border border-gray-700 hover:bg-accented/60"
      @click="navigateTo('/admin/posts/list')" />
  </div>

  <UContainer>
    <USkeleton class="h-48 w-full mt-6" />
    <USkeleton class="h-48 w-full mt-6" />
    <USkeleton class="h-48 w-full mt-6" />
    <USkeleton class="h-48 w-full mt-6" />
    <USkeleton class="h-48 w-full mt-6" />
  </UContainer>
</template>
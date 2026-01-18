<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
          <UButton color="primary" variant="ghost" icon="i-heroicons-arrow-left-on-rectangle"
            @click="authStore.logout()">
            Sair
          </UButton>
        </div>
      </template>
      <div v-if="authStore.user" class="space-y-4">
        <div class="flex items-center space-x-4">
          <UAvatar :alt="authStore.user.name" size="lg" />
          <div>
            <p class="text-xl font-semibold">{{ authStore.user.name }}</p>
            <p class="text-gray-500">{{ authStore.user.email }}</p>
          </div>
        </div>

        <UDivider class="my-4" />

        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-xs text-gray-400 uppercase">ID do Utilizador</p>
            <p class="font-mono text-lg">{{ authStore.user.id }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-xs text-gray-400 uppercase">Perfil (Role)</p>
            <UBadge :color="authStore.user.role === 'WRITER' ? 'primary' : 'secondary'">
              {{ authStore.user.role }}
            </UBadge>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-10">
        <UIcon name="i-heroicons-exclamation-circle" class="text-4xl text-yellow-500 mb-2" />
        <p>Dados do utilizador não carregados.</p>
      </div>
    </UCard>
  </div>
</template>
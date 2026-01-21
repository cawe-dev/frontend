<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth'

const { context } = useContext()
const config = useRuntimeConfig()
const authStore = useAuthStore()

const handleLogin = () => {
  navigateTo('/login')
}

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <UHeader :toggle="{ disabled: true, class: 'hidden' }" class="bg-brand-secundary">
    <template #title>
      <h1 :class="context === 'professional' ? 'text-white' : 'text-black'">
        cawe.dev
      </h1>
    </template>

    <UNavigationMenu />

    <template #right>
      <div class="inline-flex bg-black/10 p-1 mr-2 rounded-full">
        <button @click="context = 'professional'" class="px-1 md:px-10 py-2 rounded-full text-sm font-bold"
          :class="context === 'professional' ? 'bg-brand-secundary text-white' : 'text-brand-text'">
          Profissional
        </button>
        <button @click="context = 'personal'" class="px-1 md:px-10 py-2 rounded-full text-sm font-bold"
          :class="context === 'personal' ? 'bg-brand-secundary text-white' : 'text-brand-text'">
          Pessoal
        </button>
      </div>

      <UTooltip text="News" :kbds="['meta', 'N']">
        <UButton class="active:bg-brand-secundary" :class="context === 'professional' ? 'text-white' : 'text-black'"
          variant="ghost" icon="i-mdi-light:bell" aria-label="News" />
      </UTooltip>

      <div class="hidden md:block">
        <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
          <UButton class="active:bg-brand-secundary" :class="context === 'professional' ? 'text-white' : 'text-black'"
            variant="ghost" to="https://github.com/cawe-dev" target="_blank" icon="i-simple-icons-github"
            aria-label="GitHub" />
        </UTooltip>
      </div>

      <UTooltip v-if="!authStore.isAuthenticated" text="Login" :kbds="['meta', 'L']" class="w-12">
        <UButton class="active:bg-brand-secundary bg-black/10 border md:w-20"
          :class="context === 'professional' ? 'text-white' : 'text-black'" variant="ghost" @click="handleLogin"
          icon="i-ph:sign-in-fill" :block="true" aria-label="Login" />
      </UTooltip>

      <UTooltip v-else text="Logout" :kbds="['meta', 'L']" class="w-12">
        <UButton class="active:bg-brand-secundary bg-black/10 border md:w-20"
          :class="context === 'professional' ? 'text-white' : 'text-black'" variant="ghost" @click="handleLogout"
          icon="i-ph:sign-out-fill" :block="true" aria-label="Logout" />
      </UTooltip>
    </template>

    <template #bottom>
    </template>

  </UHeader>
</template>
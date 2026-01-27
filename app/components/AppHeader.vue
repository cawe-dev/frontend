<script setup lang="ts">
import { ref, computed } from 'vue'
import { useContext } from '~/composables/useContext'
import { useAuthStore } from '~~/stores/auth'

const { context, toggleContext } = useContext()
const authStore = useAuthStore()

const searchOpen = ref(false)
const mobileMenuOpen = ref(false)
const searchQuery = ref('')

const changelog = [
    { id: 1, type: 'feature' as const, title: 'Placeholder teste 1', date: 'Há 2 dias' },
    { id: 2, type: 'fix' as const, title: 'Placeholder teste 2', date: 'Há 5 dias' },
    { id: 3, type: 'improvement' as const, title: 'Placeholder teste 3', date: 'Há 1 semana' },
]

const navItems = [
    { label: 'Blog', to: '/' },
]

const changelogItems = computed(() =>
    changelog.map(item => ({
        label: item.title,
        slot: 'changelog-item' as const,
        type: item.type,
        date: item.date,
    }))
)

const getChangelogIcon = (type: string) => {
    switch (type) {
        case 'feature': return 'i-lucide-zap'
        case 'fix': return 'i-lucide-bug'
        case 'improvement': return 'i-lucide-check-circle-2'
        default: return 'i-lucide-circle'
    }
}

const getChangelogIconColor = (type: string) => {
    switch (type) {
        case 'feature': return 'text-[var(--ui-primary)]'
        case 'fix': return 'text-[var(--ui-error)]'
        case 'improvement': return 'text-[var(--ui-success)]'
        default: return 'text-[var(--ui-text-muted)]'
    }
}

const handleLogin = () => {
    navigateTo('/login')
}

const handleLogout = () => {
    authStore.logout()
}
</script>

<template>
    <header
        class="sticky top-0 z-50 w-full border-b border-default bg-(--ui-bg)/95 backdrop-blur supports-backdrop-filter:bg-(--ui-bg)/80">
        <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
            <!-- Logo -->
            <NuxtLink to="/" class="flex items-center gap-2">
                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-inverted">
                    <span class="font-mono text-sm font-bold">&lt;/&gt;</span>
                </div>
                <span class="hidden font-semibold tracking-tight text-default sm:inline-block">
                    Cawe.dev
                </span>
            </NuxtLink>

            <!-- Desktop Navigation -->
            <nav class="hidden items-center gap-6 md:flex">
                <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
                    class="text-sm font-medium text-muted transition-colors hover:text-default">
                    {{ item.label }}
                </NuxtLink>
            </nav>

            <!-- Actions -->
            <div class="flex items-center gap-2">
                <!-- Search -->
                <div class="relative hidden sm:block">
                    <div v-if="searchOpen" class="flex items-center gap-2">
                        <UInput v-model="searchQuery" type="search" placeholder="Pesquisar posts, tags..."
                            class="h-9 w-64" autofocus icon="i-lucide-search" />
                        <UButton variant="ghost" size="sm" icon="i-lucide-x" square @click="searchOpen = false" />
                    </div>
                    <UButton v-else variant="ghost" size="sm" icon="i-lucide-search" square @click="searchOpen = true">
                        <span class="sr-only">Pesquisar</span>
                    </UButton>
                </div>

                <!-- Changelog Dropdown -->
                <UDropdownMenu :items="changelogItems">
                    <UButton variant="ghost" size="sm" class="relative" square>
                        <UIcon name="i-lucide-bell" class="h-4 w-4" />
                        <span
                            class="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-inverted">
                            3
                        </span>
                        <span class="sr-only">Novidades</span>
                    </UButton>

                    <template #changelog-item="{ item }">
                        <div class="flex flex-col items-start gap-1 py-1">
                            <div class="flex items-center gap-2">
                                <UIcon :name="getChangelogIcon(item.type)"
                                    :class="['h-3.5 w-3.5', getChangelogIconColor(item.type)]" />
                                <span class="text-sm font-medium text-default">{{ item.label }}</span>
                            </div>
                            <span class="text-xs text-muted">{{ item.date }}</span>
                        </div>
                    </template>
                </UDropdownMenu>

                <!-- Theme Toggle -->
                <button @click="toggleContext"
                    class="relative flex h-9 items-center gap-1 rounded-full border border-default bg-accented p-1 transition-colors"
                    :aria-label="`Alternar para contexto ${context === 'professional' ? 'personal' : 'profissional'}`">
                    <span :class="[
                        'flex h-7 w-7 items-center justify-center rounded-full transition-all',
                        context === 'professional'
                            ? 'bg-primary text-inverted'
                            : 'text-muted'
                    ]">
                        <UIcon name="i-lucide-briefcase" class="h-4 w-4" />
                    </span>
                    <span :class="[
                        'flex h-7 w-7 items-center justify-center rounded-full transition-all',
                        context === 'personal'
                            ? 'bg-primary text-inverted'
                            : 'text-muted'
                    ]">
                        <UIcon name="i-lucide-coffee" class="h-4 w-4" />
                    </span>
                </button>
            </div>
        </div>
    </header>
</template>

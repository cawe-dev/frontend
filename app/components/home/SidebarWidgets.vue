<script setup lang="ts">
const statuses = [
    { icon: 'i-lucide-book-open', label: 'A ler', value: 'Clean Code', colorClass: 'text-[var(--chart-1)]' },
    { icon: 'i-lucide-tv', label: 'A ver', value: 'The Bear S3', colorClass: 'text-[var(--chart-2)]' },
    { icon: 'i-lucide-gamepad-2', label: 'A jogar', value: 'Elden Ring', colorClass: 'text-[var(--chart-3)]' },
]

const kanbanItems = [
    { status: 'todo', title: 'Migrar para Nuxt 4', icon: 'i-lucide-circle' },
    { status: 'doing', title: 'Sistema de likes', icon: 'i-lucide-circle-dot' },
    { status: 'done', title: 'Dark mode', icon: 'i-lucide-check-circle-2' },
]

const progress = 68
</script>

<template>
    <aside class="space-y-4">
        <!-- Spotify Widget -->
        <UCard>
            <template #header>
                <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-music" class="h-4 w-4" style="color: var(--spotify-green)" />
                    <span class="text-sm font-medium text-default">A Ouvir Agora</span>
                </div>
            </template>
            <div class="flex items-center gap-3">
                <div class="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-accented">
                    <div
                        class="flex h-full w-full items-center justify-center bg-linear-to-br from-(--ui-primary)/20 to-(--ui-primary)/5">
                        <UIcon name="i-lucide-music" class="h-5 w-5 text-muted" />
                    </div>
                    <span class="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                        <span class="absolute inline-flex h-full w-full rounded-full spotify-pulse"
                            style="background-color: var(--spotify-green); opacity: 0.75" />
                        <span class="relative inline-flex h-3 w-3 rounded-full"
                            style="background-color: var(--spotify-green)" />
                    </span>
                </div>
                <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-default">Bohemian Rhapsody</p>
                    <p class="truncate text-xs text-muted">Queen</p>
                </div>
            </div>
        </UCard>

        <!-- Status Stack Widget -->
        <UCard>
            <template #header>
                <span class="text-sm font-medium text-default">Estado Atual</span>
            </template>
            <div class="space-y-3">
                <div v-for="status in statuses" :key="status.label" class="flex items-center gap-3">
                    <div
                        :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accented', status.colorClass]">
                        <UIcon :name="status.icon" class="h-4 w-4" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="text-xs text-muted">{{ status.label }}</p>
                        <p class="truncate text-sm font-medium text-default">{{ status.value }}</p>
                    </div>
                </div>
            </div>
        </UCard>

        <!-- Dev Tools Widget -->
        <UCard>
            <template #header>
                <span class="text-sm font-medium text-default">Dev Tools</span>
            </template>
            <div class="space-y-4">
                <!-- Links -->
                <div class="flex gap-2">
                    <a href="#"
                        class="flex flex-1 items-center justify-center gap-2 rounded-md border border-default bg-(--ui-bg-accented)/50 px-3 py-2 text-xs font-medium text-default transition-colors hover:bg-accented">
                        <UIcon name="i-lucide-github" class="h-3.5 w-3.5" />
                        GitHub
                    </a>
                    <a href="#"
                        class="flex flex-1 items-center justify-center gap-2 rounded-md border border-default bg-(--ui-bg-accented)/50 px-3 py-2 text-xs font-medium text-default transition-colors hover:bg-accented">
                        <UIcon name="i-lucide-external-link" class="h-3.5 w-3.5" />
                        SonarQube
                    </a>
                </div>

                <!-- Mini Kanban -->
                <div class="space-y-2">
                    <p class="text-xs font-medium text-muted">Mini Kanban</p>
                    <div v-for="item in kanbanItems" :key="item.title"
                        class="flex items-center gap-2 rounded-md bg-(--ui-bg-accented)/50 px-2.5 py-1.5 text-xs">
                        <UIcon :name="item.icon" :class="[
                            'h-3.5 w-3.5',
                            item.status === 'done'
                                ? 'text-(--ui-success)'
                                : item.status === 'doing'
                                    ? 'text-primary'
                                    : 'text-muted'
                        ]" />
                        <span class="truncate text-default">{{ item.title }}</span>
                    </div>
                </div>
            </div>
        </UCard>

        <!-- Feature Progress Widget -->
        <UCard class="border-(--ui-primary)/20 bg-(--ui-primary)/5">
            <template #header>
                <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-rocket" class="h-4 w-4 text-primary" />
                    <span class="text-sm font-medium text-default">Em Desenvolvimento</span>
                </div>
            </template>
            <div class="space-y-3">
                <div>
                    <div class="mb-1 flex items-center justify-between">
                        <span class="text-sm font-medium text-default">Sistema de Newsletter</span>
                        <UBadge variant="subtle" color="neutral" size="xs">v2.0</UBadge>
                    </div>
                    <p class="text-xs text-muted">
                        Subscrições com preferências de conteúdo
                    </p>
                </div>
                <div class="space-y-1">
                    <div class="flex justify-between text-xs">
                        <span class="text-muted">Progresso</span>
                        <span class="font-medium text-default">{{ progress }}%</span>
                    </div>
                    <UProgress :value="progress" size="xs" />
                </div>
            </div>
        </UCard>
    </aside>
</template>

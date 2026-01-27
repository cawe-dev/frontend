<script lang="ts" setup>
import type { PostResponse } from '~/types/api'

const props = defineProps<{
    post: PostResponse,
    viewMode?: 'grid' | 'list'
}>()

const isSpoilerRevealed = ref(false)

const computedPath = computed(() => `/blog/post/${props.post.id}`)

const computedDescription = computed(() => {
    const textContent = props.post.contents?.find(c => c.type === 'TEXT')?.text
    return textContent
        ? textContent.substring(0, 180) + (textContent.length > 180 ? '...' : '')
        : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
})

const hasSpoilers = computed(() => {
    return props.post.contents?.some(c => c.type === 'TEXT' && c.spoiler) || false
})

const formattedDate = computed(() => {
    return new Date(props.post.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
})

const toggleSpoiler = () => {
    isSpoilerRevealed.value = !isSpoilerRevealed.value
}
</script>

<template>
    <UBlogPosts :orientation="viewMode === 'list' ? 'vertical' : 'vertical'">
        <UBlogPost :to="computedPath" :class="viewMode === 'list' ? 'px-4' : ''" :ui="{
            title: 'text-xl font-bold text-default mb-2 group-hover:text-primary transition-colors',
            description: 'text-muted text-base',
            date: 'text-xs text-muted mt-4',
            authors: 'hidden',
        }">
            <template #badge>
                <UBadge :label="post.type === 'PERSONAL' ? 'Pessoal' : 'Profissional'" color="primary"
                    variant="solid" />
            </template>

            <template #date>
                <div class="flex items-center justify-between pb-4">
                    <time :datetime="post.createdAt" class="text-xs font-medium text-muted flex items-center gap-1">
                        <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5" />
                        {{ formattedDate }}
                    </time>
                    <div class="w-px h-4 bg-primary mx-2"></div>

                    <div class="flex gap-1.5" v-if="post.tags && post.tags.length">
                        <UBadge v-for="tag in post.tags.slice(0, 2)" :key="tag.id" :label="`#${tag.name}`"
                            variant="soft" size="xs" />
                        <span v-if="post.tags.length > 2" class="text-xs text-muted self-center">
                            +{{ post.tags.length - 2 }}
                        </span>
                    </div>
                </div>
            </template>

            <template #title>
                <div class="flex items-center gap-2 flex-wrap mb-2"">
                <h3 class=" text-xl font-bold text-default group-hover:text-primary transition-colors line-clamp-2">
                    {{ post.title }}
                    </h3>
                    <UBadge v-for="category in post.categories" :key="category.id" :label="category.name"
                        variant="subtle" size="xs" />
                </div>
            </template>

            <template #description>
                <span @click.prevent="hasSpoilers && toggleSpoiler()">

                    <span :class="[
                        'block text-base leading-relaxed text-muted line-clamp-3',
                        hasSpoilers && !isSpoilerRevealed ? 'blur-sm select-none' : ''
                    ]">
                        {{ computedDescription }}
                    </span>

                    <span v-if="hasSpoilers && !isSpoilerRevealed"
                        class="absolute inset-0 flex items-center justify-center hover:scale-105 transition-transform">
                        <UBadge label="Spoiler" color="neutral" variant="solid" icon="i-heroicons-eye-slash" />
                    </span>
                </span>
            </template>

            <template #footer>
                <div class="flex items-center justify-between w-full pt-4">
                    <div class="flex-1"></div>
                    <UButton size="md"
                        class="group transform transition-all duration-200 bg-transparent hover:bg-transparent hover:scale-105 active:scale-95 px-4 py-2"
                        aria-label="Ler mais">
                        <span class="flex items-center gap-2">
                            <span class="font-medium text-muted">ler mais</span>
                            <UIcon name="i-heroicons-arrow-right"
                                class="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1 text-primary" />
                        </span>
                    </UButton>
                </div>
            </template>
        </UBlogPost>
    </UBlogPosts>
</template>
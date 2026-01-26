<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useContext } from '~/composables/useContext'
import { useRoute } from '#app'
import type { PostResponse, PostContentResponse, TextReference } from '~/types/api'
import { usePosts } from '~/composables/usePosts'
import { useAsyncData } from '#app'

const route = useRoute()
const { fetchOnePost } = usePosts()

const viewMode = ref<'universal' | 'technical'>('universal')

const viewModeItems = [
  {
    label: 'Conceito Universal',
    icon: 'i-lucide-lightbulb',
    value: 'universal',
  },
  {
    label: 'Implementação Técnica',
    icon: 'i-lucide-code',
    value: 'technical',
  },
]

const revealedSpoilers = ref<Set<number>>(new Set())

function toggleSpoiler(id: number) {
  if (revealedSpoilers.value.has(id)) {
    revealedSpoilers.value.delete(id)
  } else {
    revealedSpoilers.value.add(id)
  }
  revealedSpoilers.value = new Set(revealedSpoilers.value)
}

const readingProgress = ref(0)

function updateReadingProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  readingProgress.value = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0
}

onMounted(() => {
  window.addEventListener('scroll', updateReadingProgress)
  updateReadingProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateReadingProgress)
})

const { data: post, pending: postLoading } = await useAsyncData<PostResponse>(
  `post-${route.params.id}`,
  () => fetchOnePost(route.params.id as string)
)

const formattedDate = computed(() => {
  return new Date(post.value.createdAt).toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
})

const formattedUpdateDate = computed(() => {
  return new Date(post.value.updatedAt).toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
})

const wasEdited = computed(() => {
  const created = new Date(post.value.createdAt).getTime()
  const updated = new Date(post.value.updatedAt).getTime()
  return updated - created > 3600000
})

const estimatedReadTime = computed(() => {
  const text = post.value.contents
    .filter(c => c.type === 'TEXT')
    .map(c => c.text || '')
    .join(' ')
  const words = text.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
})

const filteredContents = computed(() => {
  if (!post.value?.contents) return []

  return [...post.value.contents].sort((a, b) => (a.order || 0) - (b.order || 0))
})

const copyLink = async () => {
  await navigator.clipboard.writeText(window.location.href)
}

const shareOnX = () => {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(post.value.title)
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
}
</script>

<template>
  <div v-if="!postLoading && post" class="min-h-screen bg-default">
    <section name="top-progress-bar">
      <div class="fixed top-0 left-0 z-50 h-1 w-full bg-accented">
        <div class="h-full bg-primary transition-all duration-150" :style="{ width: `${readingProgress}%` }" />
      </div>
    </section>

    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div class="flex gap-8">
        <article class="min-w-0 flex-1">
          <header class="mb-8">
            <NuxtLink to="/"
              class="mb-4 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-default">
              <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
              Voltar ao Blog
            </NuxtLink>

            <h1 class="mb-4 text-balance text-3xl font-bold tracking-tight text-default sm:text-4xl lg:text-5xl">
              {{ post.title }}
            </h1>

            <!-- Metadata -->
            <div class="mb-6 flex flex-wrap items-center gap-3 text-sm">
              <!-- Date -->
              <div class="flex items-center gap-1.5 text-muted">
                <UIcon name="i-lucide-calendar" class="h-4 w-4" />
                <time :datetime="post.createdAt">{{ formattedDate }}</time>
              </div>

              <!-- Edited indicator -->
              <UBadge v-if="wasEdited" variant="subtle" color="warning" size="xs">
                <UIcon name="i-lucide-pencil" class="mr-1 h-3 w-3" />
                Editado em {{ formattedUpdateDate }}
              </UBadge>

              <!-- Read time -->
              <div class="flex items-center gap-1.5 text-muted">
                <UIcon name="i-lucide-clock" class="h-4 w-4" />
                <span>{{ estimatedReadTime }} min de leitura</span>
              </div>

              <!-- Categories -->
              <div class="flex items-center gap-2">
                <UBadge v-for="category in post.categories" :key="category.id" variant="subtle" color="primary">
                  {{ category.name }}
                </UBadge>
              </div>
            </div>

            <!-- View Mode Toggle (Sticky) -->
            <div
              class="sticky top-2 z-40 -mx-4 mb-8 bg-(--ui-bg)/95 px-4 py-3 backdrop-blur-sm sm:mx-0 sm:rounded-lg sm:border sm:border-default sm:px-4">
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-layers" class="h-4 w-4 text-muted" />
                  <span class="text-sm font-medium text-default">Modo de Visualização</span>
                </div>
              </div>
              <UTabs v-model="viewMode" :items="viewModeItems" size="sm" class="mt-4" />

            </div>
          </header>

          <!-- Post Content -->
          <div class="prose prose-lg max-w-none">
            <template v-for="content in filteredContents" :key="content.uuid">

              <div v-if="content.type === 'TEXT'" class="mb-8">

                <div v-if="content.spoiler" class="relative">
                  <div :class="[
                    'rounded-lg border border-default bg-elevated p-6 transition-all',
                    !revealedSpoilers.has(content.id!) ? 'spoiler-blur select-none' : ''
                  ]">
                    <div class="prose-content text-default">
                      <HomeContentRichRenderer :block="content" />
                    </div>
                  </div>

                  <div v-if="!revealedSpoilers.has(content.id!)"
                    class="absolute inset-0 flex items-center justify-center rounded-lg bg-(--ui-bg)/50 backdrop-blur-sm">
                    <UButton color="warning" variant="soft" icon="i-lucide-eye" @click="toggleSpoiler(content.id!)">
                      Revelar Spoiler
                    </UButton>
                  </div>

                  <div v-if="revealedSpoilers.has(content.id!)" class="mt-2 flex justify-end">
                    <UButton variant="ghost" size="xs" icon="i-lucide-eye-off" @click="toggleSpoiler(content.id!)">
                      Esconder Spoiler
                    </UButton>
                  </div>
                </div>

                <div v-else class="prose-content text-default">
                  <HomeContentRichRenderer :block="content" />
                </div>
              </div>

              <figure v-else-if="content.type === 'IMAGE'" class="my-8">
                <div class="overflow-hidden rounded-lg border border-default">
                  <img :src="content.mediaUrl" :alt="content.caption"
                    class="w-full bg-linear-to-br from-(--ui-primary)/10 to-transparent" />
                </div>
                <figcaption v-if="content.caption" class="mt-3 text-center text-sm text-muted">
                  {{ content.caption }}
                </figcaption>
              </figure>

              <figure v-else-if="content.type === 'VIDEO'" class="my-8">
                <div class="overflow-hidden rounded-lg border border-default">
                  <iframe :src="content.mediaUrl" title="Video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen
                    class="w-full rounded-lg aspect-video" />
                </div>
                <figcaption v-if="content.caption" class="mt-3 text-center text-sm text-muted">
                  {{ content.caption }}
                </figcaption>
              </figure>

            </template>
          </div>

          <USeparator class="my-8" />

          <!-- Post Footer -->
          <footer class="space-y-8">
            <!-- Tags -->
            <div>
              <h3 class="mb-3 text-sm font-semibold text-default">Tags</h3>
              <div class="flex flex-wrap gap-2">
                <UBadge v-for="tag in post.tags" :key="tag.id" variant="soft" color="neutral" size="sm">
                  #{{ tag.name }}
                </UBadge>
              </div>
            </div>

            <!-- Share Actions -->
            <div>
              <h3 class="mb-3 text-sm font-semibold text-default">Compartilhar </h3>
              <div class="flex gap-2">
                <UButton variant="outline" color="neutral" size="sm" icon="i-lucide-link" @click="copyLink">
                  Copiar Link
                </UButton>
                <UButton variant="outline" color="neutral" size="sm" icon="i-lucide-twitter" @click="shareOnX">
                  Compartilhar no X
                </UButton>
              </div>
            </div>

            <USeparator />
          </footer>
        </article>

        <!-- Sidebar -->
        <aside class="hidden w-64 shrink-0 lg:block">
          <div class="sticky top-16 space-y-6">
            <!-- Reading Progress Widget -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-book-open" class="h-4 w-4 text-primary" />
                  <span class="text-sm font-medium text-default">Progresso</span>
                </div>
              </template>
              <div class="space-y-2">
                <div class="flex justify-between text-xs">
                  <span class="text-muted">Leitura:</span>
                </div>
                <UProgress v-model="readingProgress" status :max="100" size="xs" />
              </div>
            </UCard>
          </div>
        </aside>
      </div>
    </div>
  </div>
  <div v-else class="flex items-center justify-center min-h-screen">
    <USkeleton class="w-48 h-8 mb-4" />
  </div>
</template>

<style scoped>
.prose-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--ui-text);
}

.prose-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--ui-text);
}

.prose-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.75;
}

.prose-content :deep(pre) {
  background: var(--ui-bg-inverted);
  color: var(--ui-text-inverted);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.prose-content :deep(code) {
  font-family: var(--font-mono, monospace);
  font-size: 0.875em;
}

.prose-content :deep(p code) {
  background: var(--ui-bg-accented);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  color: var(--ui-primary);
}

.prose-content :deep(strong) {
  font-weight: 600;
  color: var(--ui-text-highlighted);
}

.prose-content :deep(em) {
  font-style: italic;
}

.prose-content :deep(.reference-term) {
  border-bottom: 1px dashed var(--ui-primary);
  cursor: help;
  color: var(--ui-primary);
}
</style>

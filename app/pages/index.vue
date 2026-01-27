<script setup lang="ts">
import { useContext } from '~/composables/useContext'
import { usePosts } from '~/composables/usePosts'
import { usePostFeed } from '~/composables/usePostFeed'
import SidebarWidgets from '~/components/home/SidebarWidgets.vue'
import PostCard from '~/components/home/PostCard.vue'

const { context, initializeContext } = useContext()
const sidebarOpen = ref(true)

const { fetchAllPosts } = usePosts()
const { data: posts } = await useAsyncData('home-posts', () => fetchAllPosts())

const {
  searchQuery,
  selectedType,
  selectedCategory,
  selectedTags,
  viewMode,
  allTags,
  filteredPosts,
  toggleTag
} = usePostFeed(computed(() => posts.value || []))

onMounted(() => {
  initializeContext()
})

watch(context, (newContext) => {
  selectedType.value = newContext
})

</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6">

    <section class="mb-8 rounded-xl border border-default bg-elevated p-6 sm:p-8 transition-colors duration-300">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-default">
            <template v-if="context === 'professional'">
              Código, Arquitetura & <span class="text-(--color-pro-500)">Engenharia</span>
            </template>
            <template v-else>
              Vida, Hobbies & <span class="text-(--color-life-500)">Descobertas</span>
            </template>
          </h1>
          <p class="mt-2 text-muted">
            {{ context === 'professional'
              ? 'Explorando o universo do desenvolvimento de software de alta performance.'
              : 'Um olhar pessoal sobre música, jogos e o equilíbrio da vida.' }}
          </p>
        </div>

        <UButton variant="outline" class="lg:hidden"
          :icon="sidebarOpen ? 'i-lucide-panel-right-close' : 'i-lucide-panel-right'"
          @click="sidebarOpen = !sidebarOpen" />
      </div>
    </section>

    <div class="flex gap-6 items-start">

      <main class="flex-1 min-w-0">
        <div class="mb-6 flex flex-wrap gap-3 items-center justify-between">
          <div class="flex gap-2">
            <UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Buscar..." class="w-48" />

            <USelectMenu v-model="selectedCategory" :options="['all', 'professional', 'personal']" />
          </div>

          <div class="flex border border-default rounded-md gap-0.5 p-1">
            <UButton :variant="viewMode === 'grid' ? 'solid' : 'ghost'" color="primary" icon="i-lucide-layout-grid"
              @click="viewMode = 'grid'" size="sm" />
            <UButton :variant="viewMode === 'list' ? 'solid' : 'ghost'" color="primary" icon="i-lucide-list"
              @click="viewMode = 'list'" size="sm" />
          </div>
        </div>

        <div :class="viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2' : 'flex flex-col gap-4'">
          <PostCard v-for="(post, index) in filteredPosts" :key="post.id || index" :post="post" :view-mode="viewMode" />
        </div>

        <div v-if="filteredPosts.length === 0" class="py-12 text-center text-muted">
          Nenhum post encontrado para os filtros atuais.
        </div>
      </main>
    </div>
  </div>
</template>
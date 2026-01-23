<script lang="ts" setup>
import type { PostResponse, PostContentResponse } from '~/types/api'

definePageMeta({ layout: 'dashboard' })

const { $api } = useNuxtApp()
const router = useRouter()
const toast = useToast()
const { fetchAllPosts } = usePosts()

const posts = ref<PostResponse[]>([])

onMounted(async () => {
  posts.value = await fetchAllPosts()
  posts.value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})
</script>

<template>
  <div>


    <h1 class="text-center text-5xl mb-4">Lista de Posts(ordem decrescente):</h1>

    <div class="space-y-6">
      <UCard v-for="post in posts" :key="post.id" class="hover:shadow-lg transition-shadow md:max-w-2xl mx-auto">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold">{{ post.title }}</h2>
            <h2>
              <b>Publicação:</b>
              {{ new Date(post.createdAt).toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo'
              }) }}
            </h2>
          </div>
        </template>
        <div class="space-y-4">
          <div>
            <p class="text-sm font-semibold text-gray-700 mb-2">Categorias</p>
            <div class="flex flex-wrap gap-2">
              <UBadge v-for="category in post.categories" :key="category.id" variant="subtle">
                #{{ category.name }}
              </UBadge>
            </div>
          </div>

          <div>
            <p class="text-sm font-semibold text-gray-700 mb-2">Tags</p>
            <div class="flex flex-wrap gap-2">
              <UBadge v-for="tag in post.tags" :key="tag.id" variant="subtle" color="primary">
                #{{ tag.name }}
              </UBadge>
            </div>
          </div>

          <UDivider />

          <div class="space-y-3">
            <p class="text-sm font-semibold text-gray-700">Tipo de Conteúdo:</p>
            <div v-for="(content, index) in post.contents" :key="content.id" class="space-y-2">
              <UBadge variant="soft">{{ content.type }}</UBadge>
              <div v-if="content.type === 'TEXT'" class="prose prose-sm max-w-none" v-html="content.text"></div>
              <div v-else-if="content.type === 'IMAGE'" class="space-y-1">
                <img :src="content.mediaUrl" :alt="content.caption"
                  class="rounded-lg w-full md:max-w-96 max-h-64 object-cover" />
                <p class="text-xs text-gray-500">{{ content.caption }}</p>
              </div>
              <iframe v-else-if="content.type === 'VIDEO'" :src="content.mediaUrl" title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen
                class="rounded-lg w-full md:max-w-96 h-64"></iframe>
              <div v-for="(reference, index) in content.references" :key="reference.id" class="space-y-2">
                <p class="text-sm font-medium">Referência {{ index + 1 }}:</p>
                <p class="text-sm text-gray-600 inline"> <b>Título:</b> {{ reference.term }}</p>,
                <p class="text-sm text-gray-600 inline"> <b>Descrição:</b> {{ reference.definition }}</p>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex gap-2">
            <UButton variant="soft" class="bg-brand-secundary text-brand-text" size="sm">Editar</UButton>
            <UButton variant="soft" color="error" size="sm">Deletar</UButton>
          </div>
        </template>
      </UCard>
    </div>

  </div>
</template>

<style></style>
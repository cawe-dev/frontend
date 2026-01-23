<script lang="ts" setup>
import type { PostResponse } from '~/types/api'

definePageMeta({ layout: 'blog' })

const { fetchAllPosts } = usePosts()
const { context } = useContext()

declare module '~/types/api' {
  interface PostResponse {
    path: string,
    description: string,
    image: string
  }
}
const posts = ref<PostResponse[]>([])

onMounted(async () => {
  posts.value = await fetchAllPosts()

  posts.value = posts.value.map(post => {
    const textContent = post.contents.find(c => c.type === 'TEXT')?.text
    const imageBackgroundColor = context.value === 'professional' ? 'blue' : 'yellow'
    const images = post.contents.filter(c => c.type === 'IMAGE')
    const videos = post.contents.filter(c => c.type === 'VIDEO')

    return {
      ...post,
      path: `/blog/${post.id}`,
      description: textContent ? textContent.substring(0, 150) + '...' : 'Este post não possui texto...',
      image: images.length > 0 ? images[0].mediaUrl : videos.length > 0 ? videos[0].mediaUrl : `https://placehold.co/1920x1080/${imageBackgroundColor}/white/png?text=${post.title?.replace(/\s+/g, '+')}`
    }
  })

  posts.value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const authors = [{
  name: 'Cawe Alves',
  description: 'Desenvolvedor Full-Stack',
  avatar: {
    src: '/images/authors/cawe-alves.jpg',
    alt: 'Cawe Alves Avatar',
  },
}]
</script>

<template>
  <div class="max-w-5xl mx-auto py-8">
    <UBlogPosts orientation="vertical">
      <UBlogPost orientation="vertical" v-for="(post, index) in posts" :key="index" v-bind="post" :title="post.title"
        :description="post.description" :image="post.image" :authors="authors" :date="new Date(post.createdAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Sao_Paulo'
        })" :to="post.path">
      </UBlogPost>
    </UBlogPosts>
  </div>
</template>

<style></style>

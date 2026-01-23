<script lang="ts" setup>
import type { PostContent } from '~/types/api'
import PostContentManager from '~~/app/components/admin/PostContentManager.vue'

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const toast = useToast()
const { createOnePost } = usePosts()

const state = reactive({
  title: '',
  categoryIds: [] as number[],
  tagIds: [] as number[],
  contents: [] as PostContent[]
})

const isSubmitting = ref(false)

const onSubmit = async () => {
  if (!state.title) {
    toast.add({ title: 'Faltou o título', color: 'warning' })
    return
  }
  const payload = {
    title: state.title,
    categoryIds: state.categoryIds,
    tagIds: state.tagIds,
    contents: state.contents.map((c, index) => ({
      ...c,
      order: index
    }))
  }

  isSubmitting.value = true
  try {
    const post = await createOnePost(payload)
    toast.add({ title: 'Sucesso', description: 'Post publicado!', color: 'success' })
    router.push('/admin/dashboard')
  } catch (error) {
    toast.add({ title: 'Erro', description: 'Não foi possível salvar.', color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto py-8 space-y-8">
    <div class="flex items-center justify-between">
      <div class="flex-1 mr-4">
        <UInput v-model="state.title" placeholder="Título do Post" size="xl" variant="none" />
      </div>
      <div class="flex gap-2 shrink-0">
        <UButton label="Cancelar" color="neutral" variant="ghost" to="/admin/dashboard" />
        <UButton label="Publicar" color="neutral" :loading="isSubmitting" @click="onSubmit" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div class="lg:col-span-8 space-y-6">
        <PostContentManager v-model="state.contents" />
      </div>

      <div class="lg:col-span-4 space-y-6 sticky top-4">
        <UCard>
          <div class="space-y-4">
            <AdminCategorySelector v-model="state.categoryIds" />
            <AdminTagSelector v-model="state.tagIds" />
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
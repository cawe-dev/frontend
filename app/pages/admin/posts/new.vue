<script setup lang="ts">
import type { JSONContent } from '@tiptap/vue-3'

definePageMeta({ layout: 'admin' })

const { $api } = useNuxtApp()
const { convertToBackend } = usePostConverter()
const router = useRouter()
const toast = useToast()

// Estado
const state = reactive({
  title: '',
  categoryIds: [] as number[],
  tagIds: [] as number[],
  editorContent: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: []
      }
    ]
  } as JSONContent
})

const isSubmitting = ref(false)

const onSubmit = async () => {
  if (!state.title) {
    toast.add({ title: 'Faltou o título', color: 'warning' })
    return
  }

  isSubmitting.value = true

  const apiContents = convertToBackend(state.editorContent)

  if (apiContents.length === 0) {
    toast.add({ title: 'Post vazio', description: 'Escreva algo antes de salvar.', color: 'warning' })
    isSubmitting.value = false
    return
  }

  const payload = {
    title: state.title,
    categoryIds: state.categoryIds,
    tagIds: state.tagIds,
    contents: apiContents
  }

  try {
    await $api('/posts', { method: 'POST', body: payload })
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
  <div class="max-w-5xl mx-auto py-8 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Novo Post</h1>
      <div class="flex gap-2">
        <UButton label="Cancelar" color="gray" variant="ghost" to="/admin/dashboard" />
        <UButton label="Publicar" color="black" :loading="isSubmitting" @click="onSubmit" />
      </div>
    </div>

    <UInput v-model="state.title" placeholder="Título do Post" size="xl"
      :ui="{ size: { xl: 'text-3xl font-bold' }, wrapper: 'border-none' }" variant="none" class="bg-transparent" />

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      <div class="lg:col-span-3">
        <AdminPostEditor v-model="state.editorContent" />
      </div>

      <div class="space-y-6 lg:sticky lg:top-4">
        <UCard :ui="{ body: { padding: 'p-4' } }">
          <div class="space-y-4">
            <AdminCategorySelector v-model="state.categoryIds" />
            <AdminTagSelector v-model="state.tagIds" />
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
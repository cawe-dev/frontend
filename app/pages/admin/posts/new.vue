<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const state = reactive({
  title: '',
  categoryIds: [] as number[],
  tagIds: [] as number[],
  contents: []
})

const onSubmit = async () => {
  console.log('Enviando payload:', state)
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Novo Post</h1>
      <UButton label="Publicar" color="neutral" @click="onSubmit" />
    </div>

    <UCard>
      <div class="space-y-6">
        <UFormGroup label="Título" required>
          <UInput v-model="state.title" placeholder="Ex: Novidades do Java 21" size="lg" />
        </UFormGroup>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminCategorySelector v-model="state.categoryIds" />
          <AdminTagSelector v-model="state.tagIds" />
        </div>

        <UDivider label="Conteúdo" />
        <div
          class="p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg text-center text-gray-400">
          Conteudo
        </div>
      </div>
    </UCard>
  </div>
</template>
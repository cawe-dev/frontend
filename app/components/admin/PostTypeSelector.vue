<script setup lang="ts">
import type { PostType } from '~/types/api'

const props = defineProps<{ modelValue: PostType }>()
const emit = defineEmits(['update:modelValue'])

const rawTypes = ref<PostType[]>([])

onMounted(async () => {
  rawTypes.value = ['PERSONAL', 'PROFESSIONAL']
})

const items = computed(() => rawTypes.value.map(t => ({
  label: t === 'PERSONAL' ? 'Pessoal' : 'Profissional',
  id: t
})))

const selectedItems = computed(() => items.value.filter(i => props.modelValue.includes(i.id)))

const selectedIds = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const removeItem = (idToRemove: PostType) => {
  selectedIds.value = selectedIds.value.filter(id => id !== idToRemove)
}
</script>

<template>
  <UFormField label="Categorias">
    <USelectMenu v-model="selectedIds" :items="items" value-key="id" searchable placeholder="Selecione ou crie...">
    </USelectMenu>
    <div v-if="selectedItems.length" class="mt-2 flex flex-wrap gap-2">
      <UBadge v-for="item in selectedItems" :key="item.id" color="neutral" variant="subtle" size="md"
        class="flex items-center gap-1 pr-1">
        {{ item.label }}
        <UIcon name="i-heroicons-x-mark" class="cursor-pointer hover:text-red-500 transition-colors"
          @click="removeItem(item.id)" />
      </UBadge>
    </div>
  </UFormField>
</template>
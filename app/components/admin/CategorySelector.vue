<script setup lang="ts">
import type { Category } from '~/types/api'

const props = defineProps<{ modelValue: number[] }>()
const emit = defineEmits(['update:modelValue'])

const { fetchAllCategories, createOneCategory } = useCategories()
const rawCategories = ref<Category[]>([])

onMounted(async () => {
    rawCategories.value = await fetchAllCategories()
})

const items = computed(() => rawCategories.value.map(c => ({ label: c.name, id: c.id })))

const selectedItems = computed(() => items.value.filter(i => props.modelValue.includes(i.id)))

const selectedIds = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const handleCreate = async (name: string) => {
    const newCategory = await createOneCategory(name)
    rawCategories.value.push(newCategory)
    return { label: newCategory.name, id: newCategory.id }
}

const removeItem = (idToRemove: number) => {
    selectedIds.value = selectedIds.value.filter(id => id !== idToRemove)
}
</script>

<template>
    <UFormField label="Categorias">
        <USelectMenu v-model="selectedIds" :items="items" value-key="id" multiple searchable create-item
            @create="handleCreate" placeholder="Selecione ou crie...">
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
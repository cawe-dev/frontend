<script setup lang="ts">
import type { Tag } from '~/types/api'

const props = defineProps<{ modelValue: number[] }>()
const emit = defineEmits(['update:modelValue'])

const { fetchAllTags, createOneTag } = useTags()
const rawTags = ref<Tag[]>([])

onMounted(async () => {
    rawTags.value = await fetchAllTags()
})

const items = computed(() => rawTags.value.map(t => ({ label: t.name, id: t.id })))
const selectedItems = computed(() => items.value.filter(i => props.modelValue.includes(i.id)))

const selectedIds = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const handleCreate = async (name: string) => {
    const newTag = await createOneTag(name)
    rawTags.value.push(newTag)
    return { label: newTag.name, id: newTag.id }
}

const removeItem = (idToRemove: number) => {
    selectedIds.value = selectedIds.value.filter(id => id !== idToRemove)
}
</script>

<template>
    <UFormGroup label="Tags">
        <USelectMenu v-model="selectedIds" :items="items" value-key="id" multiple searchable create-item
            @create="handleCreate" placeholder="Selecione ou crie tags...">
        </USelectMenu>

        <div v-if="selectedItems.length" class="mt-2 flex flex-wrap gap-2">
            <UBadge v-for="item in selectedItems" :key="item.id" color="neutral" variant="subtle" size="md"
                class="flex items-center gap-1 pr-1">
                #{{ item.label }}
                <UIcon name="i-heroicons-x-mark" class="cursor-pointer hover:text-red-500 transition-colors"
                    @click="removeItem(item.id)" />
            </UBadge>
        </div>
    </UFormGroup>
</template>
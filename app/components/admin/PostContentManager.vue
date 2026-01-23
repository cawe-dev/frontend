<script setup lang="ts">
import { reactive } from 'vue'
import type { PostContent, ContentType } from '~/types/api'
import TextBlockEditor from '~~/app/components/admin/blocks/TextBlockEditor.vue'

const props = defineProps<{
    modelValue: PostContent[]
}>()

const emit = defineEmits(['update:modelValue'])

const localContents = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const editorsHtml = reactive<Record<string, string>>({})
props.modelValue.forEach(block => {
    if (block.type === 'TEXT') {
        editorsHtml[block.uuid] = block.text ? `<p>${block.text}</p>` : ''
    }
})

const generateUUID = () => crypto.randomUUID()

const addBlock = (type: ContentType) => {
    const newBlock: PostContent = {
        uuid: generateUUID(),
        type,
        text: '',
        imageUrl: '',
        videoUrl: '',
        references: [],
        order: localContents.value.length
    }
    editorsHtml[newBlock.uuid] = ''
    localContents.value = [...localContents.value, newBlock]
}

const removeBlock = (uuid: string) => {
    localContents.value = localContents.value.filter(b => b.uuid !== uuid)
    delete editorsHtml[uuid]
}

const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= localContents.value.length) return

    const items = [...localContents.value]
    const temp = items[newIndex]
    items[newIndex] = items[index]
    items[index] = temp

    items.forEach((item, idx) => item.order = idx)
    localContents.value = items
}

const handleContentChange = (uuid: string, payload: { html: string, text: string }) => {
    const block = localContents.value.find(b => b.uuid === uuid)
    if (block) {
        block.text = payload.text
    }
    editorsHtml[uuid] = payload.html
}

const updateReferences = (uuid: string, refs: any[]) => {
    localContents.value = localContents.value.map(block =>
        block.uuid === uuid ? { ...block, references: refs } : block
    )
}
</script>

<template>
    <div class="space-y-6">
        <div v-for="(block, index) in localContents" :key="block.uuid" class="relative group">

            <UCard class="border-l-4" :class="{
                'border-l-blue-500': block.type === 'TEXT',
                'border-l-green-500': block.type === 'IMAGE',
                'border-l-red-500': block.type === 'VIDEO'
            }">

                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <UIcon v-if="block.type === 'TEXT'" name="i-heroicons-document-text" />
                            <UIcon v-else-if="block.type === 'IMAGE'" name="i-heroicons-photo" />
                            <UIcon v-else name="i-heroicons-video-camera" />
                            {{ block.type }}
                        </div>

                        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <UButton icon="i-heroicons-arrow-up" size="lg" color="neutral" variant="ghost"
                                @click="moveBlock(index, 'up')" :disabled="index === 0" />
                            <UButton icon="i-heroicons-arrow-down" size="lg" color="neutral" variant="ghost"
                                @click="moveBlock(index, 'down')" :disabled="index === localContents.length - 1" />
                            <UButton icon="i-heroicons-trash" size="lg" color="error" variant="ghost"
                                @click="removeBlock(block.uuid)" />
                        </div>
                    </div>
                    {{ "a: " + block.text }}
                </template>

                <div v-if="block.type === 'TEXT'" class="p-2">
                    <TextBlockEditor :model-value="editorsHtml[block.uuid]"
                        @change="handleContentChange(block.uuid, $event)"
                        @update:references="updateReferences(block.uuid, $event)" />
                </div>

                <div v-else-if="block.type === 'IMAGE'" class="p-4 space-y-3">
                    <div class="flex gap-4 items-start">
                        <div class="flex-1 space-y-3">
                            <UFormField label="URL da Imagem">
                                <UInput v-model="block.imageUrl" icon="i-heroicons-link" placeholder="https://..." />
                            </UFormField>
                            <UFormField label="Legenda">
                                <UInput v-model="block.caption" placeholder="Descrição visual..." />
                            </UFormField>
                        </div>
                        <div v-if="block.imageUrl"
                            class="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                            <img :src="block.imageUrl" class="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                <div v-else-if="block.type === 'VIDEO'" class="p-4">
                    <UFormField label="URL do Vídeo (YouTube/Vimeo)">
                        <UInput v-model="block.videoUrl" icon="i-heroicons-play" placeholder="https://..." />
                    </UFormField>
                </div>

            </UCard>
        </div>

        <div v-if="localContents.length === 0"
            class="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
            <p class="text-gray-500">Comece a escrever a sua história.</p>
        </div>

        <div class="sticky bottom-4 z-10 flex justify-center">
            <div
                class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-full p-2 flex gap-2">
                <UTooltip text="Adicionar Texto">
                    <UButton icon="i-heroicons-document-text" color="neutral" variant="ghost" size="lg"
                        @click="addBlock('TEXT')" />
                </UTooltip>
                <div class="w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                <UTooltip text="Adicionar Imagem">
                    <UButton icon="i-heroicons-photo" color="neutral" variant="ghost" size="lg"
                        @click="addBlock('IMAGE')" />
                </UTooltip>
                <UTooltip text="Adicionar Vídeo">
                    <UButton icon="i-heroicons-video-camera" color="neutral" variant="ghost" size="lg"
                        @click="addBlock('VIDEO')" />
                </UTooltip>
            </div>
        </div>
    </div>
</template>
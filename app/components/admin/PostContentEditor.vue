<script setup lang="ts">
import type { PostContent, ContentType } from '~/types/api'

const props = defineProps<{
    modelValue: PostContent[]
}>()

const emit = defineEmits(['update:modelValue'])

const contents = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const addBlock = (type: ContentType) => {
    const newBlock: PostContent = {
        type,
        text: '',
        references: []
    }
    contents.value = [...contents.value, newBlock]
}

const removeBlock = (index: number) => {
    contents.value = contents.value.filter((_, i) => i !== index)
}

const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex < 0 || newIndex >= contents.value.length) return

    const items = [...contents.value]
    const temp = items[newIndex]
    items[newIndex] = items[index]
    items[index] = temp

    contents.value = items
}

const blockIcons: Record<ContentType, string> = {
    TEXT: 'i-heroicons-document-text',
    IMAGE: 'i-heroicons-photo',
    VIDEO: 'i-heroicons-video-camera'
}
</script>

<template>
    <div class="space-y-4">
        <div v-for="(block, index) in contents" :key="index" class="group">
            <UCard :ui="{ body: { padding: 'p-4 sm:p-4' }, header: { padding: 'p-3 sm:p-3' } }">

                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2 text-gray-500 font-medium text-sm">
                            <UIcon :name="blockIcons[block.type]" class="w-5 h-5" />
                            <span>{{ block.type }}</span>
                            <UBadge color="gray" variant="subtle" size="xs">Bloco {{ index + 1 }}</UBadge>
                        </div>

                        <div class="flex items-center gap-1">
                            <UTooltip text="Mover para cima">
                                <UButton icon="i-heroicons-arrow-up" size="2xs" color="gray" variant="ghost"
                                    :disabled="index === 0" @click="moveBlock(index, 'up')" />
                            </UTooltip>

                            <UTooltip text="Mover para baixo">
                                <UButton icon="i-heroicons-arrow-down" size="2xs" color="gray" variant="ghost"
                                    :disabled="index === contents.length - 1" @click="moveBlock(index, 'down')" />
                            </UTooltip>

                            <div class="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>

                            <UTooltip text="Remover bloco">
                                <UButton icon="i-heroicons-trash" size="2xs" color="red" variant="ghost"
                                    @click="removeBlock(index)" />
                            </UTooltip>
                        </div>
                    </div>
                </template>

                <div class="space-y-3">

                    <div v-if="block.type === 'TEXT'">
                        <UTextarea v-model="block.text" placeholder="Escreva seu parágrafo aqui..." autoresize
                            :rows="4" />
                    </div>

                    <div v-if="block.type === 'IMAGE'" class="space-y-3">
                        <UFormGroup label="URL da Imagem">
                            <UInput v-model="block.imageUrl" placeholder="https://..." icon="i-heroicons-link" />
                        </UFormGroup>
                        <UFormGroup label="Legenda (Opcional)">
                            <UInput v-model="block.caption" placeholder="Descrição da imagem" />
                        </UFormGroup>
                        <img v-if="block.imageUrl" :src="block.imageUrl"
                            class="max-h-40 rounded border border-gray-200 dark:border-gray-700 object-cover mt-2" />
                    </div>

                    <div v-if="block.type === 'VIDEO'">
                        <UFormGroup label="URL do Vídeo">
                            <UInput v-model="block.videoUrl" placeholder="https://youtube.com/..."
                                icon="i-heroicons-play" />
                        </UFormGroup>
                    </div>

                </div>
            </UCard>

            <div v-if="index < contents.length - 1" class="flex justify-center py-2 text-gray-300 dark:text-gray-700">
                <UIcon name="i-heroicons-arrow-down" />
            </div>
        </div>

        <div v-if="contents.length === 0"
            class="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
            <p class="text-gray-400 mb-2">Nenhum conteúdo adicionado ainda.</p>
            <p class="text-xs text-gray-500">Comece adicionando um bloco abaixo.</p>
        </div>

        <div class="flex justify-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <UButton icon="i-heroicons-document-text" label="Texto" variant="soft" color="gray"
                @click="addBlock('TEXT')" />
            <UButton icon="i-heroicons-photo" label="Imagem" variant="soft" color="gray" @click="addBlock('IMAGE')" />
            <UButton icon="i-heroicons-video-camera" label="Vídeo" variant="soft" color="gray"
                @click="addBlock('VIDEO')" />
        </div>
    </div>
</template>
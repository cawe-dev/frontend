<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { ReferenceMark } from '~~/app/utils/tiptap/ReferenceExtension'

const props = defineProps<{
    modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

const extensions = [ReferenceMark]

const isRefModalOpen = ref(false)
const refForm = reactive({ title: '', description: '' })
const activeEditor = ref<Editor | null>(null)

const openRefModal = (editor: Editor) => {
    if (!editor) return

    const { from, to, empty } = editor.state.selection
    if (empty) return

    const text = editor.state.doc.textBetween(from, to)

    refForm.title = text
    refForm.description = ''
    activeEditor.value = editor
    isRefModalOpen.value = true
}

const saveReference = () => {
    if (!activeEditor.value) return

    const { to } = activeEditor.value.state.selection

    activeEditor.value.chain()
        .focus()
        .setReference({
            title: refForm.title,
            description: refForm.description,
            isNew: true
        })
        .setTextSelection(to)
        .unsetReference()
        .run()

    closeModal()
}

const closeModal = () => {
    isRefModalOpen.value = false
    setTimeout(() => {
        activeEditor.value = null
    }, 200)
}
</script>

<template>
    <div class="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 relative">

        <UEditor :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)"
            :extensions="extensions" placeholder="Escreva seu post... Selecione texto para adicionar referências."
            :ui="{ content: 'prose dark:prose-invert max-w-none p-6 min-h-[400px] outline-none' }">
            <template #default="{ editor }">
                <UEditorToolbar :editor="editor" :items="[
                    [{ kind: 'mark', mark: 'bold', icon: 'i-heroicons-bold' }],
                    [{ kind: 'mark', mark: 'italic', icon: 'i-heroicons-italic' }],
                    [{ kind: 'heading', level: 2, icon: 'i-heroicons-h2' }],
                    [{
                        icon: 'i-heroicons-bookmark',
                        tooltip: { text: 'Criar Referência' },
                        onClick: () => openRefModal(editor)
                    }]
                ]" layout="bubble" />
            </template>
        </UEditor>

        <UModal v-model:open="isRefModalOpen">
            <template #content>
                <UCard :ui="{ header: { padding: 'p-4' }, body: { padding: 'p-4' } }">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="font-bold text-gray-900 dark:text-white">
                                Adicionar Referência
                            </h3>
                            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="closeModal" />
                        </div>
                    </template>

                    <div class="space-y-4">
                        <UFormField label="Termo Selecionado" help="O texto que ficará marcado.">
                            <UInput v-model="refForm.title" />
                        </UFormField>

                        <UFormField label="Contexto / Descrição"
                            help="A explicação que aparecerá no popover do leitor.">
                            <UTextarea v-model="refForm.description" placeholder="Ex: Uma linguagem de programação..."
                                :rows="3" autoresize />
                        </UFormField>
                    </div>

                    <template #footer>
                        <div class="flex justify-end gap-2">
                            <UButton color="gray" variant="ghost" @click="closeModal">
                                Cancelar
                            </UButton>
                            <UButton color="black" @click="saveReference">
                                Salvar Referência
                            </UButton>
                        </div>
                    </template>
                </UCard>
            </template>
        </UModal>
    </div>
</template>
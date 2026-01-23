<script setup lang="ts">
import { Placeholder } from '@tiptap/extension-placeholder'
import { ReferenceMark } from '~~/app/utils/tiptap/ReferenceExtension'
import type { Editor } from '@tiptap/vue-3'
import { defineComponent, ref, reactive, watch } from 'vue'

const props = defineProps<{ modelValue: string }>()

const emit = defineEmits(['change', 'update:references'])

const content = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
    if (val !== content.value) {
        content.value = val
    }
})

const editorRef = ref<Editor | null>(null)

const EditorGrabber = defineComponent({
    props: {
        editor: {
            type: Object as () => Editor,
            required: true
        }
    },
    setup(props) {
        editorRef.value = props.editor
        return () => null
    }
})

const extensions = [
    Placeholder.configure({ placeholder: 'Escreva seu parágrafo...' }),
    ReferenceMark
]

const isRefModalOpen = ref(false)
const refForm = reactive({ title: '', description: '' })
const activeEditor = ref<Editor | null>(null)

const extractPayload = (editor: Editor) => {
    if (!editor || typeof editor.getJSON !== 'function') {
        return { refs: [], text: '' }
    }
    const json = editor.getJSON()
    if (!json.content) {
        return { refs: [], text: '' }
    }

    const refs: any[] = []
    let textContent = ''

    json.content.forEach((node, index) => {
        if (node.type !== 'paragraph') { return }

        if (index > 0) {
            textContent += '\n\n'
        }

        if (node.content) {
            node.content.forEach((innerNode) => {
                if (innerNode.type === 'hardBreak') {
                    textContent += '\n'
                }
                else if (innerNode.text) {
                    const startOffset = textContent.length
                    const text = innerNode.text
                    textContent += text

                    const refMark = innerNode.marks?.find(m => m.type === 'reference')
                    if (refMark) {
                        refs.push({
                            term: text,
                            startOffset,
                            endOffset: startOffset + text.length,
                            newReference: refMark.attrs.isNew
                                ? {
                                    title: refMark.attrs.title,
                                    description: refMark.attrs.description,
                                }
                                : undefined,
                            existingReferenceId: !refMark.attrs.isNew ? refMark.attrs.id : undefined,
                        })
                    }
                }
            })
        }
    })
    return { refs, text: textContent }
}

watch(content, (newHtml) => {
    if (editorRef.value) {
        const { refs, text } = extractPayload(editorRef.value)
        emit('change', {
            html: newHtml,
            text,
        })
        emit('update:references', refs)
    }
})

const openRefModal = (editor: Editor) => {
    const { from, to, empty } = editor.state.selection
    if (empty) return
    refForm.title = editor.state.doc.textBetween(from, to)
    refForm.description = ''
    activeEditor.value = editor
    isRefModalOpen.value = true
}

const saveReference = () => {
    if (!activeEditor.value) return
    activeEditor.value.chain().focus()
        .setReference({ ...refForm, isNew: true })
        .setTextSelection(activeEditor.value.state.selection.to)
        .unsetReference()
        .run()

    isRefModalOpen.value = false
}
</script>

<template>
    <div class="relative">
        <UEditor v-model="content" :extensions="extensions">
            <template #default="{ editor }">
                <EditorGrabber :editor="editor" />
                <UEditorToolbar :editor="editor" :items="[
                    [{ kind: 'mark', mark: 'bold', icon: 'i-heroicons-bold' }],
                    [{ kind: 'mark', mark: 'italic', icon: 'i-heroicons-italic' }],
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
                <UCard>
                    <template #header>
                        <div class="flex justify-between items-center">
                            <h3 class="font-bold">Nova Referência</h3>
                            <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost"
                                @click="isRefModalOpen = false" />
                        </div>
                    </template>
                    <div class="space-y-4">
                        <UFormField label="Termo">
                            <UInput v-model="refForm.title" />
                        </UFormField>
                        <UFormField label="Contexto">
                            <UTextarea v-model="refForm.description" />
                        </UFormField>
                    </div>
                    <template #footer>
                        <div class="flex justify-end gap-2">
                            <UButton color="neutral" @click="saveReference">Salvar</UButton>
                        </div>
                    </template>
                </UCard>
            </template>
        </UModal>
    </div>
</template>
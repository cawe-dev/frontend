import type { JSONContent } from '@tiptap/vue-3'
import type { PostContent, TextReference } from '~/types/api'

export const usePostConverter = () => {

    const convertToBackend = (doc: JSONContent): PostContent[] => {
        const contents: PostContent[] = []
        if (!doc.content) return contents

        let currentText = ''
        let currentReferences: TextReference[] = []
        let currentOrder = 0

        const flushTextBlock = () => {
            if (currentText.trim()) {
                contents.push({
                    type: 'TEXT',
                    text: currentText,
                    references: currentReferences,
                    order: currentOrder++
                })
            }
            currentText = ''
            currentReferences = []
        }

        const processNode = (node: JSONContent) => {
            if (node.type === 'text') {
                const textContent = node.text || ''
                const startPos = currentText.length

                const refMark = node.marks?.find(m => m.type === 'reference')

                if (refMark && refMark.attrs) {
                    currentReferences.push({
                        term: textContent,
                        startOffset: startPos,
                        endOffset: startPos + textContent.length,
                        newReference: refMark.attrs.isNew ? {
                            title: refMark.attrs.title,
                            description: refMark.attrs.description
                        } : undefined,
                        existingReferenceId: !refMark.attrs.isNew ? refMark.attrs.id : undefined
                    })
                }

                currentText += textContent
            }
        }

        doc.content.forEach((block) => {
            if (block.type === 'image') {
                flushTextBlock()
                contents.push({
                    type: 'IMAGE',
                    imageUrl: block.attrs?.src || '',
                    caption: block.attrs?.alt || '',
                    order: currentOrder++
                })
            }
            else if (block.type === 'paragraph' || block.type === 'heading') {
                if (currentText.length > 0) currentText += '\n\n'

                if (block.content) {
                    block.content.forEach(processNode)
                }
            }
        })

        flushTextBlock()
        return contents
    }

    return { convertToBackend }
}
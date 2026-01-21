import { Mark, mergeAttributes } from '@tiptap/core'

export interface ReferenceAttributes {
    id?: number | string
    title: string
    description?: string
    isNew?: boolean
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        reference: {
            setReference: (attributes: ReferenceAttributes) => ReturnType
            unsetReference: () => ReturnType
        }
    }
}

export const ReferenceMark = Mark.create<ReferenceAttributes>({
    name: 'reference',

    addAttributes() {
        return {
            id: {
                default: null,
                parseHTML: element => element.getAttribute('data-id'),
                renderHTML: attributes => ({ 'data-id': attributes.id }),
            },
            title: {
                default: null,
                parseHTML: element => element.getAttribute('data-ref-title'),
                renderHTML: attributes => ({ 'data-ref-title': attributes.title }),
            },
            description: {
                default: null,
                parseHTML: element => element.getAttribute('data-description'),
                renderHTML: attributes => ({ 'data-description': attributes.description }),
            },
            isNew: {
                default: false,
                parseHTML: element => element.getAttribute('data-is-new') === 'true',
                renderHTML: attributes => ({ 'data-is-new': attributes.isNew }),
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="reference"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        const tooltipText = HTMLAttributes['data-description'] || HTMLAttributes['data-ref-title']

        return [
            'span',
            mergeAttributes(HTMLAttributes, {
                'data-type': 'reference',
                title: tooltipText,
                class: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-b-2 border-dotted border-violet-500 cursor-help',
            }),
            0,
        ]
    },

    addCommands() {
        return {
            setReference:
                (attributes) =>
                    ({ commands }) => {
                        return commands.setMark(this.name, attributes)
                    },
            unsetReference:
                () =>
                    ({ commands }) => {
                        return commands.unsetMark(this.name)
                    },
        }
    },
})
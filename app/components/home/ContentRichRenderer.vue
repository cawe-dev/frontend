<script lang="ts" setup>
import { computed } from 'vue'
import type { PostContentResponse, TextReference } from '~/types/api'

interface Segment {
  id: string
  type: 'text' | 'reference'
  content: string
  referenceData?: TextReference
}

interface Props {
  block: PostContentResponse
}

const props = defineProps<Props>()

const renderedSegments = computed<Segment[]>(() => {
  const text = props.block.text || ''
  const references = (props.block.references || [])

  if (!references.length) {
    return [{ id: 'full-text', type: 'text', content: text }]
  }

  const sortedRefs = [...references].sort((a, b) => a.startOffset - b.startOffset)

  const segments: Segment[] = []
  let currentCursor = 0

  sortedRefs.forEach((ref, index) => {
    if (ref.startOffset < currentCursor) return

    if (ref.startOffset > currentCursor) {
      segments.push({
        id: `text-${index}`,
        type: 'text',
        content: text.slice(currentCursor, ref.startOffset)
      })
    }

    const termContent = text.slice(ref.startOffset, ref.endOffset)

    segments.push({
      id: `ref-${ref.startOffset}-${index}`,
      type: 'reference',
      content: termContent,
      referenceData: ref
    })

    currentCursor = ref.endOffset
  })

  if (currentCursor < text.length) {
    segments.push({
      id: `text-end`,
      type: 'text',
      content: text.slice(currentCursor)
    })
  }

  return segments
})
</script>

<template>
  <div class="content-rich-text text-base leading-relaxed text-gray-800 dark:text-gray-200">
    <template v-for="segment in renderedSegments" :key="segment.id">

      <span v-if="segment.type === 'text'">{{ segment.content }}</span>

      <UPopover v-else-if="segment.type === 'reference'" mode="hover" :popper="{ placement: 'top', strategy: 'fixed' }">
        <button
          class="inline-block font-medium text-primary hover:text-primary bg-accented underline decoration-dashed decoration-1 underline-offset-4 transition-colors cursor-help focus:outline-none">
          {{ segment.content }}
        </button>

        <template #content>
          <div class="p-4 max-w-xs sm:max-w-sm">
            <div class="flex items-center gap-2 mb-2">
              <UIcon name="i-heroicons-book-open" class="text-primary w-5 h-5" />
              <h4 class="font-semibold text-sm">
                {{ segment.referenceData?.term || 'Definição' }}
              </h4>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ segment.referenceData?.definition || 'Descrição não disponível.' }}
            </p>
          </div>
        </template>
      </UPopover>

    </template>
  </div>
</template>

<style scoped>
.content-rich-text {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
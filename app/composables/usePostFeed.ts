import type { PostResponse } from '~/types/api'

export const usePostFeed = (initialPosts: Ref<PostResponse[]>) => {
    const searchQuery = ref('')
    const selectedCategory = ref<string[]>([])
    const selectedType = ref<'professional' | 'personal'>('professional')
    const selectedTags = ref<string[]>([])
    const viewMode = ref<'grid' | 'list'>('grid')

    const allTags = computed(() => {
        const tags = new Set<string>()
        initialPosts.value.forEach(post => {
            if (Array.isArray(post.tags)) {
                post.tags.forEach(t => tags.add(t))
            }
        })
        return Array.from(tags)
    })

    const sortedAndFilteredPosts = computed(() => {
        let result = initialPosts.value

        if (selectedType.value === 'professional' || selectedType.value === 'personal') {
            result = result.filter(p => p.type === selectedType.value.toUpperCase())
        }

        if (selectedCategory.value.length > 0) {
            result = result.filter(p =>
                selectedCategory.value.every(cat => p.categories?.includes(cat))
            )
        }


        if (selectedTags.value.length > 0) {
            result = result.filter(p =>
                selectedTags.value.every(tag => p.tags?.includes(tag))
            )
        }

        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase()
            result = result.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query)
            )
        }

        return result
    })

    const toggleTag = (tag: string) => {
        if (selectedTags.value.includes(tag)) {
            selectedTags.value = selectedTags.value.filter(t => t !== tag)
        } else {
            selectedTags.value.push(tag)
        }
    }

    return {
        searchQuery,
        selectedCategory,
        selectedType,
        selectedTags,
        viewMode,
        allTags,
        filteredPosts: sortedAndFilteredPosts,
        toggleTag
    }
}
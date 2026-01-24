import type { PostResponse } from '~/types/api'

export const usePostFeed = (initialPosts: Ref<PostResponse[]>) => {
    const searchQuery = ref('')
    const selectedCategory = ref<'all' | 'professional' | 'personal'>('all')
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

        if (selectedCategory.value !== 'all') {
            result = result.filter(p => p.category === selectedCategory.value)
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
        selectedTags,
        viewMode,
        allTags,
        filteredPosts: sortedAndFilteredPosts,
        toggleTag
    }
}
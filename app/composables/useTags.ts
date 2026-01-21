import type { Tag, PageResponse } from '~/types/api'

export const useTags = () => {
    const { $api } = useNuxtApp()

    const fetchAllTags = async () => {
        try {
            const data = await $api<PageResponse<Tag>>('/tags', {
                params: { size: 1000, sort: 'name,asc' }
            })
            return data.content || []
        } catch (error) {
            return []
        }
    }

    const createOneTag = async (name: string) => {
        return await $api<Tag>('/tags', {
            method: 'POST',
            body: { name }
        })
    }

    return { fetchAllTags, createOneTag }
}
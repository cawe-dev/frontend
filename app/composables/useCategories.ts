import type { Category, PageResponse } from '~/types/api'

export const useCategories = () => {
    const { $api } = useNuxtApp()

    const fetchAllCategories = async () => {
        try {
            const data = await $api<PageResponse<Category>>('/categories', {
                params: { size: 1000, sort: 'name,asc' }
            })
            return data.content || []
        } catch (error) {
            return []
        }
    }

    const createOneCategory = async (name: string) => {
        return await $api<Category>('/categories', {
            method: 'POST',
            body: { name }
        })
    }

    return { fetchAllCategories, createOneCategory }
}
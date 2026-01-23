import type { Post, PageResponse, PostResponse } from '~/types/api'

export const usePosts = () => {
  const { $api } = useNuxtApp()

  const fetchAllPosts = async () => {
    try {
      const data = await $api<PageResponse<PostResponse>>('/posts', {
        params: { size: 1000, sort: 'title,asc' }
      })
      return data.content || []
    } catch (error) {
      return []
    }
  }

  const createOnePost = async (payload: Post) => {
    return await $api<Post>('/posts', {
      method: 'POST',
      body: payload
    })
  }

  return { fetchAllPosts, createOnePost }
}
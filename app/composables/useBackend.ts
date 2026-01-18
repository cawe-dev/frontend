import { useAuthStore } from '~~/stores/auth'

export const useBackend = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,

    onRequest({ options }) {
      if (authStore.token) {
       options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${authStore.token}`
        }
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
      }
    }
  })

  return async <T>(url: string, options: any = {}) => {
    try {
      return await api<T>(url, options)
    } catch (error: any) {
      if (error.response?.status === 401) {
        const refreshed = await authStore.refreshAccessToken()

        if (refreshed) {
          return await api<T>(url, options)
        }
      }
      throw error
    }
  }
}
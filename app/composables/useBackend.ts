import { useAuthStore } from '~~/stores/auth'

export const useBackend = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  if (!config.public.apiBaseUrl) {
  }

  return $fetch.create({
    baseURL: config.public.apiBaseUrl,

    onRequest({ options }) {

      if (authStore.token) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${authStore.token}`
        }
      }
    },

    onResponse({ response }) {
      console.log(`[RESPONSE] Status: ${response.status}`, response._data)
    },

    onResponseError({ response }) {
      console.error(`[RESPONSE ERROR] Status: ${response.status}`, response._data)
      if (response.status === 401) {
        authStore.logout()
      }
    }
  })
}
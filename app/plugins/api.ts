import { useAuthStore } from '~~/stores/auth'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()
    const toast = useToast()

    const api = $fetch.create({
        baseURL: config.public.apiBaseUrl,

        onRequest({ options }) {
            const headers = new Headers(options.headers)
            if (authStore.token) {
                headers.set('Authorization', `Bearer ${authStore.token}`)
            }
            options.headers = headers
        },

        async onResponseError({ response }) {
            if (response.status === 401) {
                const refreshed = await authStore.refreshAccessToken()

                if (refreshed) {
                    return
                } else {
                    authStore.logout()
                    return
                }
            }

            if (response.status >= 500) {
                toast.add({
                    title: 'Erro no servidor',
                    description: 'Tente novamente em instantes.',
                    color: 'error'
                })
            }

            if (response.status === 403) {
                toast.add({
                    title: 'Acesso negado',
                    description: 'Você não tem permissão para esta ação.',
                    color: 'warning'
                })
            }
        }
    })

    return { provide: { api } }
})
import { defineStore } from 'pinia'

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export const useAuthStore = defineStore('auth', () => {
    const config = useRuntimeConfig()

    const token = useCookie('auth_token', {
        maxAge: 60 * 60,
        path: '/',
        sameSite: 'lax',
        watch: true
    })

    const refreshToken = useCookie('auth_refresh_token', {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: 'lax',
        watch: true
    })

    const user = ref<User | null>(null)
    const isAuthenticated = computed(() => !!token.value)

    function setSession(accessToken: string, newUser: User, newRefreshToken?: string) {
        token.value = accessToken
        user.value = newUser
        if (newRefreshToken) {
            refreshToken.value = newRefreshToken
        }
    }

    async function refreshAccessToken(): Promise<boolean> {
        try {
            if (!refreshToken.value) return false

            const tokenUrl = `${config.public.cognitoDomain}/oauth2/token`

            const body = new URLSearchParams()
            body.append('grant_type', 'refresh_token')
            body.append('client_id', config.public.cognitoClientId)
            body.append('refresh_token', refreshToken.value)

            const data = await $fetch<any>(tokenUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body
            })

            if (data.access_token) {
                token.value = data.access_token
                if (data.refresh_token) refreshToken.value = data.refresh_token
                return true
            }
            return false

        } catch (error) {
            logout()
            return false
        }
    }

    function logout() {
        token.value = null
        refreshToken.value = null
        user.value = null

        const logoutUrl = `${config.public.cognitoDomain}/logout?client_id=${config.public.cognitoClientId}&logout_uri=${window.location.origin}`
        window.location.href = logoutUrl
    }

    return {
        token,
        refreshToken,
        user,
        isAuthenticated,
        setSession,
        refreshAccessToken,
        logout
    }
}, {
    persist: {
        pick: ['user']
    }
})
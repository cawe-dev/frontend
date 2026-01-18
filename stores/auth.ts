import { defineStore } from 'pinia'

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export const useAuthStore = defineStore('auth', () => {
    const token = useCookie('auth_token', {
        maxAge: 60 * 60 * 24,
        watch: true
    })

    const user = ref<User | null>(null)

    const isAuthenticated = computed(() => !!token.value)

    function setSession(newToken: string, newUser: User) {
        token.value = newToken
        user.value = newUser
    }

    function logout() {
        token.value = null
        user.value = null
        navigateTo('/')
    }

    return {
        token,
        user,
        isAuthenticated,
        setSession,
        logout
    }
}, {
    persist: {
        pick: ['user'],
    }
})
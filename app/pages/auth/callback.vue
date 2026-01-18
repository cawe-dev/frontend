<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const config = useRuntimeConfig()
const api = useBackend()

const exchangeCodeForToken = async (code: string) => {
  const tokenUrl = `${config.public.cognitoDomain}/oauth2/token`

  const body = new URLSearchParams()
  body.append('grant_type', 'authorization_code')
  body.append('client_id', config.public.cognitoClientId)
  body.append('code', code)
  body.append('redirect_uri', config.public.cognitoRedirectUri)

  const data = await $fetch<any>(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
  })

  return data
}

onMounted(async () => {
  const code = route.query.code as string

  if (code) {
    try {
      const tokens = await exchangeCodeForToken(code)
      const accessToken = tokens.access_token
      const refreshToken = tokens.refresh_token

      authStore.token = accessToken

      const userResponse = await api<any>('/auth/me')

      authStore.setSession(accessToken, userResponse, refreshToken)

      router.push('/admin/dashboard')

    } catch (err: any) {
      if (err.data) console.error('Details:', err.data)
      router.push('/')
    }
  } else {
    router.push('/')
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <UCard>
      <div class="text-center p-6">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl mb-4 text-primary" />
        <h1 class="text-xl font-bold">A autenticar...</h1>
        <p class="text-gray-500 text-sm mt-2">A trocar chaves de segurança.</p>
      </div>
    </UCard>
  </div>
</template>
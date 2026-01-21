<script lang="ts" setup>
import { useAuthStore, type User } from '~~/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const config = useRuntimeConfig()
const { $api } = useNuxtApp()
const toast = useToast()

interface LoginToastConfig {
  title: string;
  description: string;
  color: 'success' | 'error';
}

const LOGIN_TOAST_CONFIG: Record<'success' | 'error', LoginToastConfig> = {
  success: {
    title: 'Conectado com sucesso!',
    description: 'Bem-vindo(a) de volta!',
    color: 'success',
  },
  error: {
    title: 'Falha no login',
    description: 'Verifique suas credenciais e tente novamente.',
    color: 'error',
  },
};

function showLoginToast(type: 'success' | 'error') {
  const { title, description, color } = LOGIN_TOAST_CONFIG[type];

  toast.add({
    title,
    description,
    color
  });
}

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

      const userResponse = await $api<User>('/auth/me')

      authStore.setSession(accessToken, userResponse, refreshToken)

      showLoginToast('success')
      router.push('/admin/dashboard')

    } catch (err: any) {
      showLoginToast('error')
      if (err.data) console.error('Details:', err.data)
      router.push('/')
    }
  } else {
    showLoginToast('error')
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
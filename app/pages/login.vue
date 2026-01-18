<script setup lang="ts">
const config = useRuntimeConfig()

const handleLogin = () => {
  const cognitoUrl = `${config.public.cognitoDomain}/login?client_id=${config.public.cognitoClientId}&response_type=code&scope=email+openid+profile&redirect_uri=${config.public.cognitoRedirectUri}`
  window.location.href = cognitoUrl
}
</script>

<template>
  <div class="p-10 flex justify-center">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-bold">Bem-vindo</h1>
      </template>

      <p class="mb-6">Faça login para acessar ao sistema.</p>

      <UButton block color="primary" size="xl" icon="i-heroicons-arrow-right-on-rectangle" @click="handleLogin">
        Entrar com Cognito / Google
      </UButton>
    </UCard>
  </div>
</template>
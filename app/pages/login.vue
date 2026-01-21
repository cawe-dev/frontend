<script setup lang="ts">
const config = useRuntimeConfig()

onMounted(async () => {
  const cognitoUrl = `${config.public.cognitoDomain}/login?client_id=${config.public.cognitoClientId}&response_type=code&scope=email+openid+profile&redirect_uri=${config.public.cognitoRedirectUri}&&lang=pt-BR`
  window.location.href = cognitoUrl
})
</script>

<template>

</template>
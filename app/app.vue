<script setup lang="ts">
import Header from '~/components/menu/HeaderMobile.vue';

const toaster = { position: 'top-right' }
const { context } = useContext()

useHead({
  bodyAttrs: {
    'data-context': context
  }
})
</script>

<template>
  <UApp :toaster="toaster">
    <Header />
    <NuxtPage />
  </UApp>
</template>
<script setup lang="ts">
import Header from '~/components/menu/HeaderMobile.vue';

const { context } = useContext()

useHead({
  bodyAttrs: {
    'data-context': context
  }
})
</script>

<template>
  <UApp>
    <Header />
    <NuxtPage />
  </UApp>
</template>
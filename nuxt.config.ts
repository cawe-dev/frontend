// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { swr: 3600 },

    '/blog/**': { swr: true },

    '/about': { prerender: true },
    '/contact': { prerender: true },

    '/admin/**': { ssr: false },
  },

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8080/api'
    }
  },

  nitro: {
    preset: 'aws-amplify'
  }

})

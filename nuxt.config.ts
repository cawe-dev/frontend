// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],
  css: ['~/assets/css/main.css'],

  imports: {
    dirs: ['stores']
  },

  routeRules: {
    '/': { ssr: true },

    '/blog/**': { swr: true },

    '/about': { prerender: true },
    '/contact': { prerender: true },

    '/admin/**': { ssr: false },
  },

  pinia: {
    storesDirs: ['stores']
  },

  piniaPluginPersistedstate: {
    storage: 'localStorage',
    debug: true,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: '',
      cognitoDomain: '',
      cognitoClientId: '',
      cognitoRedirectUri: ''
    }
  },

  nitro: {
    preset: 'aws-amplify'
  }

})

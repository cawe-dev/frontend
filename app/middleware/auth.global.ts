import { useAuthStore } from '~~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  const publicRoutes = ['/', '/auth/callback', '/login']

  if (!publicRoutes.includes(to.path) && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }
  
  if (to.path.startsWith('/admin') && authStore.user?.role !== 'WRITER') {
    return navigateTo('/') 
  }
  if (to.path === '/login' && authStore.isAuthenticated) {
    if (authStore.user?.role === 'WRITER') {
      return navigateTo('/admin/dashboard')
    }
    return navigateTo('/')
  }

  if (to.path === '/logout'){
    return authStore.logout();
  }

})
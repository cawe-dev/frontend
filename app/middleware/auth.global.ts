import { useAuthStore } from '~~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  const publicRoutes = ['/', '/auth/callback', '/login']
  const isPublicRoute = publicRoutes.includes(to.path)

  if (!isPublicRoute && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  if (to.path === '/login' && authStore.isAuthenticated) {
    return navigateTo(authStore.user?.role === 'WRITER' ? '/admin/dashboard' : '/')
  }

  if (to.path.startsWith('/admin') && authStore.user?.role !== 'WRITER') {
    return navigateTo('/')
  }

  if (to.path === '/logout') {
    authStore.logout()
    return navigateTo('/')
  }
})
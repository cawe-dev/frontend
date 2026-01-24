export type ContextMode = 'professional' | 'personal'

export const useContext = () => {
  const context = useState<ContextMode>('app-context', () => 'professional')

  const setContext = (mode: ContextMode) => {
    context.value = mode
    if (import.meta.client) {
      document.documentElement.setAttribute('data-context', mode)
      localStorage.setItem('blog-context', mode)
    }
  }

  const toggleContext = () => {
    setContext(context.value === 'professional' ? 'personal' : 'professional')
  }

  const initializeContext = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('blog-context') as ContextMode | null
      if (saved) {
        context.value = saved
        document.documentElement.setAttribute('data-context', saved)
      } else {
        document.documentElement.setAttribute('data-context', context.value)
      }
    }
  }

  return {
    context,
    setContext,
    toggleContext,
    initializeContext
  }
}
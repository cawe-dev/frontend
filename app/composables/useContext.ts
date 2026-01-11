export const useContext = () => {
  const context = useState<'professional' | 'personal'>('app-context', () => 'professional')

  return {
    context
  }
}
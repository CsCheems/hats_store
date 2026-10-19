import { createContext, useContext } from 'react'

// Igual que en ToastContext: el hook fuera del archivo del provider para no
// romper la regla de `react-refresh`.
export const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth() necesita un <AuthProvider> por encima.')
  return context
}

import { createContext, useContext } from 'react'

// El contexto y su hook viven aparte del provider: `react-refresh` no admite
// que un archivo con componentes exporte además cosas que no lo son.
export const ToastContext = createContext(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast() necesita un <ToastProvider> por encima.')
  return context
}

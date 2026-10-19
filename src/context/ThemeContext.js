import { createContext, useContext } from 'react'

// El contexto y su hook viven aparte del provider, igual que en los otros dos:
// `react-refresh` no admite que un archivo con componentes exporte además cosas
// que no lo son.
export const ThemeContext = createContext(null)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme() necesita un <ThemeProvider> por encima.')
  return context
}

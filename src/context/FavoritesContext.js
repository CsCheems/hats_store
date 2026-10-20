import { createContext, useContext } from 'react'

// El contexto y su hook viven aparte del provider: `react-refresh` no admite
// que un archivo con componentes exporte además cosas que no lo son.
export const FavoritesContext = createContext(null)

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites() necesita un <FavoritesProvider> por encima.')
  return context
}

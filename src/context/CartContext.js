import { createContext, useContext } from 'react'

// El contexto y su hook viven aparte del provider: `react-refresh` no admite
// que un archivo con componentes exporte además cosas que no lo son.
export const CartContext = createContext(null)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart() necesita un <CartProvider> por encima.')
  return context
}

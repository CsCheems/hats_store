import { useCallback, useEffect, useMemo, useState } from 'react'
import { shopToasts } from '../data/shop'
import { addToCart, getCart, removeFromCart, setCartQuantity } from '../services/shop'
import { useAuth } from './AuthContext'
import { CartContext } from './CartContext'
import { useToast } from './ToastContext'

const VACIA = { items: [], unidades: 0, total: 0 }

/**
 * La bolsa de quien tiene sesión, en la base.
 *
 * Cada escritura devuelve la bolsa entera y esa respuesta SUSTITUYE a la que hay
 * aquí: nunca se suma ni se resta a mano, así que lo que se ve es siempre lo que
 * la base confirmó (con las cantidades ya recortadas a las existencias y el
 * precio de hoy). Lo cargado va firmado con el id de la sesión, igual que en
 * FavoritesProvider.
 *
 * Sin sesión, «añadir» no escribe nada: avisa y abre el modal de acceso.
 */
export function CartProvider({ children }) {
  const { user, openAuth } = useAuth()
  const { pushToast } = useToast()
  const userId = user?.id ?? null

  const [cargado, setCargado] = useState({ userId: null, data: VACIA, error: null })
  const [intento, setIntento] = useState(0)
  const [ocupada, setOcupada] = useState(false)

  const vigente = cargado.userId === userId && userId !== null
  const data = vigente ? cargado.data : VACIA
  const error = vigente ? cargado.error : null
  const status = userId === null ? 'anonymous' : vigente ? (error ? 'error' : 'ready') : 'loading'

  useEffect(() => {
    if (!userId) return

    let activa = true

    getCart()
      .then((respuesta) => activa && setCargado({ userId, data: respuesta, error: null }))
      .catch((fallo) => activa && setCargado({ userId, data: VACIA, error: fallo }))

    return () => {
      activa = false
    }
  }, [userId, intento])

  const reload = useCallback(() => setIntento((n) => n + 1), [])

  // Pide una escritura y guarda la bolsa que devuelve. Devuelve la respuesta, o
  // null si falló (el aviso ya se dijo).
  const escribir = useCallback(
    async (peticion) => {
      setOcupada(true)
      try {
        const respuesta = await peticion()
        setCargado({ userId, data: respuesta, error: null })
        return respuesta
      } catch (fallo) {
        pushToast(shopToasts.error(fallo.message))
        return null
      } finally {
        setOcupada(false)
      }
    },
    [userId, pushToast],
  )

  /**
   * Suma `cantidad` al artículo. Si ya había alguno y el servidor lo recortó a
   * las existencias, el aviso lo dice en vez de fingir que se añadió todo.
   */
  const add = useCallback(
    async (slug, cantidad, titulo) => {
      if (!userId) {
        pushToast(shopToasts.entrarParaBolsa)
        openAuth('login')
        return false
      }

      const antes = data.items.find((item) => item.id === slug)?.cantidad ?? 0
      const respuesta = await escribir(() => addToCart(slug, cantidad))
      if (!respuesta) return false

      pushToast(
        respuesta.cantidad < antes + cantidad
          ? shopToasts.recortado(titulo, respuesta.cantidad)
          : shopToasts.anadido(titulo, cantidad),
      )
      return true
    },
    [userId, data.items, escribir, pushToast, openAuth],
  )

  const setQuantity = useCallback((slug, cantidad) => escribir(() => setCartQuantity(slug, cantidad)), [escribir])
  const remove = useCallback((slug) => escribir(() => removeFromCart(slug)), [escribir])

  const value = useMemo(
    () => ({
      items: data.items,
      unidades: data.unidades,
      total: data.total,
      status,
      error,
      ocupada,
      add,
      setQuantity,
      remove,
      reload,
    }),
    [data, status, error, ocupada, add, setQuantity, remove, reload],
  )

  return <CartContext value={value}>{children}</CartContext>
}

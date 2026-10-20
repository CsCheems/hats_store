import { useCallback, useEffect, useMemo, useState } from 'react'
import { shopToasts } from '../data/shop'
import { addFavorite, getFavorites, removeFavorite } from '../services/shop'
import { useAuth } from './AuthContext'
import { FavoritesContext } from './FavoritesContext'
import { useToast } from './ToastContext'

// Una sola lista vacía para todos los renders: un `[]` nuevo en cada uno haría
// cambiar las dependencias de los useMemo de abajo sin que nada haya cambiado.
const SIN_ITEMS = []

/**
 * Los favoritos de quien tiene sesión, en la base.
 *
 * Cuelga de AuthProvider —necesita saber quién es— y se carga cuando hay
 * usuario. Lo cargado va FIRMADO con el id de quien lo pidió: si la sesión
 * cambia (cierra una, abre otra), lo que no es de la sesión actual simplemente
 * no cuenta. Es la misma idea que useApiResource, y evita borrar el estado a mano
 * con un setState dentro del efecto.
 *
 * `overrides` es la respuesta inmediata del marcador: al pulsarlo, el icono
 * cambia al instante y la petición ocurre detrás. Cuando el servidor confirma y
 * la lista se vuelve a leer, la anulación se retira; si falla, se retira también
 * y el icono vuelve a lo que de verdad hay en la base.
 */
export function FavoritesProvider({ children }) {
  const { user, openAuth } = useAuth()
  const { pushToast } = useToast()
  const userId = user?.id ?? null

  const [cargado, setCargado] = useState({ userId: null, items: SIN_ITEMS, error: null })
  const [intento, setIntento] = useState(0)
  const [overrides, setOverrides] = useState({})

  const vigente = cargado.userId === userId && userId !== null
  const items = vigente ? cargado.items : SIN_ITEMS
  const error = vigente ? cargado.error : null
  const status = userId === null ? 'anonymous' : vigente ? (error ? 'error' : 'ready') : 'loading'

  const leer = useCallback(
    () =>
      getFavorites()
        .then((data) => setCargado({ userId, items: data.items, error: null }))
        .catch((fallo) => setCargado({ userId, items: SIN_ITEMS, error: fallo })),
    [userId],
  )

  useEffect(() => {
    if (!userId) return
    leer()
  }, [userId, intento, leer])

  const reload = useCallback(() => setIntento((n) => n + 1), [])

  const slugs = useMemo(() => new Set(items.map((item) => item.id)), [items])

  const isSaved = useCallback(
    (slug) => (slug in overrides ? overrides[slug] : slugs.has(slug)),
    [overrides, slugs],
  )

  /**
   * Marca o desmarca. Sin sesión no hace nada en la base: avisa y abre el modal
   * de acceso, y la persona vuelve a pulsar cuando ya entró. `titulo` solo se
   * usa para el aviso.
   */
  const toggle = useCallback(
    async (slug, titulo) => {
      if (!userId) {
        pushToast(shopToasts.entrarParaGuardar)
        openAuth('login')
        return
      }

      const quedara = !isSaved(slug)
      setOverrides((actual) => ({ ...actual, [slug]: quedara }))

      try {
        await (quedara ? addFavorite(slug) : removeFavorite(slug))
        await leer()
        pushToast(quedara ? shopToasts.guardadoOk(titulo) : shopToasts.quitadoOk(titulo))
      } catch (fallo) {
        pushToast(shopToasts.error(fallo.message))
      } finally {
        setOverrides((actual) => Object.fromEntries(Object.entries(actual).filter(([clave]) => clave !== slug)))
      }
    },
    [userId, isSaved, leer, pushToast, openAuth],
  )

  const value = useMemo(
    () => ({ items, status, error, total: items.length, isSaved, toggle, reload }),
    [items, status, error, isSaved, toggle, reload],
  )

  return <FavoritesContext value={value}>{children}</FavoritesContext>
}

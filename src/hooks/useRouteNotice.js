import { useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * El aviso que una página deja a la siguiente al navegar: «guardado» al volver a
 * la lista, «creado» al llegar a la edición. Viaja en el `state` del router
 * —navigate(ruta, { state: { aviso } })—, que es de esa entrada del historial y
 * de nadie más.
 *
 * Se DERIVA de la ubicación en vez de copiarse a un estado: la página de
 * productos es la misma instancia para /admin/productos y
 * /admin/productos/:categoria, y un useState inicializado con el aviso no se
 * enteraría del segundo. Cerrarlo recuerda qué entrada se cerró (`location.key`),
 * así que un aviso nuevo en otra navegación vuelve a verse.
 *
 * Recargar la página lo vuelve a enseñar: el navegador conserva el `state` de la
 * entrada. Borrarlo con un navigate de reemplazo cambiaría la clave y lo
 * perdería antes de pintarlo, y para una herramienta interna no compensa.
 */
export function useRouteNotice() {
  const location = useLocation()
  const [cerrado, setCerrado] = useState(null)

  const aviso = location.state?.aviso && cerrado !== location.key ? location.state.aviso : null

  return { aviso, cerrar: () => setCerrado(location.key) }
}

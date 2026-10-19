import { ENDPOINTS } from './endpoints'
import { http } from './http'

// Países y estados: `{ paises: [{ nombre, estados: [nombre…] }] }`.
//
// SE PIDE UNA SOLA VEZ POR CARGA DE PÁGINA. El formulario de alta se vuelve a
// montar en cada apertura del modal y en cada cambio de pestaña, y el catálogo
// no cambia en ese tiempo: pedirlo cada vez sería repetir la misma respuesta.
// Se guarda la PROMESA y no el resultado, así dos formularios que la piden a la
// vez comparten la misma petición; si falla, se olvida y la siguiente vuelve a
// intentarlo.
//
// Por eso NO recibe `options` ni pasa el `signal` de useApiResource, al revés
// que el resto de servicios: la petición es de todos, y no puede cancelarla un
// formulario que se desmonta a mitad de camino.

let pendiente = null

export function getUbicaciones() {
  pendiente ??= http.get(ENDPOINTS.ubicaciones).catch((error) => {
    pendiente = null
    throw error
  })

  return pendiente
}

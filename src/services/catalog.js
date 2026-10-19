import { ENDPOINTS } from './endpoints'
import { http } from './http'

// La única lectura de la tienda. Como services/admin.js: traduce argumentos a
// petición y no toca los errores — http.js ya los normaliza a ApiError.
//
// Recibe `options` y lo pasa tal cual: es lo que permite a useApiResource abortar
// la petición al desmontar.
//
// No lleva argumentos propios, y eso es deliberado: al ser una función de módulo
// sin parámetros ya es una referencia estable, así que useApiResource la acepta
// sin envolver en useCallback y —lo que de verdad importa— cambiar un filtro NO
// cambia el fetcher. La página pide una vez y filtra en memoria.

export function getCatalog(options) {
  return http.get(ENDPOINTS.products.list, options)
}

import { ENDPOINTS } from './endpoints'
import { http } from './http'

// Lo que la tienda lee y escribe fuera del catálogo: la ficha de un artículo, sus
// reseñas, los favoritos y la bolsa. Como services/catalog.js: traduce argumentos
// a petición y no toca los errores — http.js ya los normaliza a ApiError.
//
// Las lecturas reciben `options` y lo pasan tal cual, que es lo que permite a
// useApiResource abortarlas al desmontar.

// ─── Ficha y reseñas ───────────────────────────────────────────────────────

export function getProduct(slug, options) {
  return http.get(ENDPOINTS.products.detail(slug), options)
}

export function getReviews(slug, options) {
  return http.get(ENDPOINTS.products.reviews(slug), options)
}

// La reseña propia, o `{ resena: null }`. Pide sesión.
export function getMyReview(slug, options) {
  return http.get(ENDPOINTS.resenas.mine(slug), options)
}

// La calificación y la cantidad viajan como texto, igual que el precio y el stock
// del panel: el servidor es quien las valida y las convierte.
export function saveReview(slug, { calificacion, texto }) {
  return http.put(ENDPOINTS.resenas.one(slug), { calificacion: String(calificacion), texto })
}

export function deleteReview(slug) {
  return http.delete(ENDPOINTS.resenas.one(slug))
}

// ─── Favoritos ─────────────────────────────────────────────────────────────

export function getFavorites(options) {
  return http.get(ENDPOINTS.favoritos, options)
}

export function addFavorite(slug) {
  return http.put(ENDPOINTS.favorito(slug))
}

export function removeFavorite(slug) {
  return http.delete(ENDPOINTS.favorito(slug))
}

// ─── Bolsa ─────────────────────────────────────────────────────────────────
//
// Las tres escrituras devuelven la bolsa entera tras el cambio, y esa respuesta
// es la que sustituye a la del cliente: nunca se suma ni se resta a mano.

export function getCart(options) {
  return http.get(ENDPOINTS.carrito, options)
}

// Suma a lo que ya hay.
export function addToCart(slug, cantidad) {
  return http.post(ENDPOINTS.carritoItem(slug), { cantidad: String(cantidad) })
}

// Fija la cantidad; 0 quita el artículo.
export function setCartQuantity(slug, cantidad) {
  return http.put(ENDPOINTS.carritoItem(slug), { cantidad: String(cantidad) })
}

export function removeFromCart(slug) {
  return http.delete(ENDPOINTS.carritoItem(slug))
}

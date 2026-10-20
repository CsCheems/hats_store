import { ENDPOINTS } from './endpoints'
import { http } from './http'

// La compra: lo que se paga, adónde se envía y el pedido ya hecho. Como
// services/shop.js: traduce argumentos a petición y no toca los errores — http.js
// ya los normaliza a ApiError. Las lecturas reciben `options` para que
// useApiResource pueda abortarlas.

// El desglose de la bolsa: artículos, envío, base sin IVA, IVA y total. Lo calcula
// el servidor; esta pantalla no suma dinero.
export function getOrderSummary(options) {
  return http.get(ENDPOINTS.pedidos.resumen, options)
}

// `{ direcciones: [{ id, pais, estado, codigoPostal, colonia, calle, numero,
// predeterminada }] }`, la predeterminada primero.
export function getAddresses(options) {
  return http.get(ENDPOINTS.direcciones, options)
}

// `{ pedidos: [{ folio, estado, pagado, unidades, total, items }] }`, el más
// reciente primero. Solo los pagados.
export function getOrders(options) {
  return http.get(ENDPOINTS.pedidos.lista, options)
}

export function getOrder(folio, options) {
  return http.get(ENDPOINTS.pedidos.uno(folio), options)
}

// Cancela un pedido propio mientras no se haya enviado y devuelve el pedido como
// quedó. 409 `cannot_cancel` si ya salió de la tienda.
export function cancelOrder(folio) {
  return http.post(ENDPOINTS.pedidos.cancelar(folio))
}

/**
 * Paga la bolsa. `total` es el que la persona está viendo y viaja como texto, como
 * los precios: si el servidor calcula otro (cambió un precio mientras compraba),
 * se niega a cobrar. `token` es lo que devuelve la tokenización de la tarjeta; el
 * número nunca sale del navegador. Devuelve el pedido entero.
 */
export function placeOrder({ envio, total, token }) {
  return http.post(ENDPOINTS.pedidos.crear, {
    destinatario: envio.destinatario,
    telefono: envio.telefono,
    pais: envio.pais,
    estado: envio.estado,
    codigoPostal: envio.codigoPostal,
    colonia: envio.colonia,
    calle: envio.calle,
    numero: envio.numero,
    referencias: envio.referencias,
    guardar: envio.guardar,
    total: String(total),
    token,
  })
}

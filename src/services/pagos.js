// Del número de tarjeta al token que viaja al servidor.
//
// Hoy es SIMULADO, igual que la pasarela de backend/services/payments.gateway.js,
// y este archivo es su mitad del cliente: con una pasarela real aquí iría el SDK
// del proveedor (Stripe Elements, el tokenizador de Mercado Pago…), que manda la
// tarjeta directo a ellos y devuelve un token. El número completo, la fecha y el
// código NUNCA salen del navegador por nuestra API: el servidor solo ve el token.
//
// El token simulado es `sim_` y los últimos cuatro dígitos, y de ellos depende el
// resultado (backend/services/payments.gateway.js lista las terminadas en 0002 y
// 9995, que rechazan). Es asíncrono aunque no haga nada de red, para que quien lo
// llama ya esté escrito como lo estará con la pasarela de verdad.

export async function tokenizeCard({ tarjetaNumero }) {
  const ultimos4 = tarjetaNumero.replace(/\D/g, '').slice(-4)

  return { token: `sim_${ultimos4}` }
}

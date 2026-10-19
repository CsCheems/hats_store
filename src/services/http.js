import axios from 'axios'

// Cliente HTTP del proyecto, sobre axios.
//
// La forma —baseURL, timeout, error normalizado— es la misma que tenía la
// versión sobre `fetch`, y eso era el objetivo de aquella: lo que cambió aquí es
// el motor, no el contrato, así que ningún servicio ni componente se enteró.
//
// Nota de seguridad: axios seguro a partir de 1.18.0 — las versiones anteriores
// arrastran los seis avisos de julio de 2026 (el peor, CVE-2026-67320). En
// package.json va ^1.20.0; este comentario es la razón para no bajar de ahí.

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

const TIMEOUT = 12000

/**
 * Error de API normalizado. Todo lo que sale de este módulo lo hace con esta
 * forma, venga de la red, del servidor o de un timeout, para que la UI solo
 * tenga que leer `message` y —cuando aplique— `field`.
 */
export class ApiError extends Error {
  constructor({ status = 0, code = 'unknown', message, field = null }) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.field = field
  }
}

// El backend puede responder el error de varias formas; aquí se aplana a una.
function toApiError(status, payload) {
  return new ApiError({
    status,
    code: payload?.code ?? `http_${status}`,
    message: payload?.message ?? 'No pudimos completar la petición. Inténtalo de nuevo.',
    field: payload?.field ?? null,
  })
}

const client = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,

  // El equivalente del `credentials: 'include'` de fetch. Hoy no viaja ninguna
  // cookie, pero el modo lo fija igual: el día que haya sesión, la cookie viaja
  // sin tocar nada, y mientras tanto obliga al backend a nombrar su origen en
  // CORS en vez de poner un comodín.
  withCredentials: true,

  // El Content-Type no se declara: axios pone application/json cuando el cuerpo
  // es un objeto, y no lo pone cuando no hay cuerpo. La versión sobre fetch lo
  // mandaba siempre, GET incluidos, que era ruido.
})

// Al que llama le interesa el cuerpo, no el sobre.
//
// El `data` de una respuesta sin contenido es cadena vacía —medido con axios
// 1.20.0, no supuesto—, y quien recibe un 204 debe recibir null, que es lo que
// devolvía la versión anterior.
//
// Diferencia deliberada con aquella: un cuerpo que dice ser JSON y no lo es
// llegaba como null y ahora llega como el texto crudo. `silentJSONParsing: false`
// no lo cambia (comprobado), y no vale la pena inventarse un parseo propio para
// un caso que solo ocurre si el servidor está roto.
const unwrap = (response) => (response.data === '' ? null : response.data)

function normalize(error) {
  // Hubo respuesta: es un error de la API y su cuerpo ya trae { code, message,
  // field }, que es justo lo que toApiError sabe leer.
  if (error.response) return toApiError(error.response.status, error.response.data)

  // Cancelado por quien llamó, vía `options.signal`. Quien aborta ya sabe que
  // abortó: un «no hay conexión» aquí sería mentira, y por eso no comparte
  // código con la rama de red.
  if (error.code === 'ERR_CANCELED') {
    return new ApiError({ code: 'canceled', message: 'Petición cancelada.' })
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return new ApiError({
      code: 'timeout',
      message: 'El servidor tardó demasiado en responder.',
    })
  }

  // Cualquier otra cosa sin respuesta es lo mismo visto desde el navegador: red
  // caída, servidor apagado o CORS mal puesto. El navegador no deja distinguir
  // el último por diseño, así que el mensaje no promete un diagnóstico que no
  // tenemos.
  return new ApiError({ code: 'network', message: 'No hay conexión con el servidor.' })
}

client.interceptors.response.use(unwrap, (error) => Promise.reject(normalize(error)))

/**
 * La fachada se mantiene en vez de exportar la instancia: es lo que hace cierta
 * la primera frase de este archivo. Con `export const http = client`, cualquiera
 * podría alcanzar `http.defaults` o `http.interceptors` desde un componente, y
 * el siguiente cambio de cliente ya no sería un archivo.
 *
 * Las firmas son las de axios —(path, options) y (path, body, options)— porque
 * ya eran las de la versión sobre fetch.
 */
export const http = {
  get: (path, options) => client.get(path, options),
  post: (path, body, options) => client.post(path, body, options),
  put: (path, body, options) => client.put(path, body, options),
  patch: (path, body, options) => client.patch(path, body, options),
  delete: (path, options) => client.delete(path, options),
}

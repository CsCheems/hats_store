import { ENDPOINTS } from './endpoints'
import { http } from './http'

// Este archivo es la traducción entre los valores del formulario y el cuerpo de
// la petición, y nada más. Los errores no se tocan: http.js ya los normaliza a
// ApiError con { code, message, field }, y el `field` que manda el backend trae
// el nombre exacto del campo, así que useAuthForm pinta el mensaje debajo y
// manda el foco sin que aquí haya que intervenir.

export function login({ email, password }) {
  return http.post(ENDPOINTS.auth.login, { email, password })
}

/**
 * Quién está en sesión, si es que hay alguien.
 *
 * Un 401 aquí no es un fallo: es la respuesta a «¿hay sesión?» cuando no la hay.
 * Quien llama —AuthProvider, al montar— lo distingue por el code
 * `not_authenticated` y no avisa de nada.
 *
 * Esta llamada existe porque la cookie es httpOnly: el navegador la manda en
 * cada petición, pero JS no puede leerla, así que preguntar al servidor es la
 * única forma de saber si hay sesión.
 */
export function me() {
  return http.get(ENDPOINTS.auth.me)
}

// Cierra la sesión en el servidor, que es lo único que la invalida de verdad:
// borrar solo la cookie del navegador dejaría la sesión viva para quien tuviera
// el id.
export function logout() {
  return http.post(ENDPOINTS.auth.logout)
}

/**
 * Alta de cuenta.
 *
 * El cuerpo se arma nombrando los doce campos y no mandando `values` entero: el
 * día que data/auth.js gane un campo que es solo de la UI —una casilla de
 * términos, por ejemplo— no empezará a subirse solo y en silencio.
 *
 * `confirmPassword` sí se manda: el servidor repite la comprobación porque la
 * del cliente se salta con curl. Mientras esta lista sea idéntica a
 * `authFields.register`, los dos esquemas se comparan de un vistazo.
 *
 * El correo se manda tal como se escribió. Normalizarlo aquí no evitaría hacerlo
 * también en el servidor —que no puede fiarse del cliente— y tener dos
 * definiciones de «el mismo correo» es como se acaba con dos cuentas para la
 * misma persona. El backend normaliza y devuelve el correo canónico.
 */
/**
 * Guarda la edición del perfil y devuelve el usuario actualizado, con la misma
 * forma que me().
 *
 * Mismo criterio que register(): el cuerpo se arma nombrando campos. El correo
 * NO se manda —en la edición es de solo lectura— y las tres contraseñas viajan
 * siempre, vacías si no se tocaron: el servidor omite el grupo cuando llega
 * vacío, igual que validateProfile aquí.
 *
 * Si cambió la contraseña, la respuesta trae cookies de sesión nuevas: Supabase
 * cierra las demás sesiones de la cuenta, incluida la anterior de este
 * navegador. El navegador las guarda solo; aquí no hay nada que hacer.
 */
export function updateProfile(values) {
  return http.put(ENDPOINTS.auth.me, {
    nombre: values.nombre,
    apellido: values.apellido,
    telefono: values.telefono,
    pais: values.pais,
    estado: values.estado,
    codigoPostal: values.codigoPostal,
    colonia: values.colonia,
    calle: values.calle,
    numero: values.numero,
    currentPassword: values.currentPassword,
    password: values.password,
    confirmPassword: values.confirmPassword,
  })
}

export function register(values) {
  return http.post(ENDPOINTS.auth.register, {
    nombre: values.nombre,
    apellido: values.apellido,
    telefono: values.telefono,
    pais: values.pais,
    estado: values.estado,
    codigoPostal: values.codigoPostal,
    colonia: values.colonia,
    calle: values.calle,
    numero: values.numero,
    email: values.email,
    password: values.password,
    confirmPassword: values.confirmPassword,
  })
}

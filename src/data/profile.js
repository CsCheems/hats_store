import { authToasts, authViews } from './auth'

// Copy y estructura de la página de perfil.
//
// La página no muestra pares etiqueta/valor: muestra el MISMO formulario del
// alta con los campos en solo lectura, y editar es quitarles esa propiedad, no
// construir otra pantalla. Por eso lo que hay aquí son campos y no textos.

export const profileCopy = {
  kicker: '01 — Tu cuenta',
  edit: 'Editar datos',
  formTitle: 'Tus datos',
  formIntro: 'Así te tenemos registrada la cuenta. Puedes copiar cualquier dato de aquí.',
  editTitle: 'Editar tus datos',
  editIntro:
    'Cambia lo que necesites. Si no vas a cambiar la contraseña, deja sus tres campos vacíos.',
  save: 'Guardar cambios',
  saving: 'Guardando…',
  cancel: 'Cancelar',
}

// Lo que se pide una vez al registrarse y no se enseña en la consulta.
//
// La contraseña queda fuera, y no por descuido: un campo de solo lectura con
// ocho puntos dentro no es un dato, es un adorno. Aparece solo al editar.
//
// Esta lista es el único punto que hay que pensar cuando el alta gane un campo
// —una casilla de términos, por ejemplo, que se acepta al registrarse y no se
// consulta luego—. Todo lo demás aparece solo.
const EXCLUIDOS = new Set(['password', 'confirmPassword'])

/**
 * Las secciones se derivan de las del alta en vez de volver a escribirlas
 * —mismo recurso que `authFields` en data/auth.js o `productPages` en
 * products.js—, así que el perfil y el registro no pueden divergir: los mismos
 * campos, en el mismo orden, con la misma retícula, porque `half` viaja con
 * cada campo.
 */
export const profileSections = authViews.register.sections.map((section) => ({
  title: section.title,
  fields: section.fields.filter((field) => !EXCLUIDOS.has(field.name)),
}))

// ─── Edición ───────────────────────────────────────────────────────────────

// Cambiar la contraseña es opcional y va en bloque: si los tres campos se dejan
// vacíos no cambia; si se escribe en uno, los tres son obligatorios. Lo leen
// validateProfile (utils/validation.js) y, con los mismos nombres, el
// updateMeSchema del backend.
export const PASSWORD_GROUP = ['currentPassword', 'password', 'confirmPassword']

// El correo se ve pero no se edita: Supabase solo lo cambia tras confirmarlo
// por correo, y ese flujo todavía no existe.
const SOLO_LECTURA = new Set(['email'])

// La única pieza que el alta no tiene. Va a lo ancho, delante de las otras dos,
// que conservan su media fila.
const CONTRASENA_ACTUAL = {
  name: 'currentPassword',
  label: 'Contraseña actual',
  type: 'password',
  placeholder: 'Solo si vas a cambiarla',
  autoComplete: 'current-password',
}

// Las del alta, renombradas: aquí no se elige «la» contraseña sino una nueva.
// Placeholder y autocompletado se heredan.
const RENOMBRADOS = {
  password: { label: 'Nueva contraseña' },
  confirmPassword: { label: 'Confirmar nueva' },
}

/**
 * Las secciones del alta tal cual, con tres ajustes: el correo en solo lectura,
 * la contraseña actual delante de la nueva y las dos del alta renombradas.
 * Derivadas, como `profileSections`: un campo nuevo en el alta aparece aquí sin
 * tocar este archivo.
 */
export const profileEditSections = authViews.register.sections.map((section) => ({
  title: section.title,
  fields: section.fields.flatMap((field) => {
    if (SOLO_LECTURA.has(field.name)) return [{ ...field, readOnly: true }]
    if (field.name === 'password') return [CONTRASENA_ACTUAL, { ...field, ...RENOMBRADOS.password }]
    if (field.name in RENOMBRADOS) return [{ ...field, ...RENOMBRADOS[field.name] }]
    return [field]
  }),
}))

// Lista plana, en el orden de la pantalla, para la validación.
export const profileEditFields = profileEditSections.flatMap((section) => section.fields)

/**
 * Aplana el usuario de la sesión a los nombres planos que usan los campos: la
 * API devuelve la dirección anidada y el formulario la quiere en una sola capa.
 *
 * Es el reverso exacto del armado que hace register() en services/auth.js. Una
 * cuenta sin dirección —posible desde que viven en la base de datos— da campos
 * vacíos en lugar de romper la página.
 */
export function toFormValues(user) {
  const direccion = user.direccion ?? {}

  return {
    nombre: user.nombre,
    apellido: user.apellido,
    telefono: user.telefono,
    pais: direccion.pais ?? '',
    estado: direccion.estado ?? '',
    codigoPostal: direccion.codigoPostal ?? '',
    colonia: direccion.colonia ?? '',
    calle: direccion.calle ?? '',
    numero: direccion.numero ?? '',
    email: user.email,
  }
}

// Lo que siembra la edición: los datos de siempre y las contraseñas vacías.
export function toEditValues(user) {
  return {
    ...toFormValues(user),
    ...Object.fromEntries(PASSWORD_GROUP.map((name) => [name, ''])),
  }
}

// Textos de los toasts de la edición.
export const profileToasts = {
  // El mismo aviso que el modal: el problema es idéntico y dicho igual.
  invalid: authToasts.invalid,
  saved: {
    tone: 'success',
    title: 'Datos guardados',
    body: 'Tu cuenta ya tiene los cambios.',
  },
  // Cambiar la contraseña cierra las demás sesiones de la cuenta en Supabase.
  // Decirlo evita que alguien crea que su teléfono «se desconectó solo».
  passwordChanged: {
    tone: 'success',
    title: 'Datos guardados',
    body: 'También cambiamos tu contraseña y cerramos tu sesión en los demás dispositivos.',
  },
  failure: {
    tone: 'error',
    title: 'No pudimos guardar',
  },
}

// Panel para quien llega a /perfil sin sesión. No se redirige a la portada: un
// enlace guardado en marcadores no debe parecer roto, y el modal ya existe.
export const signInInvite = {
  kicker: 'Área de cuenta',
  title: 'Esta página es tuya',
  body: 'Entra para ver los datos de tu cuenta, tus pedidos y lo que dejaste apartado.',
  action: 'Entrar',
}

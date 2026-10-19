import { catalogMessages, productFields, productMessages } from '../data/admin'
import { authFields, validationMessages as MSG } from '../data/auth'
import { PASSWORD_GROUP, profileEditFields } from '../data/profile'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const MIN_PASSWORD = 8

// Se cuentan dígitos, no caracteres: «81 1234 5678» y «81-1234-5678» son
// teléfonos perfectamente escritos y rechazarlos sería una pedantería.
const digits = (value) => value.replace(/\D/g, '')

// Reglas de formato por nombre de campo. Reciben el valor ya no vacío y
// devuelven el mensaje del error o null. Un campo sin regla solo se comprueba
// como obligatorio.
const FORMAT = {
  email: (value) => (EMAIL.test(value) ? null : MSG.email),
  telefono: (value) => (digits(value).length === 10 ? null : MSG.telefono),
  codigoPostal: (value) => (digits(value).length === 5 ? null : MSG.codigoPostal),
}

// El mínimo de longitud solo aplica a una contraseña que se está eligiendo: en
// el login ya existe y decirle a alguien que «necesita 8 caracteres» al entrar
// es ruido.
const minPasswordRule = (value) => (value.length >= MIN_PASSWORD ? null : MSG.passwordShort)

// La contraseña no se recorta: los espacios son parte de ella.
const read = (values, field) => {
  const raw = values[field.name] ?? ''
  return field.type === 'password' ? raw : raw.trim()
}

/**
 * Valida una lista de campos y devuelve `{ campo: 'mensaje' }`. Objeto vacío =
 * formulario válido. El orden de las claves sigue al de los campos, así que la
 * primera entrada es siempre el campo que debe recibir el foco.
 *
 * - `minPassword`: el campo `password` exige la longitud mínima.
 * - `matchPassword`: `password` y `confirmPassword` tienen que coincidir.
 *
 * Los campos `readOnly` no se validan: no se pueden corregir, y tampoco se
 * envían.
 */
export function validateFields(fields, values, { minPassword = false, matchPassword = false } = {}) {
  const errors = {}

  for (const field of fields) {
    if (field.readOnly) continue

    const value = read(values, field)

    if (!value) {
      errors[field.name] = MSG.required
      continue
    }

    const rule = FORMAT[field.name] ?? (minPassword && field.name === 'password' ? minPasswordRule : null)
    const message = rule?.(value)

    if (message) errors[field.name] = message
  }

  // Regla cruzada: solo tiene sentido cuando ambas contraseñas están puestas,
  // si no pisaría el «campo obligatorio» de la confirmación.
  if (
    matchPassword &&
    values.password &&
    values.confirmPassword &&
    values.password !== values.confirmPassword
  ) {
    errors.confirmPassword = MSG.passwordMismatch
  }

  return errors
}

/** Una vista del modal de acceso: `login` o `register`. */
export function validate(view, values) {
  const choosing = view === 'register'

  return validateFields(authFields[view], values, {
    minPassword: choosing,
    matchPassword: choosing,
  })
}

// Los campos de la edición sin el grupo de contraseñas, para cuando no se toca.
const PROFILE_WITHOUT_PASSWORD = profileEditFields.filter(
  (field) => !PASSWORD_GROUP.includes(field.name),
)

/**
 * La edición del perfil: las mismas reglas que el alta, con la contraseña como
 * grupo opcional. Si sus tres campos están vacíos, no se validan y la
 * contraseña no cambia; en cuanto se escribe en uno, los tres son obligatorios.
 *
 * Espejo del `optionalGroup` de updateMeSchema en backend/validation/
 * auth.schema.js. Si una regla cambia, cambian las dos.
 */
export function validateProfile(values) {
  const changingPassword = PASSWORD_GROUP.some((name) => values[name])

  return validateFields(changingPassword ? profileEditFields : PROFILE_WITHOUT_PASSWORD, values, {
    minPassword: true,
    matchPassword: true,
  })
}

// ─── Artículos del panel ───────────────────────────────────────────────────
//
// Espejo de productSchema (backend/validation/admin.schema.js) y de sus formatos
// en backend/validation/rules.js, con los mismos regex y los mismos topes. El
// invariante de siempre: el cliente puede ser igual o más laxo, nunca más
// estricto.

const PRECIO = /^\d{1,8}(\.\d{1,2})?$/
const STOCK = /^\d{1,6}$/

const PRODUCT_FORMAT = {
  titulo: (value) => (value.length <= 120 ? null : productMessages.tituloLargo),
  descripcion: (value) => (value.length <= 600 ? null : productMessages.descripcionLarga),
  precio: (value) => (PRECIO.test(value) && Number(value) > 0 ? null : productMessages.precio),
  stock: (value) => (STOCK.test(value) ? null : productMessages.stock),
}

/**
 * Valida un artículo. `categoria` es la entrada del catálogo que está elegida
 * (o undefined): decide si el género existe y es obligatorio. Los campos que no
 * aplican a la categoría no se validan, igual que no se pintan.
 *
 * Las casillas no se validan: siempre tienen valor.
 */
export function validateProduct(values, categoria) {
  const errors = {}

  for (const field of productFields) {
    if (field.type === 'checkbox') continue
    if (field.visibleIf && !categoria?.[field.visibleIf]) continue

    const value = (values[field.name] ?? '').trim()

    if (!value) {
      if (field.optional) continue
      errors[field.name] = field.name === 'genero' ? productMessages.generoFalta : productMessages.required
      continue
    }

    const message = PRODUCT_FORMAT[field.name]?.(value)
    if (message) errors[field.name] = message
  }

  return errors
}

// ─── Marcas y categorías del panel ─────────────────────────────────────────
//
// Espejo de brandSchema y categorySchema, con los topes de rules.js. Que el
// nombre o el prefijo estén libres solo lo sabe el servidor.

const NOMBRE_MAX = 40
const PREFIJO = /^[A-Za-z]{3}$/

function validateNombre(values, errors) {
  const nombre = values.nombre.trim()

  if (!nombre) errors.nombre = catalogMessages.required
  else if (nombre.length > NOMBRE_MAX) errors.nombre = catalogMessages.nombreLargo
}

export function validateBrand(values) {
  const errors = {}

  validateNombre(values, errors)
  if (values.categorias.length === 0) errors.categorias = catalogMessages.categorias

  return errors
}

// Las casillas no se validan: siempre tienen valor.
export function validateCategory(values) {
  const errors = {}

  validateNombre(values, errors)

  const prefijo = values.prefijo.trim()
  if (!prefijo) errors.prefijo = catalogMessages.required
  else if (!PREFIJO.test(prefijo)) errors.prefijo = catalogMessages.prefijo

  return errors
}

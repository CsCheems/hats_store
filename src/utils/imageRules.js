import { galleryCopy } from '../data/admin'

// Las reglas de una imagen de producto, en un solo sitio porque las usan dos
// controles: la galería de la edición y el campo de imagen del alta. Son las
// mismas que impone el servidor (backend/middleware/validateImage.js) y el
// bucket (db/scripts/10); aquí solo sirven para no subir 10 MB que se van a
// rechazar. Quien decide es el servidor.
export const TIPOS = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_BYTES = 10 * 1024 * 1024
export const LADO_MIN = 800
export const LADO_MAX = 5000
// Lo que cabe en la galería de un artículo: lo imponen el check de la base y el
// servidor (db/scripts/07, `orden between 1 and 8`).
export const MAX_IMAGENES = 8

// La recomendación de CLAUDE.md para producto: vertical 4:5, 1000 × 1250 o más.
// No bloquea: los contenedores recortan con object-cover.
export const recomendada = ({ width, height }) =>
  width >= 1000 && height >= 1250 && Math.abs(width / height - 0.8) <= 0.02

// Las medidas reales del archivo, sin subirlo. Si el navegador no sabe leerlo
// devuelve null y simplemente no se avisa: el servidor dirá lo suyo.
export async function medir(file) {
  try {
    const bitmap = await createImageBitmap(file)
    const medidas = { width: bitmap.width, height: bitmap.height }
    bitmap.close()
    return medidas
  } catch {
    return null
  }
}

/**
 * Tipo, peso y medidas de un archivo, en ese orden. Devuelve `{ error, medidas }`:
 * `error` es el texto que se enseña (o null si el archivo vale) y `medidas` lo
 * que se midió (o null), para que quien llama pueda avisar de la proporción.
 */
export async function revisarImagen(file) {
  if (!TIPOS.includes(file.type)) return { error: galleryCopy.errorTipo(file.name), medidas: null }
  if (file.size > MAX_BYTES) return { error: galleryCopy.errorPeso(file.name), medidas: null }

  const medidas = await medir(file)

  if (medidas && (medidas.width < LADO_MIN || medidas.height < LADO_MIN)) {
    return { error: galleryCopy.errorChica(file.name, medidas.width, medidas.height), medidas }
  }
  if (medidas && (medidas.width > LADO_MAX || medidas.height > LADO_MAX)) {
    return { error: galleryCopy.errorGrande(file.name, medidas.width, medidas.height), medidas }
  }

  return { error: null, medidas }
}

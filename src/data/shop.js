// Textos de la ficha de producto, los favoritos («Guardados»), la bolsa y las
// reseñas. Todo el copy vive aquí y no en el JSX, como en el resto de data/.

// ─── Ficha ─────────────────────────────────────────────────────────────────

export const productCopy = {
  inicio: 'Inicio',
  catalogo: 'Catálogo',
  cargando: 'Cargando…',
  errorTitulo: 'No pudimos cargar esto',
  reintentar: 'Reintentar',
  noExisteTitulo: 'No encontramos este sombrero',
  noExisteCuerpo: 'Puede que ya no esté a la venta o que el enlace esté mal escrito.',
  volverCatalogo: 'Volver al catálogo',

  descripcion: 'Descripción',
  fieltro: 'Fieltro',
  disponibilidad: 'Disponibilidad',
  disponible: 'Disponible',
  agotado: 'Agotado',
  quedan: (n) => `Quedan ${n} ${n === 1 ? 'pieza' : 'piezas'}`,

  cantidad: 'Cantidad',
  menos: 'Una pieza menos',
  mas: 'Una pieza más',
  anadir: 'Añadir a la bolsa',
  anadiendo: 'Añadiendo…',
  sinExistencias: 'Sin existencias',

  guardar: 'Guardar',
  guardado: 'Guardado',
  quitarGuardado: 'Quitar de guardados',

  galeria: 'Fotos del artículo',
  verMejor: 'Ver imagen más grande',
  foto: (titulo, n, total) => `${titulo}, foto ${n} de ${total}`,
  miniatura: (n) => `Ver foto ${n}`,
  sinFoto: 'Este artículo todavía no tiene fotos.',

  sugerencias: 'Te puede interesar',
  sugerenciasSub: 'Otros sombreros de la tienda',
}

export const lightboxCopy = {
  titulo: 'Imagen ampliada',
  cerrar: 'Cerrar',
  anterior: 'Foto anterior',
  siguiente: 'Foto siguiente',
  contador: (n, total) => `${n} de ${total}`,
}

// ─── Reseñas ───────────────────────────────────────────────────────────────

export const reviewsCopy = {
  titulo: 'Reseñas',
  sinResenas: 'Todavía no hay reseñas de este sombrero.',
  sePrimera: 'Sé la primera persona en opinar.',
  promedio: (n) => `${n} de 5`,
  total: (n) => (n === 1 ? '1 reseña' : `${n} reseñas`),
  estrellas: (n) => `${n} ${n === 1 ? 'estrella' : 'estrellas'}`,
  puntuacion: (n) => `${n} de 5 estrellas`,

  formTitulo: 'Cuéntanos qué te pareció',
  formTituloEditar: 'Tu reseña',
  calificacion: 'Calificación',
  texto: 'Tu opinión',
  textoPlaceholder: 'Cómo es el ajuste, el material, la caída del ala…',
  contador: (n, max) => `${n} de ${max}`,
  publicar: 'Publicar reseña',
  guardar: 'Guardar cambios',
  guardando: 'Guardando…',
  borrar: 'Borrar mi reseña',
  borrando: 'Borrando…',
  invitacion: 'Entra a tu cuenta para dejar tu reseña.',
  entrar: 'Entrar',
  cargando: 'Cargando reseñas…',
  error: 'No pudimos cargar las reseñas.',
  reintentar: 'Reintentar',
}

// Copia LITERAL de los de backend/validation/rules.js: el mismo error dice lo
// mismo venga de donde venga. El cliente puede ser igual o más laxo que el
// servidor, nunca más estricto.
export const shopMessages = {
  required: 'Este campo es obligatorio',
  calificacion: 'Elige de 1 a 5 estrellas',
  resenaLarga: 'La reseña admite hasta 1000 caracteres',
}

export const REVIEW_MAX = 1000

// ─── Guardados ─────────────────────────────────────────────────────────────

export const savedCopy = {
  kicker: 'Tu colección',
  title: 'Guardados',
  intro: 'Los sombreros que marcaste para no perderlos de vista.',
  cuenta: (n) => (n === 1 ? '1 sombrero guardado' : `${n} sombreros guardados`),
  vista: 'Vista',
  vistaCatalogo: 'Catálogo',
  vistaLista: 'Lista',
  vacioTitulo: 'Aún no guardas ningún sombrero',
  vacioCuerpo: 'Toca el marcador de un sombrero para encontrarlo aquí.',
  verCatalogo: 'Ver el catálogo',
  quitar: 'Quitar de guardados',
  verDetalle: 'Ver detalles',
  invitacionKicker: 'Guardados',
  invitacionTitulo: 'Entra para ver tus guardados',
  invitacionCuerpo: 'Tus sombreros marcados se guardan en tu cuenta y te siguen a cualquier dispositivo.',
  cargando: 'Cargando…',
  errorTitulo: 'No pudimos cargar esto',
  reintentar: 'Reintentar',
}

// ─── Bolsa ─────────────────────────────────────────────────────────────────

export const cartCopy = {
  kicker: 'Tu compra',
  title: 'Bolsa',
  vacioTitulo: 'Tu bolsa está vacía',
  vacioCuerpo: 'Cuando añadas un sombrero lo verás aquí.',
  verCatalogo: 'Ver el catálogo',
  articulos: (n) => (n === 1 ? '1 artículo' : `${n} artículos`),
  precio: 'Precio',
  cantidad: 'Cantidad',
  subtotal: 'Subtotal',
  total: 'Total',
  quitar: 'Quitar',
  agotado: 'Agotado: no se incluye en el total.',
  resumen: 'Resumen',
  continuar: 'Seguir comprando',
  pagar: 'Continuar al pago',
  pagarNota: 'El pago todavía no está disponible en esta demo.',
  invitacionKicker: 'Bolsa',
  invitacionTitulo: 'Entra para ver tu bolsa',
  invitacionCuerpo: 'Tu bolsa se guarda en tu cuenta, así que sigue ahí en cualquier dispositivo.',
  cargando: 'Cargando…',
  errorTitulo: 'No pudimos cargar esto',
  reintentar: 'Reintentar',
}

// ─── Avisos (toasts) ───────────────────────────────────────────────────────

export const shopToasts = {
  entrarParaGuardar: {
    tone: 'success',
    title: 'Entra para guardar',
    body: 'Los guardados viven en tu cuenta.',
  },
  entrarParaBolsa: {
    tone: 'success',
    title: 'Entra para comprar',
    body: 'La bolsa vive en tu cuenta.',
  },
  anadido: (titulo, cantidad) => ({
    tone: 'success',
    title: 'Añadido a la bolsa',
    body: `${cantidad} × ${titulo}`,
  }),
  recortado: (titulo, cantidad) => ({
    tone: 'success',
    title: 'Añadimos lo que había',
    body: `Solo hay ${cantidad} de ${titulo} en total en tu bolsa.`,
  }),
  guardadoOk: (titulo) => ({ tone: 'success', title: 'Guardado', body: titulo }),
  quitadoOk: (titulo) => ({ tone: 'success', title: 'Quitado de guardados', body: titulo }),
  resenaOk: { tone: 'success', title: 'Gracias por tu reseña', body: 'Ya la puede ver todo el mundo.' },
  resenaBorrada: { tone: 'success', title: 'Reseña borrada' },
  error: (mensaje) => ({ tone: 'error', title: 'No se pudo', body: mensaje }),
}

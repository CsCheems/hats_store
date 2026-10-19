// Copy y estructura de la página de catálogo, con la misma regla que
// data/auth.js o data/admin.js: las cadenas viven aquí y el JSX las recorre.
//
// Los rótulos de las categorías y los grados de fieltro NO están en este
// archivo: llegan del servidor con su cuenta, en `facetas`, por la misma razón
// que los del panel — son datos del catálogo, no copy de la interfaz.

/**
 * El equivalente de services/endpoints.js para las rutas del sitio: ningún
 * componente escribe a mano una URL del catálogo.
 *
 * No vale `new URLSearchParams(objeto)`: un valor de array se aplanaría a 'a,b'
 * en una sola clave, y el catálogo lee sus listas con getAll(). De ahí el
 * recorrido con append.
 */
export function catalogPath(params = {}) {
  const query = new URLSearchParams()

  for (const [clave, valor] of Object.entries(params)) {
    for (const uno of Array.isArray(valor) ? valor : [valor]) {
      if (uno !== null && uno !== undefined && uno !== '') query.append(clave, String(uno))
    }
  }

  const cadena = query.toString()

  return cadena ? `/catalogo?${cadena}` : '/catalogo'
}

/**
 * Los grupos de casillas del panel lateral.
 *
 * `facet` es la clave dentro de `facetas` que manda el servidor y `param` la del
 * query string. Añadir un grupo es una línea aquí y el componente no cambia —
 * mismo trato que statCards o productColumns en data/admin.js.
 */
export const filterGroups = [
  { param: 'categoria', facet: 'categorias', title: 'Material' },
  { param: 'fieltro', facet: 'fieltros', title: 'X de fieltro' },
]
// Ya no hay grupos de género ni de marca: ningún sombrero lleva género y la
// tienda es de una sola marca. El servidor sigue mandando esas facetas y el
// filtrado en memoria las entiende, así que volver a ponerlas es añadir la
// línea aquí.

/**
 * El buscador, declarado como un campo más para poder pintarlo con `Field` en
 * vez de escribir por cuarta vez la receta de input sobre oscuro — que es
 * exactamente lo que obligó a extraer aquel componente.
 *
 * `half: true` evita el `sm:col-span-2` que Field pone a los campos de ancho
 * completo: aquí no hay retícula de dos columnas, hay una barra estrecha.
 */
export const campoBusqueda = {
  name: 'q',
  type: 'text',
  half: true,
  label: 'Buscar',
  placeholder: 'Nombre o modelo',
}

export const catalogCopy = {
  kicker: 'Catálogo',
  title: 'Todos los sombreros',
  intro: 'Todos los sombreros de Nicol Hats. Filtra por material, grado de fieltro y precio.',

  filtros: 'Filtros',
  filtrosCon: (n) => `Filtros (${n})`,
  cerrarFiltros: 'Cerrar filtros',
  precio: 'Precio',
  precioMin: 'Precio mínimo',
  precioMax: 'Precio máximo',
  disponibles: 'Solo disponibles',
  limpiar: 'Limpiar filtros',
  quitar: (etiqueta) => `Quitar ${etiqueta}`,

  cuenta: (n) => `${n} ${n === 1 ? 'sombrero' : 'sombreros'}`,
  deTotal: (n, total) => `${n} de ${total}`,
  verTodo: (label) => `Ver todo: ${label}`,
  verDetalles: 'Ver detalles',
  agotado: 'Agotado',
  moneda: 'MXN',

  paginacion: 'Paginación',
  paginaAnterior: 'Anterior',
  paginaSiguiente: 'Siguiente',
  irAPagina: (n) => `Ir a la página ${n}`,
  paginaActual: (n, total) => `Página ${n} de ${total}`,

  vacioTitulo: 'No encontramos sombreros con estos filtros',
  vacioCuerpo: 'Prueba con menos filtros o amplía el rango de precio.',
  cargando: 'Cargando el catálogo…',
  errorTitulo: 'No pudimos cargar el catálogo',
  reintentar: 'Reintentar',
}

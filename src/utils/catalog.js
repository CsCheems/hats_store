// Las funciones puras del catálogo: preparar los datos una vez, filtrarlos
// muchas y repartirlos en páginas. Sin React, sin red y sin estado, para que se
// puedan leer —y equivocar— por separado de la página.

/**
 * Nueve por página, que es el 3×3 exacto de la retícula ancha.
 *
 * A dos columnas la última fila queda con una sola tarjeta; es el precio
 * aceptado por el 3×3, y la alternativa —adelantar la tercera columna a `lg`—
 * choca con una decisión ya tomada: a 1024px tres tarjetas quedan estranguladas.
 */
export const PRODUCTOS_POR_PAGINA = 9

/**
 * Quita los acentos para poder comparar.
 *
 * En es-MX esto no es un detalle: nadie escribe «Cañón» en un buscador, se
 * escribe «canon», y una tienda que no encuentre sus propios sombreros por eso
 * está rota. La ñ se pierde por el camino (cañón → canon) y da igual: el objetivo
 * es que la búsqueda perdone, no que respete la ortografía.
 */
const plano = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

/**
 * Prepara la respuesta del servidor para que filtrar sea barato.
 *
 * Se hace UNA vez por petición y deja dos cosas: los mapas de rótulo de cada
 * faceta —que necesitan la tarjeta y las fichas de filtro activo para escribir
 * «Botas» donde la URL dice «botas»— y una cadena de búsqueda ya normalizada por
 * artículo, para no normalizar treinta y cinco títulos en cada tecla.
 */
export function indexar(data) {
  const mapa = (lista) => new Map(lista.map((entrada) => [entrada.id, entrada.label]))

  const rotulos = {
    categoria: mapa(data.facetas.categorias),
    genero: mapa(data.facetas.generos),
    marca: mapa(data.facetas.marcas),
    fieltro: mapa(data.facetas.fieltros),
  }

  const items = data.items.map((producto) => ({
    ...producto,
    // El taller entra en la búsqueda: quien escribe «broncoware» está buscando
    // por marca aunque no toque la casilla.
    busqueda: plano(
      [
        producto.titulo,
        producto.descripcion,
        rotulos.categoria.get(producto.categoria) ?? '',
        rotulos.marca.get(producto.marca) ?? '',
      ].join(' '),
    ),
  }))

  return { items, facetas: data.facetas, rotulos, total: data.total }
}

/**
 * Aplica los filtros de la URL sobre el catálogo ya indexado.
 *
 * Un Set vacío no filtra nada —«ninguna casilla marcada» significa «todas», no
 * «ninguna»—, que es lo que hace que /catalogo a secas enseñe la tienda entera.
 *
 * Los topes del precio se acotan contra los reales: si la URL trae un ?min= por
 * encima del artículo más caro, el resultado es una retícula vacía con su ficha
 * a la vista, no un fallo ni una lista que finge estar completa.
 */
export function filtrarProductos(items, filtros, precio) {
  const min = filtros.min ?? precio.min
  const max = filtros.max ?? precio.max
  const texto = plano(filtros.q.trim())

  const enSet = (conjunto, valor) => conjunto.size === 0 || conjunto.has(valor)

  return items.filter(
    (producto) =>
      enSet(filtros.categoria, producto.categoria) &&
      enSet(filtros.genero, producto.genero) &&
      enSet(filtros.marca, producto.marca) &&
      enSet(filtros.fieltro, producto.fieltro) &&
      producto.precio >= min &&
      producto.precio <= max &&
      (!filtros.disponibles || producto.disponible) &&
      (texto === '' || producto.busqueda.includes(texto)),
  )
}

/**
 * Corta la página pedida de una lista ya filtrada.
 *
 * ACOTA LA PÁGINA CONTRA LAS QUE DE VERDAD HAY, y ese es todo su interés: la URL
 * puede pedir ?pagina=99 —un enlace viejo, un filtro que encogió la lista— y eso
 * tiene que enseñar la última página, no una retícula vacía bajo una barra que
 * dice «35 piezas». Devuelve la página que aplicó, para que quien pinte los
 * números diga la verdad.
 *
 * No reescribe la URL a propósito: corregir la dirección durante el render es
 * una navegación que nadie pidió, y encima dejaría un paso extra en el historial
 * que el botón atrás no sabe deshacer.
 *
 * Una lista vacía son cero resultados en una página de una, no cero páginas: así
 * quien divide nunca recibe un total de 0 con el que hacer aritmética.
 */
export function paginar(items, pagina, porPagina = PRODUCTOS_POR_PAGINA) {
  const total = Math.max(1, Math.ceil(items.length / porPagina))
  const actual = Math.min(Math.max(pagina, 1), total)
  const desde = (actual - 1) * porPagina

  return { pagina: actual, total, items: items.slice(desde, desde + porPagina) }
}

/**
 * Los números a pintar, con sus huecos: [1, '…', 5, 6, 7, '…', 12].
 *
 * Con pocas páginas salen todas —el hueco solo aparece cuando hay algo que
 * esconder—, y los extremos siempre están, que es lo que permite saltar al final
 * de un catálogo de cien piezas sin pasar por en medio.
 *
 * El Set resuelve solo los solapes de los bordes (en la página 2, el vecino
 * izquierdo ES el 1), que es donde estas ventanas suelen duplicar un número.
 */
export function ventanaPaginas(actual, total, vecinos = 1) {
  const numeros = new Set([1, total])

  for (let n = actual - vecinos; n <= actual + vecinos; n += 1) {
    if (n >= 1 && n <= total) numeros.add(n)
  }

  const salida = []

  for (const n of [...numeros].sort((a, b) => a - b)) {
    const anterior = salida.at(-1)

    // El hueco solo se pone si esconde MÁS DE UN número. Un '…' entre el 2 y el
    // 4 ocupa lo mismo que el 3 que estaría tapando, así que en ese caso se
    // pinta el número: con cuatro páginas salen las cuatro, que es el catálogo
    // de hoy, y los puntos aparecen cuando de verdad hay algo que esconder.
    if (typeof anterior === 'number') {
      if (n - anterior === 2) salida.push(anterior + 1)
      else if (n - anterior > 2) salida.push('…')
    }

    salida.push(n)
  }

  return salida
}

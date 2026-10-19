import { ChevronLeft, ChevronRight } from 'lucide-react'
import { catalogCopy } from '../../data/catalog'
import { formatInteger } from '../../utils/format'
import { ventanaPaginas } from '../../utils/catalog'

// La receta en un const de módulo y el className solo para el hueco, el mismo
// modismo que FICHA en CatalogToolbar. Cuadrado, de línea fina y sin radio,
// como todo lo demás.
const BOTON =
  'inline-flex h-[46px] min-w-[46px] cursor-pointer items-center justify-center gap-[6px] border px-[12px] text-[15px] font-semibold tracking-wide uppercase transition-colors'

const TONOS = {
  // Reposo: papel con tinta, y se invierte al pasar por encima.
  idle: 'border-paper text-paper hover:border-gold hover:text-gold',
  // La página en la que estás. Macizo y no solo con el borde marcado: en una
  // fila de siete números iguales, un borde no basta para encontrarte.
  actual: 'cursor-default border-paper bg-paper text-ink',
  // Extremo alcanzado. No se esconde el botón —la fila cambiaría de ancho al
  // pasar de página y los números bailarían bajo el dedo—, se apaga.
  off: 'cursor-not-allowed border-rail bg-transparent text-sand/60',
}

/**
 * Los números de página, bajo la retícula.
 *
 * La ventana con elipsis vive en utils/catalog.js: qué números se pintan es
 * aritmética, no dibujo, y allí se puede leer sin React de por medio.
 *
 * Con una sola página no se pinta nada. Un «1 de 1» solitario no informa de
 * nada y ocupa el sitio de la respuesta.
 */
export function CatalogPagination({ pagina, total, onIr }) {
  if (total <= 1) return null

  const anterior = pagina - 1
  const siguiente = pagina + 1

  return (
    <nav
      aria-label={catalogCopy.paginacion}
      className="mt-[clamp(36px,4vw,56px)] flex flex-wrap items-center justify-center gap-[10px]"
    >
      <button
        type="button"
        disabled={pagina === 1}
        aria-label={catalogCopy.paginaAnterior}
        onClick={() => onIr(anterior)}
        className={`${BOTON} ${pagina === 1 ? TONOS.off : TONOS.idle}`}
      >
        <ChevronLeft size={16} strokeWidth={1.8} />
        <span className="hidden sm:inline">{catalogCopy.paginaAnterior}</span>
      </button>

      {ventanaPaginas(pagina, total).map((entrada, i) =>
        typeof entrada === 'number' ? (
          <button
            key={entrada}
            type="button"
            // `aria-current` y no un aria-label distinto: quien navega por voz
            // pide «página 4», y esto dice cuál es sin renombrarlas todas.
            aria-current={entrada === pagina ? 'page' : undefined}
            aria-label={catalogCopy.irAPagina(entrada)}
            onClick={() => entrada !== pagina && onIr(entrada)}
            className={`${BOTON} tabular-nums ${entrada === pagina ? TONOS.actual : TONOS.idle}`}
          >
            {formatInteger(entrada)}
          </button>
        ) : (
          // El hueco no es un botón ni se anuncia: el lector de pantalla ya sabe
          // dónde está por el aria-current.
          <span key={`hueco-${i}`} aria-hidden="true" className="px-[2px] text-[16px] text-sand">
            {'…'}
          </span>
        ),
      )}

      <button
        type="button"
        disabled={pagina === total}
        aria-label={catalogCopy.paginaSiguiente}
        onClick={() => onIr(siguiente)}
        className={`${BOTON} ${pagina === total ? TONOS.off : TONOS.idle}`}
      >
        <span className="hidden sm:inline">{catalogCopy.paginaSiguiente}</span>
        <ChevronRight size={16} strokeWidth={1.8} />
      </button>

      {/* Los números dicen dónde estás mirándolos; esto lo dice en palabras, que
          es lo que necesita quien no los ve. `aria-live` no hace falta: al pulsar
          se mueve el foco y la retícula entera cambia. */}
      <p className="mt-[10px] w-full text-center text-[15px] text-sand tabular-nums">
        {catalogCopy.paginaActual(pagina, total)}
      </p>
    </nav>
  )
}

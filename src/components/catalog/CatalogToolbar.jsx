import { SlidersHorizontal, X } from 'lucide-react'
import { catalogCopy } from '../../data/catalog'
import { formatMoney } from '../../utils/format'

const FICHA =
  'inline-flex cursor-pointer items-center gap-[7px] border border-edge px-[10px] py-[4px] text-[13px] font-semibold tracking-[.14em] text-paper uppercase transition-colors hover:bg-paper hover:text-ink'

/**
 * La barra sobre la retícula: cuántos sombreros quedan, qué filtros están puestos
 * y cómo quitarlos.
 *
 * Los rótulos de las fichas se resuelven aquí y no en el hook: los mapas vienen
 * de las facetas que trajo el servidor, y useCatalogFilters no sabe de
 * peticiones. La URL dice «palma» y la ficha tiene que decir «Palma».
 *
 * La cuenta lleva aria-live: al filtrar no se mueve el foco ni cambia la ruta, y
 * sin anunciarla la página cambiaría entera en silencio.
 */
export function CatalogToolbar({
  count,
  total,
  activos,
  rotulos,
  precio,
  filtros,
  acciones,
  filtrosAbiertos,
  onToggleFiltros,
}) {
  const rotulo = (ficha) => {
    if (ficha.tipo === 'lista') return rotulos[ficha.param].get(ficha.valor) ?? ficha.valor
    if (ficha.tipo === 'texto') return `«${ficha.valor}»`
    if (ficha.tipo === 'bool') return catalogCopy.disponibles

    return `${formatMoney(filtros.min ?? precio.min)} — ${formatMoney(filtros.max ?? precio.max)}`
  }

  const quitar = (ficha) => {
    if (ficha.tipo === 'lista') return acciones.quitar(ficha.param, ficha.valor)
    if (ficha.tipo === 'texto') return acciones.buscar('')
    if (ficha.tipo === 'bool') return acciones.disponibilidad(false)

    return acciones.precio(null, null)
  }

  return (
    <div className="mb-[40px] border-b border-paper pb-[20px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p aria-live="polite" className="text-[15px] text-sand">
          {activos.length > 0 ? catalogCopy.deTotal(count, total) : catalogCopy.cuenta(count)}
        </p>

        {/* El panel de filtros se despliega en flujo y no en un cajón: un cajón necesitaría
            portal, trampa de foco, bloqueo de scroll y Escape —toda la maquinaria
            del modal— para no ganar nada aquí. */}
        <button
          type="button"
          aria-expanded={filtrosAbiertos}
          onClick={onToggleFiltros}
          className="inline-flex cursor-pointer items-center gap-[8px] border border-edge px-[14px] py-[9px] text-[13px] font-semibold tracking-[.14em] text-paper uppercase transition-colors hover:bg-paper hover:text-ink lg:hidden"
        >
          <SlidersHorizontal size={15} strokeWidth={1.8} />
          {filtrosAbiertos
            ? catalogCopy.cerrarFiltros
            : activos.length > 0
              ? catalogCopy.filtrosCon(activos.length)
              : catalogCopy.filtros}
        </button>
      </div>

      {activos.length > 0 && (
        <div className="mt-[14px] flex flex-wrap items-center gap-[8px]">
          {activos.map((ficha) => {
            const etiqueta = rotulo(ficha)

            return (
              <button
                key={`${ficha.param}-${ficha.valor ?? ficha.tipo}`}
                type="button"
                aria-label={catalogCopy.quitar(etiqueta)}
                onClick={() => quitar(ficha)}
                className={FICHA}
              >
                {etiqueta}
                <X size={13} strokeWidth={1.8} />
              </button>
            )
          })}

          <button
            type="button"
            onClick={acciones.limpiar}
            className="ml-[4px] cursor-pointer border-b border-transparent text-[13px] font-semibold tracking-[.14em] text-sand uppercase transition-colors hover:border-paper hover:text-paper"
          >
            {catalogCopy.limpiar}
          </button>
        </div>
      )}
    </div>
  )
}

import { catalogCopy } from '../../data/catalog'
import { Button } from '../ui/Button'
import { Frame } from '../ui/Frame'
import { CatalogCard } from './CatalogCard'

/**
 * La retícula de resultados y, cuando no hay ninguno, la salida.
 *
 * Tres columnas en `xl` y no en `lg`: a 1024px la columna de contenido son unos
 * 700px una vez descontada la columna de filtros, y tres tarjetas ahí quedan
 * estranguladas.
 *
 * Las fotos llevan sombra de 1px: nada de esta página lleva
 * `overflow-hidden`, y no hace falta, porque nada sobresale.
 *
 * `content-start` mantiene la tarjeta a su altura natural: si esta retícula
 * acaba siendo ítem de otra que la estire, `align-content: normal` se comporta
 * como `stretch` y reparte todo el hueco sobrante entre las filas `auto`. Hoy el
 * envoltorio ya la deja en `height: auto`, así que la clase es un seguro: lo que
 * compra es que el componente no dependa de dónde lo monten.
 */
export function CatalogGrid({ items, rotulos, onLimpiar }) {
  if (items.length === 0) {
    return (
      <Frame weight="strong" className="grid min-h-[280px] place-items-center px-6">
        <div className="max-w-[400px] text-center">
          <p className="font-display text-[26px] leading-[1.15] font-semibold text-paper">
            {catalogCopy.vacioTitulo}
          </p>
          <p className="mt-[8px] text-[17px] leading-[1.4] text-sand">{catalogCopy.vacioCuerpo}</p>

          <Button variant="quiet" onClick={onLimpiar} className="mt-[18px] px-[22px] py-[10px]">
            {catalogCopy.limpiar}
          </Button>
        </div>
      </Frame>
    )
  }

  return (
    <div className="grid grid-cols-1 content-start gap-[clamp(28px,3vw,44px)] sm:grid-cols-2 xl:grid-cols-3">
      {items.map((product) => (
        <CatalogCard
          key={product.id}
          product={product}
          categoria={rotulos.categoria.get(product.categoria) ?? product.categoria}
        />
      ))}
    </div>
  )
}

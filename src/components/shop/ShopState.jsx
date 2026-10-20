import { TriangleAlert } from 'lucide-react'
import { Button } from '../ui/Button'
import { Frame } from '../ui/Frame'

/**
 * Los dos estados que no son «hay contenido» en las páginas de cuenta (Guardados,
 * bolsa): pidiendo y no se pudo. Hermano de CatalogState, con el copy como
 * propiedades porque lo comparten dos páginas con textos distintos.
 *
 * Sin rueda giratoria, como el resto del sitio. El mensaje del error sale tal
 * cual del ApiError.
 */
export function ShopState({ status, error, copy, onRetry }) {
  if (status === 'loading') {
    return (
      <Frame weight="strong" className="grid min-h-[280px] place-items-center">
        <p className="text-[13px] font-semibold tracking-label text-sand uppercase">{copy.cargando}</p>
      </Frame>
    )
  }

  return (
    <Frame weight="strong" className="grid min-h-[280px] place-items-center px-6">
      <div className="max-w-[380px] text-center">
        <TriangleAlert size={22} strokeWidth={1.5} className="mx-auto text-rust" />

        <p className="mt-[14px] font-display text-[24px] leading-[1.15] font-semibold text-paper">
          {copy.errorTitulo}
        </p>
        <p className="mt-[8px] text-[17px] leading-[1.4] text-sand">{error?.message}</p>

        <Button variant="quiet" onClick={onRetry} className="mt-[18px] px-[22px] py-[10px]">
          {copy.reintentar}
        </Button>
      </div>
    </Frame>
  )
}

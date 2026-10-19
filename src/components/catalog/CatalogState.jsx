import { TriangleAlert } from 'lucide-react'
import { catalogCopy } from '../../data/catalog'
import { Button } from '../ui/Button'
import { Frame } from '../ui/Frame'

/**
 * Los dos estados que no son «hay resultados»: pidiendo y no se pudo.
 *
 * Es el equivalente de tienda de admin/AdminState, escrito aparte porque nada de
 * components/admin cruza a este lado —ni al revés—.
 *
 * SIN RUEDA GIRATORIA mientras carga. El proyecto no tiene ninguna animación de
 * giro y esta no va a ser la primera: la jerarquía se dibuja con reglas.
 *
 * EL VACÍO NO ESTÁ AQUÍ, y no es un olvido. «No encontramos sombreros con estos
 * filtros» es consecuencia de lo que hizo quien mira, no un fallo, y pide su
 * propia salida —limpiar los filtros—. Vive en CatalogGrid, junto a lo que
 * cuenta los resultados.
 *
 * El mensaje del error sale tal cual del ApiError: http.js ya lo deja escrito
 * para leerse, así que la red caída y un 500 no necesitan casos distintos.
 */
export function CatalogState({ status, error, onRetry }) {
  if (status === 'loading') {
    return (
      <Frame weight="strong" className="grid min-h-[280px] place-items-center">
        <p className="text-[13px] font-semibold tracking-label text-sand uppercase">
          {catalogCopy.cargando}
        </p>
      </Frame>
    )
  }

  return (
    <Frame weight="strong" className="grid min-h-[280px] place-items-center px-6">
      <div className="max-w-[380px] text-center">
        <TriangleAlert size={22} strokeWidth={1.5} className="mx-auto text-rust" />

        <p className="mt-[14px] font-display text-[24px] leading-[1.15] font-semibold text-paper">
          {catalogCopy.errorTitulo}
        </p>
        <p className="mt-[8px] text-[17px] leading-[1.4] text-sand">{error?.message}</p>

        <Button variant="quiet" onClick={onRetry} className="mt-[18px] px-[22px] py-[10px]">
          {catalogCopy.reintentar}
        </Button>
      </div>
    </Frame>
  )
}

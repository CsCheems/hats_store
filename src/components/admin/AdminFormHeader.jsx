import { ArrowLeft } from 'lucide-react'
import { AdminButton } from './AdminButton'

/**
 * La cabecera de un formulario del panel: volver a su lista, el título y una
 * línea debajo —el SKU de un artículo, si una marca ya sale en la tienda—.
 *
 * La línea reserva su alto aunque venga vacía, así el título no salta cuando
 * llegan los datos.
 */
export function AdminFormHeader({ volver, titulo, children }) {
  return (
    <header className="mb-[18px]">
      <AdminButton size="sm" to={volver.to} className="mb-3">
        <ArrowLeft size={14} strokeWidth={1.5} />
        {volver.label}
      </AdminButton>
      <h1 className="text-[22px] leading-none text-admin-ink">{titulo}</h1>
      <div className="mt-[8px] flex min-h-[20px] flex-wrap items-center gap-2 text-[13px] text-admin-muted">
        {children}
      </div>
    </header>
  )
}

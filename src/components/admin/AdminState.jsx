import { RotateCw, TriangleAlert } from 'lucide-react'
import { adminStates } from '../../data/admin'
import { AdminCard } from './AdminCard'

/**
 * Lo que se pinta mientras no hay datos. Cada vista lo usa como salida temprana:
 *
 *   if (status !== 'ready') return <AdminState status={status} … />
 *
 * El mensaje del error sale del ApiError que normaliza http.js, así que aquí
 * vale para todos por igual: un 403 dice «tu cuenta no tiene acceso a esta
 * zona», la red caída dice «no hay conexión con el servidor», y ninguno de los
 * dos necesita un caso propio. Enseñarlo es además la única forma de que un 403
 * en una tarjeta se distinga de un servidor apagado, que es justo lo que hay que
 * poder distinguir cuando algo va mal.
 *
 * Sin ruedas girando: el proyecto no tiene ninguna y esta no va a ser la primera.
 *
 * El vacío NO está aquí. «No hay artículos en esta categoría» y «no se está
 * acabando nada» son frases distintas que además significan cosas contrarias
 * —una es un problema y la otra una buena noticia—, así que las escribe cada
 * vista.
 */
export function AdminState({ status, error, onRetry }) {
  if (status === 'loading') {
    return (
      <AdminCard className="grid min-h-[140px] place-items-center p-6">
        <p className="text-[13px] text-admin-muted">{adminStates.loading}</p>
      </AdminCard>
    )
  }

  return (
    <AdminCard className="p-6">
      <div className="flex items-start gap-3">
        <TriangleAlert size={18} strokeWidth={1.5} className="mt-px shrink-0 text-admin-warn" />

        <div className="min-w-0">
          <p className="text-[14px] text-admin-ink">{adminStates.errorTitulo}</p>
          <p className="mt-1 text-[13px] leading-[1.5] text-admin-muted">{error?.message}</p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-admin border border-admin-line bg-admin-card px-3 py-[7px] text-[12px] text-admin-ink transition-colors hover:border-admin-blue hover:text-admin-blue"
          >
            <RotateCw size={14} strokeWidth={1.5} />
            {adminStates.reintentar}
          </button>
        </div>
      </div>
    </AdminCard>
  )
}

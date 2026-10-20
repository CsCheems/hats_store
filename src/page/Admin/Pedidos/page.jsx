import { useSearchParams } from 'react-router-dom'
import { AdminButton } from '../../../components/admin/AdminButton'
import { AdminState } from '../../../components/admin/AdminState'
import { AdminTable } from '../../../components/admin/AdminTable'
import { adminCopy, orderFilters, pedidoColumns } from '../../../data/admin'
import { useApiResource } from '../../../hooks/useApiResource'
import { getOrders } from '../../../services/admin'

/**
 * Los pedidos de la tienda: /admin/pedidos. Los pagados, del más reciente al más
 * antiguo, con un filtro por estado.
 *
 * Se piden todos de una vez y el filtro es en memoria, como el catálogo de la
 * tienda: cambiar de pestaña no sale a la red y los conteos de cada pestaña son
 * los de todos los pedidos, no los de lo que ya está filtrado. El filtro vive en
 * la dirección (`?estado=enviado`) para que se pueda compartir, sobreviva a
 * recargar y el botón atrás lo deshaga.
 *
 * `getOrders` se pasa a pelo: es una función de módulo, la referencia estable que
 * useApiResource necesita.
 */
export default function AdminPedidos() {
  const { data, status, error, reload } = useApiResource(getOrders)
  const [params, setParams] = useSearchParams()

  const pedido = params.get('estado')
  const filtro = orderFilters.some((opcion) => opcion.key === pedido) ? pedido : 'todos'

  const elegir = (key) => {
    const siguiente = new URLSearchParams(params)
    if (key === 'todos') siguiente.delete('estado')
    else siguiente.set('estado', key)
    setParams(siguiente, { replace: true })
  }

  const cuenta = (key) => (key === 'todos' ? data.length : data.filter((fila) => fila.estado === key).length)
  const filas = status === 'ready' && filtro !== 'todos' ? data.filter((fila) => fila.estado === filtro) : data

  return (
    <>
      <header className="mb-[18px]">
        <h1 className="text-[22px] leading-none text-admin-ink">{adminCopy.pedidosListaTitulo}</h1>
        <p className="mt-[8px] text-[13px] leading-[1.5] text-admin-muted">{adminCopy.pedidosListaIntro}</p>
      </header>

      {status !== 'ready' ? (
        <AdminState status={status} error={error} onRetry={reload} />
      ) : (
        <>
          <div role="group" aria-label={adminCopy.pedidosFiltros} className="mb-[14px] flex flex-wrap gap-2">
            {orderFilters.map((opcion) => {
              const activo = filtro === opcion.key

              return (
                <button
                  key={opcion.key}
                  type="button"
                  aria-pressed={activo}
                  onClick={() => elegir(opcion.key)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-admin border px-3 py-[6px] text-[13px] transition-colors focus-visible:outline-admin-blue ${
                    activo
                      ? 'border-admin-blue bg-admin-blue text-admin-bright'
                      : 'border-admin-line bg-admin-card text-admin-ink hover:border-admin-blue hover:text-admin-blue'
                  }`}
                >
                  {opcion.label}
                  <span className="text-[11px] tabular-nums opacity-75">{cuenta(opcion.key)}</span>
                </button>
              )
            })}
          </div>

          <AdminTable
            columns={pedidoColumns}
            rows={filas}
            rowKey="folio"
            empty={
              filtro === 'todos'
                ? adminCopy.pedidosListaVacio
                : adminCopy.pedidosFiltroVacio(orderFilters.find((opcion) => opcion.key === filtro).label)
            }
            renderActions={(fila) => (
              <AdminButton size="sm" to={`/admin/pedidos/${fila.folio}`} aria-label={`${adminCopy.ver} ${fila.folio}`}>
                {adminCopy.ver}
              </AdminButton>
            )}
          />
        </>
      )}
    </>
  )
}

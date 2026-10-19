import { AdminState } from '../../../components/admin/AdminState'
import { AdminTable } from '../../../components/admin/AdminTable'
import { LowStockList } from '../../../components/admin/LowStockList'
import { StatCard } from '../../../components/admin/StatCard'
import { adminCopy, pedidoColumns, statCards } from '../../../data/admin'
import { useApiResource } from '../../../hooks/useApiResource'
import { getSummary } from '../../../services/admin'

/**
 * La portada del panel: las cuatro cifras, los últimos pedidos y lo que se está
 * acabando.
 *
 * Todo llega en UNA sola petición. Podrían ser tres —cifras, pedidos, stock— y
 * serían tres estados de carga desincronizados dibujándose uno detrás de otro;
 * un resumen que aparece a trozos no es un resumen. Y las tres partes salen de
 * los mismos dos mocks, así que separarlas tampoco ahorraría trabajo al
 * servidor.
 *
 * `getSummary` se pasa a pelo: es una función de módulo, y por tanto la
 * referencia estable que useApiResource necesita.
 */
export default function AdminResumen() {
  const { data, status, error, reload } = useApiResource(getSummary)

  return (
    <>
      <header className="mb-[18px]">
        <h1 className="text-[22px] leading-none text-admin-ink">{adminCopy.resumenTitulo}</h1>
        {/* El alto de la línea se reserva aunque el periodo no se sepa todavía:
            si no, el resumen entero da un salto hacia abajo al llegar. */}
        <p className="mt-[6px] min-h-[18px] text-[13px] text-admin-muted">
          {status === 'ready' ? data.periodo : null}
        </p>
      </header>

      {status !== 'ready' ? (
        <AdminState status={status} error={error} onRetry={reload} />
      ) : (
        <div className="flex flex-col gap-[18px]">
          <div className="grid gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <StatCard key={card.key} card={card} metrica={data.metricas[card.key]} />
            ))}
          </div>

          {/* Los pedidos llevan la columna ancha porque tienen seis campos; el
              stock se lee con dos. `minmax(0,…)` en las dos: sin él, una celda
              larga puede empujar la columna por encima de su fracción, que es
              como una tabla acaba desbordando en horizontal. */}
          <div className="grid gap-[18px] xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <section className="min-w-0">
              <h2 className="mb-[10px] text-[14px] text-admin-ink">{adminCopy.pedidosTitulo}</h2>
              <AdminTable
                columns={pedidoColumns}
                rows={data.pedidosRecientes}
                rowKey="folio"
                empty={adminCopy.pedidosVacio}
              />
            </section>

            <LowStockList limite={data.stockBajo.limite} items={data.stockBajo.items} />
          </div>
        </div>
      )}
    </>
  )
}

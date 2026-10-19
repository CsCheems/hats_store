import { adminCopy } from '../../data/admin'
import { formatDate, formatInteger, formatMoney } from '../../utils/format'
import { AdminBadge } from './AdminBadge'
import { AdminCard } from './AdminCard'

// Clases por tipo de celda. Las cifras van en tabular-nums para que se comparen
// en columna, que es lo único que hace a una tabla mejor que una lista.
const CELDAS = {
  codigo: 'text-[12px] text-admin-muted tabular-nums whitespace-nowrap',
  texto: 'text-admin-ink',
  moneda: 'tabular-nums whitespace-nowrap',
  entero: 'tabular-nums',
  stock: 'tabular-nums',
  estado: 'whitespace-nowrap',
  portada: 'text-admin-muted whitespace-nowrap',
  fecha: 'text-admin-muted whitespace-nowrap',
  imagen: 'py-[6px]',
  booleano: 'text-admin-muted whitespace-nowrap',
  lista: 'text-admin-muted',
}

/**
 * El contenido de una celda según el `tipo` que declara su columna.
 *
 * El stock en cero se pinta en ámbar; por debajo de ningún otro número. El
 * umbral de «se está acabando» lo fija el servidor (LIMITE_STOCK en
 * admin.service.js) y lo enseña el resumen con su propio panel — copiarlo aquí
 * crearía un segundo umbral que se desincroniza el día que cambie el primero.
 * Cero no es un umbral, es un hecho.
 */
function contenido(fila, columna) {
  const valor = fila[columna.key]

  switch (columna.tipo) {
    case 'moneda':
      return formatMoney(valor)
    case 'entero':
      return formatInteger(valor)
    case 'fecha':
      return formatDate(valor)
    case 'estado':
      return <AdminBadge estado={valor} />
    case 'portada':
    case 'booleano':
      return valor ? adminCopy.si : '—'
    // Los rótulos de un array de `{ id, label }`: las categorías de una marca,
    // las marcas de una categoría.
    case 'lista':
      return valor.length ? valor.map((entrada) => entrada.label).join(', ') : '—'
    // Miniatura 4:5 como la tarjeta del catálogo. Sin foto, una caja vacía del
    // mismo tamaño con su texto para lectores de pantalla: la columna no se
    // encoge y la ausencia se nota de un vistazo.
    case 'imagen':
      return valor ? (
        <img
          src={valor}
          alt=""
          loading="lazy"
          className="h-[40px] w-[32px] rounded-admin border border-admin-line bg-admin-canvas object-cover"
        />
      ) : (
        <span className="grid h-[40px] w-[32px] place-items-center rounded-admin border border-dashed border-admin-line text-admin-muted">
          <span className="sr-only">{adminCopy.sinFoto}</span>
          <span aria-hidden="true">—</span>
        </span>
      )
    case 'stock':
      return (
        <span className={valor === 0 ? 'text-admin-warn' : undefined}>{formatInteger(valor)}</span>
      )
    default:
      return valor
  }
}

/**
 * La tabla del panel, la misma para el inventario, los pedidos, las marcas y las
 * categorías: todas se declaran como columnas en data/admin.js y de ahí salen
 * el rótulo, el formato y la alineación. Tablas casi iguales acaban divergiendo
 * en el relleno de una celda, y luego nadie sabe cuál era la buena.
 *
 * `renderActions(fila)`, opcional, añade una última columna con lo que se puede
 * hacer con cada fila —editar, archivar, restaurar—. La tabla no sabe qué
 * acciones hay ni qué hacen: las pinta quien la usa, que es quien tiene los
 * datos y las peticiones. Los pedidos del resumen no la pasan y siguen siendo de
 * solo lectura.
 *
 * Una tabla ancha no cabe en un teléfono y no se intenta que quepa: se desplaza
 * dentro de su propia tarjeta —de ahí el overflow-x-auto—, que es lo que impide
 * que arrastre a la página entera en horizontal. Reventar las filas en tarjetas
 * apiladas pierde justo lo que se venía a hacer, que es comparar una columna.
 */
export function AdminTable({ columns, rows, rowKey, empty, renderActions }) {
  if (rows.length === 0) {
    return (
      <AdminCard className="grid min-h-[120px] place-items-center p-6">
        <p className="text-center text-[13px] text-admin-muted">{empty}</p>
      </AdminCard>
    )
  }

  return (
    <AdminCard className="overflow-hidden">
      {/* `relative` no es de adorno: los textos para lector de pantalla
          («Acciones», «Sin foto») son `sr-only`, que es `position: absolute`, y
          sin un ancestro posicionado aquí dentro se escapan del desplazamiento
          y ensanchan la página entera en un teléfono. */}
      <div className="relative overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-admin-line bg-admin-canvas">
              {columns.map((columna) => (
                <th
                  key={columna.key}
                  scope="col"
                  className={`px-4 py-[10px] text-[11px] font-normal tracking-wide text-admin-muted uppercase whitespace-nowrap ${columna.align === 'right' ? 'text-right' : ''}`}
                >
                  {columna.label}
                </th>
              ))}
              {renderActions && (
                <th scope="col" className="px-4 py-[10px] text-right">
                  <span className="sr-only">{adminCopy.acciones}</span>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {rows.map((fila) => (
              <tr
                key={fila[rowKey]}
                className="border-t border-admin-line transition-colors first:border-t-0 hover:bg-admin-canvas/70"
              >
                {columns.map((columna) => (
                  <td
                    key={columna.key}
                    className={`px-4 py-[11px] ${CELDAS[columna.tipo] ?? ''} ${columna.align === 'right' ? 'text-right' : ''}`}
                  >
                    {contenido(fila, columna)}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-4 py-[8px] text-right whitespace-nowrap">
                    <div className="inline-flex gap-[6px]">{renderActions(fila)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminCard>
  )
}

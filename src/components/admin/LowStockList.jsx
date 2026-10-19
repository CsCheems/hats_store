import { adminCopy } from '../../data/admin'
import { AdminCard } from './AdminCard'

/**
 * Lo que se está acabando. Lista y no tabla: va en la columna estrecha del
 * resumen, y ahí una tabla de siete columnas se desplazaría en horizontal para
 * enseñar dos datos.
 *
 * El umbral lo manda el servidor y se enseña en el pie —«5 piezas o menos»— en
 * vez de darlo por sabido: sin ese número, una lista de diez artículos no dice
 * si la tienda va justa o si el umbral está mal puesto.
 *
 * El cero va en ámbar y con su rótulo. Es la única fila que exige hacer algo
 * hoy, y tiene que distinguirse de un dos.
 */
export function LowStockList({ limite, items }) {
  return (
    <AdminCard className="overflow-hidden">
      <div className="border-b border-admin-line px-[18px] py-[14px]">
        <h2 className="text-[14px] text-admin-ink">{adminCopy.stockTitulo}</h2>
        <p className="mt-1 text-[12px] text-admin-muted">{adminCopy.stockIntro(limite)}</p>
      </div>

      {items.length === 0 ? (
        <p className="px-[18px] py-8 text-center text-[13px] text-admin-muted">
          {adminCopy.stockVacio}
        </p>
      ) : (
        <ul>
          {items.map((producto) => (
            <li
              key={producto.id}
              className="flex items-center justify-between gap-4 border-t border-admin-line px-[18px] py-[11px] first:border-t-0"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] text-admin-ink">{producto.titulo}</p>
                <p className="mt-[2px] text-[11px] text-admin-muted tabular-nums">{producto.sku}</p>
              </div>

              <span
                className={`shrink-0 text-[13px] whitespace-nowrap tabular-nums ${producto.stock === 0 ? 'text-admin-warn' : 'text-admin-muted'}`}
              >
                {/* El número va crudo y no por formatInteger: aquí nunca pasa
                    de dos cifras —es lo que se está acabando— y el formateador
                    devuelve una cadena, con la que el singular de `stockPiezas`
                    no podría compararse. */}
                {adminCopy.stockPiezas(producto.stock)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </AdminCard>
  )
}

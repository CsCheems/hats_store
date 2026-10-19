import { ArrowDownRight, ArrowUpRight, Banknote, Package, Receipt, TrendingUp } from 'lucide-react'
import { adminCopy } from '../../data/admin'
import { FORMATOS, formatPercent } from '../../utils/format'
import { AdminCard } from './AdminCard'

// Los datos guardan una clave y el componente resuelve el icono, igual que en
// AccountMenu, PromiseRow y LegalBar.
const ICONS = { products: Package, orders: Receipt, sales: TrendingUp, income: Banknote }

/**
 * Una cifra del resumen.
 *
 * `card` viene de `statCards` en data/admin.js —rótulo, icono y qué formato
 * darle— y `metrica` es lo que manda el servidor: `{ valor, variacion }`.
 *
 * La variación se pinta con FLECHA ADEMÁS DE COLOR. Es lo mismo de siempre: si
 * la única señal de que algo bajó fuera que está en ámbar, quien no distinga ese
 * ámbar del verde leería exactamente lo contrario de lo que pasó.
 *
 * `variacion: null` es un caso de verdad y no un cero: el catálogo es una foto de
 * hoy y no hay un «cuántos productos había el mes pasado». Esa tarjeta enseña su
 * pie de siempre en vez de un «+0%» inventado.
 */
export function StatCard({ card, metrica }) {
  const Icon = ICONS[card.icon]
  const formato = FORMATOS[card.formato]

  const { variacion } = metrica
  const subio = variacion > 0
  const Flecha = subio ? ArrowUpRight : ArrowDownRight

  return (
    <AdminCard className="p-[18px]">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] tracking-wide text-admin-muted uppercase">{card.label}</span>
        <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-admin bg-admin-sky text-admin-blue">
          <Icon size={16} strokeWidth={1.5} />
        </span>
      </div>

      {/* tabular-nums para que la coma de los miles caiga a la misma altura en
          las cuatro tarjetas. Sin eso, cuatro cifras en fila bailan. */}
      <p className="mt-[14px] text-[28px] leading-none font-medium text-admin-ink tabular-nums">
        {formato(metrica.valor)}
      </p>

      {variacion === null ? (
        <p className="mt-[10px] text-[12px] text-admin-muted">{card.hint}</p>
      ) : (
        <p className="mt-[10px] flex items-center gap-[5px] text-[12px] text-admin-muted">
          <span
            className={`inline-flex items-center gap-[2px] ${subio ? 'text-admin-good' : 'text-admin-warn'}`}
          >
            <Flecha size={13} strokeWidth={2} />
            {formatPercent(variacion)}
          </span>
          {adminCopy.variacionPie}
        </p>
      )}
    </AdminCard>
  )
}

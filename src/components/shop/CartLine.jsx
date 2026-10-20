import { Link } from 'react-router-dom'
import { cartCopy } from '../../data/shop'
import { formatMoney } from '../../utils/format'
import { QuantityStepper } from '../product/QuantityStepper'
import { ImageSlot } from '../ui/ImageSlot'

/**
 * Una línea de la bolsa: foto, nombre, cantidad, subtotal y «Quitar».
 *
 * El subtotal se calcula aquí, de precio × cantidad: no se guarda en ningún
 * sitio. Un artículo que dejó de estar disponible se enseña con su aviso y su
 * subtotal tachado, y no suma al total (lo dice el servidor al calcularlo).
 */
export function CartLine({ item, ocupada, onQuantity, onRemove }) {
  const subtotal = item.precio * item.cantidad

  return (
    <li className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-5 gap-y-3 border-b border-rail py-6 sm:grid-cols-[88px_minmax(0,1fr)_auto]">
      <Link to={`/producto/${item.id}`} className="block aspect-4/5 overflow-hidden" aria-label={item.titulo}>
        <ImageSlot src={item.foto} alt="" />
      </Link>

      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-[12px] tracking-label text-sand uppercase">{item.categoriaLabel}</span>
        <Link
          to={`/producto/${item.id}`}
          className="font-display text-[22px] leading-[1.2] font-semibold text-paper transition-colors hover:text-gold"
        >
          {item.titulo}
        </Link>
        <span className="text-[15px] text-sand">{formatMoney(item.precio)}</span>
        {!item.disponible && <span className="mt-1 text-[14px] text-rust">{cartCopy.agotado}</span>}
      </div>

      <div className="col-span-2 flex flex-wrap items-center justify-between gap-4 sm:col-span-1 sm:flex-col sm:items-end sm:justify-between">
        <QuantityStepper
          value={item.cantidad}
          max={Math.max(item.maximo, 1)}
          disabled={ocupada || !item.disponible}
          onChange={onQuantity}
        />

        <div className="flex items-center gap-5 sm:flex-col sm:items-end sm:gap-1">
          <span
            className={`font-display text-[22px] font-semibold ${item.disponible ? 'text-paper' : 'text-sand line-through'}`}
          >
            {formatMoney(subtotal)}
          </span>
          <button
            type="button"
            disabled={ocupada}
            onClick={onRemove}
            className="cursor-pointer text-[13px] font-semibold tracking-[.14em] text-sand uppercase underline-offset-4 transition-colors hover:text-gold hover:underline disabled:cursor-not-allowed"
          >
            {cartCopy.quitar}
          </button>
        </div>
      </div>
    </li>
  )
}

import { Link } from 'react-router-dom'
import { productCopy } from '../../data/shop'
import { formatMoney } from '../../utils/format'
import { BookmarkButton } from '../product/BookmarkButton'
import { ImageSlot } from '../ui/ImageSlot'

/**
 * La vista de lista de Guardados: una fila por sombrero, con foto pequeña, lo
 * esencial en texto y el marcador a la derecha para quitarlo. Es la misma
 * información que la tarjeta del catálogo, en horizontal y más densa: sirve para
 * comparar precios de un vistazo.
 *
 * Reglas finas entre filas y una de 2px arriba, como el resto del sitio.
 */
export function SavedList({ items }) {
  return (
    <ul className="flex flex-col border-t-2 border-rail">
      {items.map((item) => (
        <li key={item.id} className="grid grid-cols-[88px_minmax(0,1fr)_auto] items-center gap-x-5 gap-y-1 border-b border-rail py-5">
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
            {!item.disponible && <span className="text-[14px] text-sand">{productCopy.agotado}</span>}
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="font-display text-[22px] font-semibold text-paper">{formatMoney(item.precio)}</span>
            <BookmarkButton slug={item.id} titulo={item.titulo} />
          </div>
        </li>
      ))}
    </ul>
  )
}

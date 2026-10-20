import { Link } from 'react-router-dom'
import { productCopy } from '../../data/shop'
import { formatMoney } from '../../utils/format'
import { ImageSlot } from '../ui/ImageSlot'

/**
 * Otros sombreros, en una columna a un lado de la ficha. Cada fila es un enlace a
 * su propia ficha: foto 4:5 pequeña, categoría, nombre y precio.
 *
 * Quien la monta decide cuáles (la página las saca del catálogo, primero las de
 * la misma categoría); aquí solo se pintan. Sin sugerencias no se pinta nada, ni
 * siquiera el título.
 */
export function SuggestedProducts({ items, rotulos }) {
  if (items.length === 0) return null

  return (
    <aside aria-labelledby="sugerencias-titulo">
      <h2 id="sugerencias-titulo" className="font-display text-[26px] leading-[1.15] font-extrabold text-paper">
        {productCopy.sugerencias}
      </h2>
      <p className="mt-1 text-[15px] text-sand">{productCopy.sugerenciasSub}</p>

      <ul className="mt-6 flex flex-col border-t-2 border-rail">
        {items.map((item) => (
          <li key={item.id} className="border-b border-rail">
            <Link to={`/producto/${item.id}`} className="group grid grid-cols-[80px_minmax(0,1fr)] gap-4 py-4">
              <div className="aspect-4/5 overflow-hidden">
                <ImageSlot
                  src={item.foto}
                  alt={item.titulo}
                  className="transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>

              <div className="flex min-w-0 flex-col justify-center gap-1">
                <span className="text-[12px] tracking-label text-sand uppercase">
                  {rotulos.get(item.categoria) ?? item.categoria}
                </span>
                <span className="font-display text-[18px] leading-[1.2] font-semibold text-paper transition-colors group-hover:text-gold">
                  {item.titulo}
                </span>
                <span className="font-display text-[17px] font-semibold text-paper">{formatMoney(item.precio)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

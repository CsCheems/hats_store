import { catalogCopy } from '../../data/catalog'
import { formatMoney } from '../../utils/format'
import { ImageSlot } from '../ui/ImageSlot'

/**
 * Tarjeta del catálogo: sin marco, como la de la portada. HERMANA de
 * home/ProductCard y no una variante suya, por tres razones que valen por
 * separado:
 *
 *   · Las formas de dato no se solapan. Allí `price` es '$1,290' y aquí `precio`
 *     es 1290; allí `category` es el rótulo 'Palma' y aquí `categoria` es el id
 *     'palma', que hay que resolver contra las facetas. Compartir componente
 *     obligaría a una unión de las dos formas dentro, que es exactamente donde
 *     las dos vistas empezarían a divergir detrás de un if.
 *   · La acción es otra cosa: «ver detalles» todavía no lleva a ningún sitio.
 *   · Van a divergir a propósito: la de portada es un anzuelo escogido a mano.
 *
 * Se ven idénticas, que es el objetivo — formatMoney(1290) da '$1,290', carácter
 * por carácter la misma cadena que la portada escribe a mano.
 *
 * Los rótulos llegan ya resueltos desde la retícula, que tiene los mapas de las
 * facetas: la tarjeta no busca nada.
 */
export function CatalogCard({ product, categoria }) {
  return (
    <article className="group flex flex-col gap-4">
      <div className="relative aspect-4/5 overflow-hidden">
        <ImageSlot
          src={product.foto}
          alt={product.titulo}
          className="transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[12px] tracking-label text-sand uppercase">{categoria}</span>

        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[20px] leading-[1.2] font-semibold text-paper">
            {product.titulo}
          </h3>
          <span className="font-display text-[19px] font-semibold whitespace-nowrap text-paper">
            {formatMoney(product.precio)}
          </span>
        </div>

        {/* Sin insignia sobre la foto: lo agotado se dice en texto, junto al
            precio. «Ver detalles» es una leyenda y no un enlace: todavía no lleva
            a ningún sitio, y cuando exista la ficha esto se vuelve un Link. */}
        <span className="mt-[10px] text-[12px] font-semibold tracking-[.16em] text-gold uppercase">
          {product.disponible ? `${catalogCopy.verDetalles} →` : catalogCopy.agotado}
        </span>
      </div>
    </article>
  )
}

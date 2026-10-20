import { Link } from 'react-router-dom'
import { catalogCopy } from '../../data/catalog'
import { formatMoney } from '../../utils/format'
import { BookmarkButton } from '../product/BookmarkButton'
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
 *   · La acción es otra: aquí la foto, el nombre y «ver detalles» llevan a la
 *     ficha, y la foto lleva además el marcador de favoritos.
 *   · Van a divergir a propósito: la de portada es un anzuelo escogido a mano.
 *
 * Se ven idénticas, que es el objetivo — formatMoney(1290) da '$1,290', carácter
 * por carácter la misma cadena que la portada escribe a mano.
 *
 * Los rótulos llegan ya resueltos desde la retícula, que tiene los mapas de las
 * facetas: la tarjeta no busca nada.
 *
 * Tres enlaces a la misma ficha (foto, nombre, «ver detalles») y no uno que lo
 * envuelva todo: el marcador es un botón, y un botón dentro de un enlace no es
 * HTML válido. La foto y el marcador comparten caja; el marcador queda encima.
 * La foto lleva `aria-label` y el nombre el texto, así que un lector de pantalla
 * no anuncia el mismo destino dos veces con el mismo nombre.
 */
export function CatalogCard({ product, categoria }) {
  const ficha = `/producto/${product.id}`

  return (
    <article className="group flex flex-col gap-4">
      <div className="relative aspect-4/5 overflow-hidden">
        <Link to={ficha} aria-label={product.titulo} className="block h-full w-full">
          <ImageSlot
            src={product.foto}
            alt=""
            className="transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>

        <BookmarkButton slug={product.id} titulo={product.titulo} className="absolute top-3 right-3" />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[12px] tracking-label text-sand uppercase">{categoria}</span>

        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[20px] leading-[1.2] font-semibold text-paper">
            <Link to={ficha} className="transition-colors hover:text-gold">
              {product.titulo}
            </Link>
          </h3>
          <span className="font-display text-[19px] font-semibold whitespace-nowrap text-paper">
            {formatMoney(product.precio)}
          </span>
        </div>

        {/* Sin insignia sobre la foto: lo agotado se dice en texto, junto al
            precio. */}
        {product.disponible ? (
          <Link
            to={ficha}
            className="mt-[10px] text-[12px] font-semibold tracking-[.16em] text-gold uppercase hover:text-paper"
          >
            {catalogCopy.verDetalles} →
          </Link>
        ) : (
          <span className="mt-[10px] text-[12px] font-semibold tracking-[.16em] text-gold uppercase">
            {catalogCopy.agotado}
          </span>
        )}
      </div>
    </article>
  )
}

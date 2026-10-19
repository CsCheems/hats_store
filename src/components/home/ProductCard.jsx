import { ImageSlot } from '../ui/ImageSlot'

/**
 * Tarjeta de producto de la portada: sin marco. La foto lleva la sombra de 1px
 * y debajo van la categoría, el nombre y el precio en una línea. Sin insignias:
 * lo que se dice de la pieza va en texto.
 *
 * El ancho lo da quien la pone: el riel de Featured fija 300px.
 */
export function ProductCard({ product }) {
  return (
    <article className="group flex flex-col gap-4">
      <div className="relative aspect-4/5 overflow-hidden">
        <ImageSlot
          src={product.photo}
          alt={product.photoAlt}
          className="transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[12px] tracking-label text-sand uppercase">{product.category}</span>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[22px] leading-[1.2] font-semibold text-paper">
            {product.title}
          </h3>
          <span className="font-display text-[20px] font-semibold whitespace-nowrap text-paper">
            {product.price}
          </span>
        </div>
      </div>
    </article>
  )
}

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { catalogPath } from '../../data/catalog'
import { homeCopy } from '../../data/home'
import { products } from '../../data/products'
import { IconButton } from '../ui/IconButton'
import { ProductCard } from './ProductCard'

// Una tarjeta y su hueco: lo que avanza cada flecha.
const PASO = 330

/**
 * Los de siempre: un riel horizontal con los doce de la portada, que son los
 * mismos que el inventario marca `en_portada`.
 *
 * El riel es scroll nativo con `scroll-snap`, así que el dedo, la rueda y el
 * teclado funcionan sin una línea de JavaScript; las flechas solo llaman a
 * `scrollBy` para quien usa ratón. La barra no se pinta (`scrollbar-width:none`):
 * las flechas y el corte de la última tarjeta ya dicen que hay más.
 *
 * Las flechas se esconden por debajo de `md`, donde el dedo es el control.
 */
export function Featured() {
  const rielRef = useRef(null)

  const mover = (direccion) => {
    rielRef.current?.scrollBy({ left: direccion * PASO, behavior: 'smooth' })
  }

  return (
    <section id="catalogo" className="overflow-hidden py-[clamp(64px,7.5vw,104px)]">
      {/* Sin `max-w-shell`: el riel corre de borde a borde de la ventana, y el
          título y las flechas se alinean con él y con el navbar, no con la caja
          centrada de las demás bandas. */}
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4 px-gutter pb-10">
          <h2 className="font-display text-h2 font-extrabold text-paper">
            {homeCopy.destacados.title}
          </h2>

          <div className="flex items-center gap-4">
            <Link
              to={catalogPath()}
              className="border-b border-paper pb-[4px] text-[13px] font-semibold tracking-[.16em] text-paper uppercase transition-colors hover:border-gold hover:text-gold"
            >
              {homeCopy.destacados.todo} →
            </Link>

            <div className="flex gap-1 max-md:hidden">
              <IconButton tone="paper" aria-label="Anterior" onClick={() => mover(-1)}>
                <ChevronLeft size={18} strokeWidth={1.5} />
              </IconButton>
              <IconButton tone="paper" aria-label="Siguiente" onClick={() => mover(1)}>
                <ChevronRight size={18} strokeWidth={1.5} />
              </IconButton>
            </div>
          </div>
        </div>

        <div
          ref={rielRef}
          role="list"
          className="flex snap-x snap-mandatory gap-7 overflow-x-auto px-gutter pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div key={product.id} role="listitem" className="w-[300px] shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

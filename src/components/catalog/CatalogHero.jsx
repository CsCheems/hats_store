import { catalogCopy } from '../../data/catalog'

/**
 * La cabecera de la página: el título enorme a la izquierda y el texto corto a
 * la derecha, sobre el fondo de la página. La banda de resultados de debajo
 * cambia de fondo, y ese cambio es el divisor.
 *
 * El h1 es de la página y no de la sección: /catalogo tiene un solo título, y es
 * este.
 */
export function CatalogHero() {
  return (
    <section className="px-gutter pt-[clamp(48px,6vw,88px)] pb-[clamp(40px,5vw,72px)]">
      <div className="mx-auto flex max-w-shell flex-wrap items-end justify-between gap-6">
        <div>
          <span className="block text-[12px] font-semibold tracking-kicker text-gold uppercase">
            {catalogCopy.kicker}
          </span>
          <h1 className="mt-4 font-display text-h1 font-extrabold tracking-[-.02em] text-paper">
            {catalogCopy.title}
          </h1>
        </div>

        <p className="max-w-[34ch] text-[18px] leading-[1.55] text-sand">{catalogCopy.intro}</p>
      </div>
    </section>
  )
}

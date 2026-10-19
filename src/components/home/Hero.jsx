import { Link } from 'react-router-dom'
import { catalogPath } from '../../data/catalog'
import { hero, homeCopy, materiales } from '../../data/home'
import { Button } from '../ui/Button'
import { HeroMedia } from './HeroMedia'

/**
 * El hero partido: el texto a la izquierda y el medio —foto o video, ver
 * HeroMedia— a la derecha, a sangre hasta el borde. Debajo del texto, la fila de
 * materiales, que es la forma más corta de llegar a una categoría.
 *
 * `flex-wrap` y no una retícula: por debajo de ~1000px el medio baja bajo el
 * texto sin una sola regla de más.
 */
export function Hero() {
  return (
    <section className="flex min-h-[clamp(560px,52vw,760px)] flex-wrap">
      <div className="flex min-w-[min(100%,420px)] flex-[1_1_560px] flex-col px-gutter pt-[clamp(40px,5vw,72px)] pb-[clamp(32px,4vw,56px)]">
        <div className="flex flex-1 flex-col justify-center gap-7 pb-12">
          <span className="text-[12px] font-semibold tracking-kicker text-gold uppercase">
            {hero.kicker}
          </span>
          <h1 className="font-display text-h1 font-extrabold tracking-[-.02em] text-paper">
            {hero.title}
          </h1>
          <p className="max-w-[30ch] text-[clamp(18px,1.5vw,20px)] leading-[1.55] text-sand">
            {hero.body}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button as={Link} to={hero.action.to} className="min-h-[52px] px-[30px]">
              {hero.action.label}
            </Button>
            <a
              href={hero.secondary.href}
              className="border-b border-paper pb-[4px] text-[13px] font-semibold tracking-[.16em] text-paper uppercase transition-colors hover:border-gold hover:text-gold"
            >
              {hero.secondary.label} →
            </a>
          </div>
        </div>

        <nav
          aria-label={homeCopy.materiales.aria}
          className="flex flex-wrap gap-x-8 gap-y-2 border-t border-rail pt-5 text-[13px] font-medium tracking-[.18em] uppercase"
        >
          {materiales.map((material) => (
            <Link
              key={material.id}
              to={catalogPath({ categoria: material.id })}
              className="border-b border-transparent py-[6px] text-paper transition-colors hover:border-gold"
            >
              {material.nombre}
            </Link>
          ))}
        </nav>
      </div>

      <HeroMedia media={hero.media} className="min-h-[420px] min-w-[min(100%,420px)] flex-[1_1_520px]" />
    </section>
  )
}

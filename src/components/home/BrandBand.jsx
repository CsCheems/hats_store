import { homeCopy } from '../../data/home'

/**
 * La marca: a la izquierda una imagen alta con parallax y a la derecha el
 * texto. La imagen es `--band-brand`, que cambia con el modo, hasta que la
 * marca entregue una foto de taller; entonces se sustituye aquí.
 *
 * Es una banda de fondo alterno (`bg-panel`) como la del proceso, y el mismo
 * parallax que el hero: una capa más alta que su caja, desplazada por CSS.
 */
export function BrandBand() {
  const { marca } = homeCopy

  return (
    <section className="bg-panel">
      <div className="mx-auto flex max-w-shell flex-wrap items-stretch px-gutter">
        <div
          aria-hidden="true"
          className="relative min-h-[420px] min-w-[min(100%,380px)] flex-[1_1_440px] overflow-hidden"
        >
          <div
            className="parallax absolute inset-x-0 -top-[14%] h-[128%]"
            style={{ background: 'var(--band-brand)' }}
          />
        </div>

        <div className="flex min-w-[min(100%,380px)] flex-[1_1_440px] flex-col justify-center gap-6 py-[clamp(56px,7vw,96px)] pl-0 sm:pl-[clamp(32px,4.5vw,64px)]">
          <span className="text-[12px] font-semibold tracking-kicker text-gold uppercase">
            {marca.kicker}
          </span>
          <h2 className="font-display text-h2 font-extrabold text-paper">{marca.title}</h2>
          <p className="max-w-[40ch] text-[18px] leading-[1.6] text-sand">{marca.body}</p>
          <a
            href={marca.action.href}
            className="self-start border-b border-paper pb-[4px] text-[13px] font-semibold tracking-[.16em] text-paper uppercase transition-colors hover:border-gold hover:text-gold"
          >
            {marca.action.label} →
          </a>
        </div>
      </div>
    </section>
  )
}

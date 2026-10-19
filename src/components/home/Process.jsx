import { homeCopy } from '../../data/home'

/**
 * El proceso: solo texto numerado, cuatro pasos. La jerarquía la da la línea de
 * 2px de arriba de cada uno y el número en el acento, no un icono.
 *
 * `auto-fit` con un mínimo de 240px: de una columna en un teléfono a cuatro en
 * una pantalla ancha, sin puntos de corte.
 */
export function Process() {
  const { proceso } = homeCopy

  return (
    <section id={proceso.id} className="bg-panel px-gutter py-[clamp(64px,7.5vw,104px)]">
      <div className="mx-auto grid max-w-shell grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-12">
        <div className="col-span-full flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-[16ch] font-display text-h2 font-extrabold text-paper">
            {proceso.title}
          </h2>
          <span className="text-[12px] font-semibold tracking-kicker text-gold uppercase">
            {proceso.kicker}
          </span>
        </div>

        {proceso.pasos.map((paso) => (
          <div key={paso.n} className="flex flex-col gap-[10px] border-t-2 border-paper pt-5">
            <span className="font-display text-[44px] leading-none font-extrabold text-gold">
              {paso.n}
            </span>
            <span className="text-[15px] font-semibold tracking-[.16em] text-paper uppercase">
              {paso.titulo}
            </span>
            <span className="text-[16px] leading-[1.55] text-sand">{paso.texto}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

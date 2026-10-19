import { promises } from '../../data/site'

/**
 * Fila de promesas del footer: solo texto. Cada una cuelga de una línea fina
 * que la separa de la anterior, así que la jerarquía la da la línea y no un
 * icono.
 */
export function PromiseRow() {
  return (
    <div className="mx-auto grid max-w-shell grid-cols-1 gap-[clamp(20px,2.4vw,40px)] px-gutter py-[clamp(32px,3.6vw,48px)] sm:grid-cols-3">
      {promises.map((promise) => (
        <div key={promise.title} className="border-t border-edge pt-[16px]">
          <div className="text-[13px] font-semibold tracking-[.16em] text-paper uppercase">
            {promise.title}
          </div>
          <div className="mt-[6px] text-[16px] text-sand">{promise.note}</div>
        </div>
      ))}
    </div>
  )
}

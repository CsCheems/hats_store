import { checkoutCopy } from '../../data/checkout'

/**
 * Dónde va la compra: Envío y Pago, numerados. Texto y una regla de 2px, sin
 * puntos ni círculos: el paso en curso lleva la regla en el acento y el texto
 * principal, el pendiente la regla suave y el texto secundario. Es una lista
 * ordenada de verdad (`ol`), y el lector de pantalla oye en cuál va por
 * `aria-current="step"`.
 *
 * Los pasos hechos no son botones: volver atrás se hace con el «Cambiar» o el
 * «Volver» del propio paso, que además saben qué conservar.
 */
export function CheckoutSteps({ paso }) {
  const actual = checkoutCopy.pasos.findIndex((p) => p.key === paso)

  return (
    <ol aria-label={checkoutCopy.pasosAria} className="grid grid-cols-2 gap-[clamp(14px,3vw,32px)]">
      {checkoutCopy.pasos.map((p, i) => {
        const hecho = i < actual
        const enCurso = i === actual

        return (
          <li
            key={p.key}
            aria-current={enCurso ? 'step' : undefined}
            className={`border-t-2 pt-3 ${enCurso ? 'border-gold' : hecho ? 'border-paper' : 'border-rail'}`}
          >
            <span className="block text-[12px] font-semibold tracking-kicker text-sand uppercase">
              {`0${i + 1}`}
            </span>
            <span
              className={`mt-1 block font-display text-[20px] font-semibold ${enCurso || hecho ? 'text-paper' : 'text-sand'}`}
            >
              {p.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

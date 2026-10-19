// La silueta del sombrero, dibujada a mano: copa con hendidura y ala curva. Es
// una recreación del logo de la marca, no el trazo oficial; cuando llegue el
// archivo real se sustituye aquí y en ningún otro sitio.
const COPA =
  'M6 33C20 36 31 30 37 21C40 9 52 4 60 11C68 4 80 9 83 21C89 30 100 36 114 33C103 43 82 41 60 41C38 41 17 43 6 33Z'
const HENDIDURA = 'M44 17C52 21 68 21 76 17'

export function Sombrero({ className = '' }) {
  return (
    <svg
      viewBox="0 0 120 48"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinejoin="round"
    >
      <path d={COPA} />
      <path d={HENDIDURA} strokeWidth="1.8" />
    </svg>
  )
}

/**
 * El logotipo. `compact` es la fila del navbar —el nombre con «INTERNATIONAL»
 * debajo, en dos líneas— y `stacked` el lockup completo de sombrero, nombre e
 * «INTERNATIONAL», que va en el footer y en el modal.
 *
 * El color lo da el contenedor (`text-paper` por omisión): hereda del modo.
 */
export function Logo({ variant = 'compact', className = '' }) {
  if (variant === 'stacked') {
    return (
      <span className={`inline-flex flex-col items-start leading-none ${className}`}>
        <Sombrero className="mb-[8px] h-[30px] w-auto text-gold" />
        <span className="font-display text-[40px] font-extrabold tracking-[-.01em]">Nicol Hats</span>
        <span className="mt-[8px] text-[10px] font-semibold tracking-[.62em] text-gold">
          INTERNATIONAL
        </span>
      </span>
    )
  }

  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="font-display text-wordmark font-extrabold">Nicol Hats</span>
      <span className="mt-[5px] text-[8px] font-semibold tracking-[.62em] text-gold">
        INTERNATIONAL
      </span>
    </span>
  )
}

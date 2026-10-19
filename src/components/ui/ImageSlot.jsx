import { Sombrero } from './Logo'

/**
 * Hueco de fotografía. Las fotos reales están pendientes: mientras `src` sea
 * null dibuja unas franjas diagonales finas (`photo`, con la sombra de 1px) y la
 * silueta de un sombrero, y en cuanto llegue renderiza el <img> con el mismo
 * encuadre. La descripción viaja como `aria-label`.
 *
 * Producto: vertical 4:5, mín. 1000×1250.
 */
export function ImageSlot({ src, alt, className = '' }) {
  if (src) {
    return <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} />
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`photo flex h-full w-full items-center justify-center text-sand ${className}`}
    >
      <Sombrero className="w-[96px]" />
    </div>
  )
}

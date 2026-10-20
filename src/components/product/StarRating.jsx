import { Star } from 'lucide-react'
import { reviewsCopy } from '../../data/shop'

/**
 * Estrellas de solo lectura. Se redondea al entero más cercano: un 4.3 se pinta
 * con cuatro llenas, y el número exacto va siempre al lado, escrito.
 *
 * El conjunto es una sola imagen para el lector de pantalla (`role="img"` con la
 * puntuación dicha), y las cinco estrellas son decorativas: leer «estrella,
 * estrella, estrella» no informa de nada.
 *
 * Llenas en el acento y vacías solo con contorno; sin puntos ni degradados.
 */
export function StarRating({ value, size = 16, className = '' }) {
  const llenas = Math.round(value ?? 0)

  return (
    <span role="img" aria-label={reviewsCopy.puntuacion(value ?? 0)} className={`inline-flex gap-[2px] text-gold ${className}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} strokeWidth={1.5} fill={n <= llenas ? 'currentColor' : 'none'} aria-hidden="true" />
      ))}
    </span>
  )
}

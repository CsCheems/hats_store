import { estados } from '../../data/admin'

// Mapa de variantes, como los del sistema de la tienda: un tono nuevo se añade
// aquí, nunca con className suelto en un sitio de paso.
const TONES = {
  good: 'border-admin-good/35 bg-admin-good/10 text-admin-good',
  info: 'border-admin-blue/35 bg-admin-sky text-admin-blue',
  warn: 'border-admin-warn/35 bg-admin-warn/10 text-admin-warn',
  muted: 'border-admin-line bg-admin-canvas text-admin-muted',
}

/**
 * Insignia de estado, la misma para productos y para pedidos: los dos usan el
 * mapa `estados` de data/admin.js.
 *
 * Un estado que no esté en el mapa se pinta con su propia clave y en tono
 * neutro, en vez de reventar o quedarse en blanco. El servidor puede añadir
 * 'reembolsado' cualquier día, y la tabla debe seguir siendo legible mientras
 * alguien le pone su rótulo aquí.
 */
export function AdminBadge({ estado }) {
  const definicion = estados[estado]

  return (
    <span
      className={`inline-flex items-center rounded-admin border px-[8px] py-[2px] text-[11px] whitespace-nowrap ${TONES[definicion?.tono ?? 'muted']}`}
    >
      {definicion?.label ?? estado}
    </span>
  )
}

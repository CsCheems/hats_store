import { CircleCheck, TriangleAlert, X } from 'lucide-react'

const TONES = {
  good: { box: 'border-admin-good/35 bg-admin-good/10 text-admin-good', Icon: CircleCheck },
  warn: { box: 'border-admin-warn/35 bg-admin-warn/10 text-admin-warn', Icon: TriangleAlert },
}

/**
 * Aviso en línea del panel: «guardado», «archivado», o un error que no es de
 * ningún campo. Hace el papel del Toast de la tienda, que no cruza la frontera.
 *
 * Va en la página, encima de lo que cambió, y se queda hasta que se cierra o se
 * sale de la vista: un aviso que se desvanece solo se pierde justo cuando se
 * miraba la tabla.
 *
 * `role="status"` para los buenos y `alert` para los malos: el lector de
 * pantalla anuncia los dos, pero solo interrumpe por el segundo.
 */
export function AdminNotice({ tone = 'good', children, onClose, className = '' }) {
  const { box, Icon } = TONES[tone]

  return (
    <div
      role={tone === 'warn' ? 'alert' : 'status'}
      className={`flex items-start gap-[10px] rounded-admin border px-3 py-[10px] text-[13px] leading-[1.5] ${box} ${className}`}
    >
      <Icon size={16} strokeWidth={1.5} className="mt-[2px] shrink-0" />
      <div className="min-w-0 flex-1">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar aviso"
          className="-m-1 grid size-[26px] shrink-0 cursor-pointer place-items-center rounded-admin opacity-75 transition-opacity hover:opacity-100 focus-visible:outline-admin-blue"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}

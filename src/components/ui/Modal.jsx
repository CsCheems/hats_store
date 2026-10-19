import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useLoginModal } from '../../hooks/useLoginModal'
import { Frame } from './Frame'
import { IconButton } from './IconButton'

/**
 * Diálogo modal: velo oscuro y panel con línea fina.
 *
 * Va por portal a `document.body` por obligación, no por gusto: el header tiene
 * `backdrop-blur` y el contenedor de Home `overflow-x-hidden`, y cada uno crea
 * un contexto de apilamiento y de recorte que dejaría el modal por debajo o
 * cortado. El header es `z-30`, el máximo del sitio; el velo va en `z-50`.
 *
 * El velo es un tinta constante y no `bg-ink`: ese token es el fondo de la
 * página, que en modo claro es crema, y un velo crema no oscurece nada.
 *
 * El panel no lleva `overflow-hidden`: el scroll del contenido lo pone quien
 * lo consume, en un hijo, para no recortar la sombra.
 */
export function Modal({ open, onClose, labelledBy, className = '', children }) {
  const panelRef = useLoginModal({ open, onClose })

  if (!open) return null

  // Cierre por velo en `mousedown` y comprobando el objetivo: con `click` un
  // arrastre que empieza dentro del panel y suelta fuera cerraría el diálogo.
  const onBackdrop = (event) => {
    if (event.target === event.currentTarget) onClose()
  }

  return createPortal(
    <div
      onMouseDown={onBackdrop}
      className="animate-overlay-in fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-tinta/70 p-4 sm:items-center"
    >
      {/* React 19 pasa `ref` como prop normal, así que Frame la reenvía sola
          junto al resto de props. */}
      <Frame
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        weight="strong"
        className={`animate-panel-in flex max-h-[calc(100dvh-32px)] w-full flex-col ${className}`}
      >
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute top-[12px] right-[12px] z-10"
        >
          <X size={17} strokeWidth={1.5} />
        </IconButton>

        {children}
      </Frame>
    </div>,
    document.body,
  )
}

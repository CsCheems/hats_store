import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { lightboxCopy } from '../../data/shop'
import { useLoginModal } from '../../hooks/useLoginModal'

// Los controles van sobre un velo oscuro SIEMPRE, en claro y en oscuro, así que
// llevan constantes de marca (`pergamino`, `tinta`) y no las variables del tema,
// que en modo claro darían texto oscuro sobre fondo oscuro.
const BOTON =
  'grid h-[44px] w-[44px] cursor-pointer place-items-center border border-pergamino/40 text-pergamino transition-colors hover:border-pergamino hover:bg-pergamino hover:text-tinta'

/**
 * La imagen a pantalla completa. Se abre al pulsar la foto de la ficha.
 *
 * Reutiliza useLoginModal, que a pesar del nombre es el comportamiento genérico
 * de un diálogo: Escape cierra, el foco queda atrapado dentro y vuelve a quien lo
 * abrió, y el scroll de la página se congela.
 *
 * Se cierra con la X, con Escape y pulsando el velo (fuera de la imagen). Las
 * flechas del teclado y los botones laterales pasan de foto sin cerrar.
 * `object-contain` y no `cover`: aquí se ve la imagen entera, sin recortes —es
 * justo para lo que se abre—.
 */
export function Lightbox({ open, images, index, titulo, onClose, onIndex }) {
  const panelRef = useLoginModal({ open, onClose })
  const total = images.length

  const ir = useCallback(
    (delta) => {
      if (total > 1) onIndex((index + delta + total) % total)
    },
    [index, total, onIndex],
  )

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft') ir(-1)
      if (event.key === 'ArrowRight') ir(1)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, ir])

  if (!open || total === 0) return null

  // En `mousedown` y comprobando el objetivo, como Modal: un arrastre que empieza
  // sobre la imagen y suelta fuera no debe cerrarlo.
  const onBackdrop = (event) => {
    if (event.target === event.currentTarget) onClose()
  }

  return createPortal(
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={lightboxCopy.titulo}
      onMouseDown={onBackdrop}
      className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-tinta/90 p-4 outline-none sm:p-12"
    >
      <img
        src={images[index]}
        alt={`${titulo}, ${lightboxCopy.contador(index + 1, total)}`}
        className="max-h-full max-w-full object-contain"
      />

      <button
        type="button"
        aria-label={lightboxCopy.cerrar}
        onClick={onClose}
        className={`${BOTON} absolute top-[14px] right-[14px]`}
      >
        <X size={18} strokeWidth={1.5} />
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label={lightboxCopy.anterior}
            onClick={() => ir(-1)}
            className={`${BOTON} absolute top-1/2 left-[14px] -translate-y-1/2`}
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label={lightboxCopy.siguiente}
            onClick={() => ir(1)}
            className={`${BOTON} absolute top-1/2 right-[14px] -translate-y-1/2`}
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>

          <p className="absolute bottom-[14px] left-1/2 -translate-x-1/2 text-[13px] font-semibold tracking-label text-pergamino uppercase tabular-nums">
            {lightboxCopy.contador(index + 1, total)}
          </p>
        </>
      )}
    </div>,
    document.body,
  )
}

import { useEffect, useId, useRef } from 'react'
import { adminConfirm } from '../../data/admin'
import { AdminButton } from './AdminButton'

/**
 * Diálogo de confirmación del panel, sobre el <dialog> NATIVO.
 *
 * showModal() ya trae lo que un modal hecho a mano tiene que escribir: la capa
 * superior —sin z-index que pelear con la barra sticky—, el foco atrapado, el
 * resto de la página inerte y Escape. Por eso no reutiliza useLoginModal, que
 * además es de la tienda.
 *
 * Escape dispara `cancel`, y se intercepta para que cerrar pase SIEMPRE por
 * `onCancel`: si el navegador cerrara el diálogo por su cuenta, `open` seguiría
 * en true en el estado de React y el siguiente clic no lo abriría.
 *
 * Mientras `pending`, no se puede cerrar: la acción ya salió y lo que toca es
 * esperar su respuesta, no fingir que se canceló.
 */
export function AdminDialog({ open, title, children, confirmLabel, pendingLabel, pending = false, onConfirm, onCancel }) {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        if (!pending) onCancel()
      }}
      className="m-auto w-[min(440px,calc(100vw-32px))] rounded-admin border border-admin-line bg-admin-card p-0 text-admin-ink shadow-admin backdrop:bg-admin-navy/45"
    >
      <div className="p-5">
        <h2 id={titleId} className="text-[15px] text-admin-ink">
          {title}
        </h2>
        <div className="mt-2 text-[13px] leading-[1.55] text-admin-muted">{children}</div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <AdminButton onClick={onCancel} disabled={pending}>
            {adminConfirm.cancelar}
          </AdminButton>
          <AdminButton variant="warn" onClick={onConfirm} disabled={pending} aria-busy={pending}>
            {pending ? pendingLabel : confirmLabel}
          </AdminButton>
        </div>
      </div>
    </dialog>
  )
}

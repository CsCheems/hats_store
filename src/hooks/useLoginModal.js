import { useEffect, useRef } from 'react'

// Lo enfocable dentro del panel, en orden de tabulación.
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

const visible = (el) => el.offsetParent !== null

/**
 * Comportamiento del modal de acceso: las tres cosas que un diálogo debe hacer
 * y el navegador no hace solo —cerrar con Escape, atrapar el foco dentro del
 * panel y devolverlo a quien lo abrió, y congelar el scroll de la página de
 * detrás.
 *
 * Devuelve la ref que hay que poner en el panel. El panel necesita
 * `tabIndex={-1}` para poder recibir el foco inicial.
 */
export function useLoginModal({ open, onClose }) {
  const panelRef = useRef(null)
  const opener = useRef(null)

  // Bloqueo de scroll. La compensación de `paddingRight` no es cosmética: al
  // quitar la barra de desplazamiento el ancho del viewport crece y toda la
  // página —navbar sticky incluido— pega un salto lateral.
  useEffect(() => {
    if (!open) return

    const { body, documentElement } = document
    const gap = window.innerWidth - documentElement.clientWidth
    const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }

    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`

    return () => {
      body.style.overflow = previous.overflow
      body.style.paddingRight = previous.paddingRight
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    opener.current = document.activeElement

    // Con ratón se enfoca el primer campo, que es lo que la persona quiere
    // escribir. Con dedo no: abriría el teclado encima del formulario nada más
    // aparecer. En ese caso se enfoca el panel, que al llevar `aria-labelledby`
    // hace que el lector de pantalla anuncie el diálogo.
    const panel = panelRef.current
    const target =
      (window.matchMedia('(pointer: fine)').matches && panel?.querySelector('input')) || panel

    target?.focus()

    return () => opener.current?.focus?.()
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const nodes = [...(panelRef.current?.querySelectorAll(FOCUSABLE) ?? [])].filter(visible)
      if (!nodes.length) return

      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement

      // El ciclo se cierra a mano: sin esto el tabulador se escapa al header
      // que sigue detrás del overlay.
      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return panelRef
}

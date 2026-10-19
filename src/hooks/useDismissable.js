import { useEffect, useRef } from 'react'

/**
 * Cierre de un desplegable: clic fuera, Escape y devolución del foco.
 *
 * Devuelve dos refs en vez de un contenedor único porque no siempre hay un
 * padre común: en el navbar el disparador vive en el grupo de botones y el
 * panel del menú móvil es un hermano que cuelga más abajo del header.
 */
export function useDismissable({ open, onClose }) {
  const triggerRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const outside = (target) =>
      !triggerRef.current?.contains(target) && !panelRef.current?.contains(target)

    // `pointerdown` y no `click`: con `click` el propio disparador entraría en
    // el «clic fuera», el menú se cerraría y su `onClick` lo volvería a abrir en
    // el mismo gesto. Nunca se cerraría desde su botón.
    const onPointerDown = (event) => {
      if (outside(event.target)) onClose()
    }

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return

      // El foco se devuelve solo si estaba dentro del panel. Si no, cerrar
      // desde otro punto de la página se lo arrancaría a quien lo tuviera.
      if (panelRef.current?.contains(document.activeElement)) triggerRef.current?.focus()

      onClose()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return { triggerRef, panelRef }
}

import { useCallback, useMemo, useRef, useState } from 'react'
import { ToastViewport } from '../components/ui/Toast'
import { ToastContext } from './ToastContext'

// Tres avisos como mucho: apilar más tapa la esquina en vez de informar.
const MAX = 3

/** Cola de avisos del sitio. Hoy la usa el modal de acceso; mañana, la bolsa. */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const lastId = useRef(0)

  const dismissToast = useCallback((id) => {
    setToasts((list) => list.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback((toast) => {
    lastId.current += 1
    const id = lastId.current
    // El más reciente arriba, y se recorta por la cola.
    setToasts((list) => [{ ...toast, id }, ...list].slice(0, MAX))
    return id
  }, [])

  const value = useMemo(() => ({ pushToast, dismissToast }), [pushToast, dismissToast])

  return (
    <ToastContext value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext>
  )
}

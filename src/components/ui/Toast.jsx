import { AlertTriangle, Check, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Frame } from './Frame'

const LIFETIME = 4500
const TRANSITION = 220

const TONES = {
  // Confirmación: regla e icono en el acento sobre el fondo del aviso.
  success: { rule: 'bg-gold', icon: 'text-gold', Icon: Check },
  // Error: la regla y el icono van en ámbar y el texto se queda en el color
  // normal: el aviso lo dan el filete y el icono.
  error: { rule: 'bg-rust', icon: 'text-rust', Icon: AlertTriangle },
}

/**
 * Aviso suelto: un panel pequeño. Se cierra solo a los 4.5s, pero el reloj se
 * detiene mientras el puntero o el foco están encima: si alguien se acerca a
 * leerlo o a cerrarlo, el aviso no se le escapa.
 */
function Toast({ toast, onDismiss }) {
  const tone = TONES[toast.tone] ?? TONES.success
  const { Icon } = tone

  const [entered, setEntered] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [paused, setPaused] = useState(false)

  const exitTimer = useRef(null)

  // Un frame de retraso para que el navegador pinte el estado inicial y la
  // transición de entrada tenga desde dónde salir.
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const dismiss = useCallback(() => {
    setLeaving(true)
    exitTimer.current = setTimeout(() => onDismiss(toast.id), TRANSITION)
  }, [onDismiss, toast.id])

  useEffect(() => {
    if (paused || leaving) return
    const id = setTimeout(dismiss, LIFETIME)
    return () => clearTimeout(id)
  }, [paused, leaving, dismiss])

  useEffect(() => () => clearTimeout(exitTimer.current), [])

  const visible = entered && !leaving

  return (
    <Frame
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`pointer-events-auto w-[min(340px,calc(100vw-32px))] transition-[opacity,transform] duration-[220ms] ease-track ${
        visible ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'
      }`}
    >
      <span className={`absolute inset-y-0 left-0 w-[3px] ${tone.rule}`} />

      <div className="flex items-start gap-[10px] py-[12px] pr-[8px] pl-[16px]">
        <Icon size={16} strokeWidth={1.5} className={`mt-px shrink-0 ${tone.icon}`} />

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold tracking-wide text-paper uppercase">{toast.title}</p>
          {toast.body && (
            <p className="mt-[5px] text-[14px] leading-[1.45] text-sand">{toast.body}</p>
          )}
        </div>

        <button
          type="button"
          aria-label="Cerrar aviso"
          onClick={dismiss}
          className="grid h-[24px] w-[24px] shrink-0 cursor-pointer place-items-center text-sand transition-colors hover:text-paper"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>
    </Frame>
  )
}

/**
 * Pila de avisos arriba a la izquierda, el más reciente arriba.
 *
 * Se renderiza siempre, aunque esté vacía: una región `aria-live` tiene que
 * existir en el DOM antes de recibir contenido o el lector de pantalla no
 * anuncia lo que aparece dentro.
 */
export function ToastViewport({ toasts, onDismiss }) {
  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed top-4 left-4 z-[60] flex flex-col gap-[10px]"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body,
  )
}

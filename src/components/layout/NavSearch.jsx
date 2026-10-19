import { Search, SendHorizontal, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { catalogPath } from '../../data/catalog'
import { useDismissable } from '../../hooks/useDismissable'

// El botón mide el alto de la caja menos sus dos bordes de 1px.
const BOTON =
  'grid h-[36px] w-[36px] shrink-0 cursor-pointer place-items-center text-paper transition-colors hover:text-gold'

/**
 * El buscador del navbar: un botón de lupa que, al pulsarlo, se abre en un campo
 * de texto.
 *
 * LA ANIMACIÓN ES UNA SOLA TRANSICIÓN DE ANCHO, y el desplazamiento del navbar
 * sale gratis de ella. El buscador es el último elemento de una fila flex cuyo
 * logo lleva `mr-auto`, así que al ensancharse la caja los enlaces —que van
 * pegados a ella— se recorren a la izquierda exactamente lo que ésta crece, y al
 * cerrarse vuelven. No hay un cálculo de «cuánto mover»: lo hace el layout.
 *
 * El contenido NO se desmonta al cerrar: si lo hiciera, el campo desaparecería de
 * golpe en vez de recogerse con la caja. Cerrado va `inert`, que lo saca del
 * orden de tabulación y del árbol de accesibilidad sin tocar el DOM.
 *
 * Enter lleva al catálogo con la consulta en `?q=`, que es lo que ya lee
 * useCatalogFilters: no hay un segundo buscador, hay una puerta al de siempre. Con
 * el campo vacío, Enter y la lupa solo cierran.
 *
 * Cierra con clic fuera y con Escape (useDismissable, el mismo hook de todos los
 * desplegables del sitio: abrir cualquier otro menú cierra éste sin coordinación).
 *
 * Solo existe desde `xl`. Por debajo, el buscador es el campo fijo de la parte
 * alta del menú de la hamburguesa (NavMobileSearch), que no necesita animación
 * porque no hay enlaces en la barra que recorrer.
 */
export function NavSearch({ open, onOpenChange }) {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [texto, setTexto] = useState('')

  const close = useCallback(() => {
    onOpenChange(false)
    setTexto('')
  }, [onOpenChange])

  const { triggerRef, panelRef } = useDismissable({ open, onClose: close })

  // El foco entra al campo al abrir. Va en un efecto porque el campo sigue
  // `inert` hasta que el render con `open` se confirma.
  //
  // `preventScroll` y `overflow-clip` en la caja van juntos: al enfocar, la caja
  // aún mide 38px y el navegador la DESPLAZA por dentro para mostrar el campo. Con
  // `overflow-hidden` eso es posible, y la caja podía quedarse recorrida —media
  // lupa y la X a la vista— en un hueco chico. `clip` no admite desplazamiento.
  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true })
  }, [open])

  const consulta = texto.trim()

  const onSubmit = (event) => {
    event.preventDefault()

    // Cerrado no hay nada que enviar: solo se abre.
    if (!open) return

    close()

    if (consulta) navigate(catalogPath({ q: consulta }))
  }

  // Lupa y «enviar» son el mismo botón con dos oficios, y lo decide el texto:
  // vacío es una lupa que solo abre (o devuelve el foco al campo); con texto es
  // un icono de enviar. La lupa nunca envía.
  const alPulsar = !open
    ? () => onOpenChange(true)
    : consulta
      ? () => panelRef.current?.requestSubmit()
      : () => inputRef.current?.focus()

  return (
    <form
      ref={panelRef}
      role="search"
      onSubmit={onSubmit}
      className={`flex h-[38px] shrink-0 items-center overflow-clip border transition-[width,border-color] duration-300 ease-track ${
        open
          ? 'w-[clamp(200px,22vw,300px)] border-edge'
          : 'w-[38px] border-transparent hover:border-edge'
      }`}
    >
      {/* La lupa es el disparador cerrada y el envío abierta: es el mismo botón,
          así que el foco no se pierde al abrir.

          SIEMPRE `type="button"`. Si cambiara a `submit` al abrir, React aplicaría
          el cambio dentro del mismo clic y el navegador —que decide la acción por
          defecto DESPUÉS del manejador— enviaría el formulario recién abierto:
          campo vacío, `close()`, y el buscador se abría y se cerraba al instante.
          El envío abierto lo pide `requestSubmit`. */}
      <button
        ref={triggerRef}
        type="button"
        aria-label={!open ? 'Abrir búsqueda' : consulta ? 'Enviar búsqueda' : 'Buscar'}
        aria-expanded={open}
        onClick={alPulsar}
        className={BOTON}
      >
        {open && consulta ? (
          <SendHorizontal size={17} strokeWidth={1.5} />
        ) : (
          <Search size={17} strokeWidth={1.5} />
        )}
      </button>

      <input
        ref={inputRef}
        type="text"
        value={texto}
        onChange={(event) => setTexto(event.target.value)}
        inert={!open}
        placeholder="Buscar sombreros"
        aria-label="Buscar sombreros"
        autoComplete="off"
        className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-paper placeholder:text-sand focus-visible:outline-none"
      />

      <button type="button" inert={!open} aria-label="Cerrar búsqueda" onClick={close} className={BOTON}>
        <X size={16} strokeWidth={1.8} />
      </button>
    </form>
  )
}

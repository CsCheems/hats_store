import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const FADE_OUT = 160
const GROW = 260

const EASE = 'cubic-bezier(.55,.05,.25,1)'

/**
 * Cruce en fundido entre dos vistas de alturas muy distintas —entrar son dos
 * campos, crear cuenta son once—. Con `opacity` a secas el panel pegaría un
 * salto de varios cientos de píxeles en mitad del cambio, así que la altura se
 * mide y se anima junto con la entrada.
 *
 * Tres fases, como el carrusel: se apaga el contenido viejo, se cambia la vista
 * y en el layout effect se mide la nueva altura, y se anima altura y opacidad a
 * la vez. Al terminar la altura vuelve a `auto` para que el formulario pueda
 * crecer solo si aparecen mensajes de error.
 *
 * `boxRef` va en el contenedor que se anima; `contentRef` en el hijo que se
 * mide. `shown` es la vista que hay que pintar —no la que se pidió—.
 */
export function useFadeSwitch(initial) {
  const boxRef = useRef(null)
  const contentRef = useRef(null)

  const [shown, setShown] = useState(initial)

  const entering = useRef(false)
  const busy = useRef(false)
  const timers = useRef([])

  const later = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
    return id
  }, [])

  const switchTo = useCallback(
    (next) => {
      const box = boxRef.current
      if (!box || busy.current || next === shown) return

      busy.current = true

      // La altura se congela antes de apagar el contenido: si se dejara en
      // `auto`, al cambiar de vista saltaría antes de poder animarse.
      box.style.height = `${box.offsetHeight}px`
      box.style.overflow = 'hidden'
      box.style.transition = `opacity ${FADE_OUT}ms ${EASE}`
      box.style.opacity = '0'

      later(() => {
        entering.current = true
        setShown(next)
      }, FADE_OUT)
    },
    [shown, later],
  )

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box || !entering.current) return

    entering.current = false

    // El contenido nuevo ya está en el DOM pero oculto por la opacidad, así que
    // se puede medir a su altura natural aunque la caja siga con la vieja.
    const height = contentRef.current?.offsetHeight ?? 0

    box.style.transition = `height ${GROW}ms ${EASE}, opacity ${GROW}ms ${EASE}`
    box.style.height = `${height}px`
    box.style.opacity = '1'

    later(() => {
      // Se sueltan altura y recorte: a partir de aquí el formulario manda, y un
      // error que aparezca debajo de un campo debe poder empujar el panel.
      box.style.transition = ''
      box.style.height = ''
      box.style.overflow = ''
      busy.current = false
    }, GROW)
  }, [shown, later])

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    },
    [],
  )

  return { boxRef, contentRef, shown, switchTo }
}

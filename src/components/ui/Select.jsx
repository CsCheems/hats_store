import { Check, ChevronDown } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useDismissable } from '../../hooks/useDismissable'
import { INPUT } from './fieldStyles'
import { Frame } from './Frame'

// Alto máximo de la lista. Con 32 estados hay scroll; con menos, se ajusta.
const LIST_MAX = 264

// Ventana de la búsqueda por teclado: letras seguidas dentro de este margen se
// suman («nu» → Nuevo León); pasado, se empieza de nuevo.
const TYPEAHEAD_MS = 600

const OPTION =
  'flex cursor-pointer items-center justify-between gap-3 px-[14px] py-[9px] text-[15px] transition-colors'

// Sin acentos ni mayúsculas: teclear «q» encuentra Querétaro y «yuc», Yucatán.
const plain = (text) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

const isPrintable = (event) =>
  event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey

/**
 * Lista desplegable con el aspecto del sitio.
 *
 * NO ES UN <select>, y es a propósito: la lista de un select nativo la dibuja el
 * sistema operativo —fondo blanco, esquinas redondas, tipografía del sistema— y
 * no admite estilo. Esta es la misma pieza que el resto de desplegables del
 * sitio: un Frame con marcas doradas sobre `panel`, que se abre con
 * `animate-panel-in` y se cierra con useDismissable.
 *
 * Sigue el patrón «combobox de solo selección» de WAI-ARIA, así que A
 * DIFERENCIA DE LOS MENÚS DEL NAVBAR sí promete —y cumple— el teclado de una
 * lista: flechas, Inicio/Fin, RePág/AvPág, búsqueda por letras, Enter/Espacio
 * para elegir, Tab para elegir y seguir, Escape para cerrar. Los menús usan el
 * patrón de divulgación precisamente porque no implementan las flechas.
 *
 * EL FOCO NUNCA SALE DEL DISPARADOR. La opción activa se anuncia con
 * `aria-activedescendant`, y las opciones cancelan el `mousedown` para que un
 * clic no se lleve el foco. Por eso Escape y el clic fuera los resuelve el
 * disparador, y por eso `focusField` de useForm lo encuentra por su `name` como
 * a cualquier input.
 */
export function Select({
  id,
  name,
  value,
  options,
  placeholder,
  disabled = false,
  toneClass,
  invalid,
  describedBy,
  labelId,
  onChange,
}) {
  const listId = useId()
  const optionId = (index) => `${listId}-${index}`

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [upward, setUpward] = useState(false)
  const typed = useRef({ text: '', at: 0 })

  const close = useCallback(() => setOpen(false), [])
  const { triggerRef, panelRef } = useDismissable({ open, onClose: close })

  const selected = options.indexOf(value)
  const shown = open && !disabled

  // La opción activa siempre a la vista: al abrir sobre «Zacatecas» y al bajar
  // con las flechas más allá del borde de la lista. `nearest` no mueve nada si
  // ya se ve.
  useEffect(() => {
    if (shown && active >= 0) {
      document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' })
    }
  }, [shown, active, listId])

  const openAt = (index) => {
    // Hacia arriba solo si debajo no cabe y arriba hay más sitio. Se decide al
    // abrir, en el evento, y no en un efecto: así el panel aparece ya en su lado
    // en vez de pintarse abajo y saltar.
    const rect = triggerRef.current.getBoundingClientRect()
    const below = window.innerHeight - rect.bottom

    setUpward(below < LIST_MAX + 24 && rect.top > below)
    setActive(index)
    setOpen(true)
  }

  const choose = (index) => {
    if (index >= 0 && options[index] !== value) onChange(options[index])
    setOpen(false)
  }

  // Búsqueda por letras: la primera opción que empieza por lo tecleado, mirando
  // desde la siguiente a `from`. Repetir la misma letra recorre las opciones que
  // empiezan por ella, como en un select nativo.
  const search = (key, from) => {
    const now = Date.now()
    const fresh = now - typed.current.at > TYPEAHEAD_MS
    const text = fresh ? key : typed.current.text + key

    typed.current = { text, at: now }

    const repeated = [...text].every((char) => char === text[0])
    const needle = plain(repeated ? text[0] : text)
    const start = repeated || fresh ? from + 1 : Math.max(from, 0)

    for (let step = 0; step < options.length; step += 1) {
      const index = (start + step) % options.length
      if (plain(options[index]).startsWith(needle)) return index
    }

    return -1
  }

  const typing = () => Date.now() - typed.current.at <= TYPEAHEAD_MS

  const onKeyDown = (event) => {
    const { key } = event
    const last = options.length - 1

    // Cualquier tecla que no escribe —flechas, Enter, Escape…— corta la búsqueda
    // en curso. Sin esto, «q», Enter y volver a abrir con «nu» buscaría «qnu» y
    // no encontraría nada.
    if (!isPrintable(event)) typed.current = { text: '', at: 0 }

    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
        event.preventDefault()
        openAt(selected >= 0 ? selected : 0)
      } else if (isPrintable(event)) {
        const match = search(key, selected)
        if (match >= 0) {
          event.preventDefault()
          openAt(match)
        }
      }
      return
    }

    // Un espacio en mitad de una búsqueda es parte de lo buscado («nuevo l»), no
    // la orden de elegir.
    if (key === ' ' && typing()) {
      event.preventDefault()
      const match = search(key, active)
      if (match >= 0) setActive(match)
      return
    }

    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        setActive((index) => Math.min(index + 1, last))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActive((index) => Math.max(index - 1, 0))
        break
      case 'Home':
        event.preventDefault()
        setActive(0)
        break
      case 'End':
        event.preventDefault()
        setActive(last)
        break
      case 'PageDown':
        event.preventDefault()
        setActive((index) => Math.min(index + 10, last))
        break
      case 'PageUp':
        event.preventDefault()
        setActive((index) => Math.max(index - 10, 0))
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(active)
        break
      case 'Tab':
        // Sin preventDefault: se elige y el foco sigue su camino.
        choose(active)
        break
      case 'Escape':
        // Se para aquí: dentro del modal de acceso, el mismo Escape llegaría al
        // document y cerraría el diálogo entero. Con la lista abierta, Escape
        // cierra la lista y nada más.
        event.preventDefault()
        event.stopPropagation()
        setOpen(false)
        break
      default:
        if (isPrintable(event)) {
          event.preventDefault()
          const match = search(key, active)
          if (match >= 0) setActive(match)
        }
    }
  }

  // Solo el ratón o el dedo abren y cierran con el clic. Enter y Espacio también
  // disparan `click` en un botón —con `detail` 0—, pero esos ya los resolvió
  // onKeyDown; atenderlos aquí otra vez cerraría lo que acaba de abrirse.
  const onClick = (event) => {
    if (event.detail === 0) return
    typed.current = { text: '', at: 0 }
    if (open) setOpen(false)
    else openAt(selected >= 0 ? selected : 0)
  }

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        name={name}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={shown}
        aria-controls={shown ? listId : undefined}
        aria-activedescendant={shown && active >= 0 ? optionId(active) : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        onKeyDown={onKeyDown}
        onClick={onClick}
        className={`${INPUT} ${toneClass} flex cursor-pointer items-center justify-between gap-2 text-left aria-expanded:border-paper`}
      >
        <span className={`truncate ${value ? '' : 'text-sand'}`}>{value || placeholder}</span>
        <ChevronDown
          size={15}
          strokeWidth={1.5}
          aria-hidden="true"
          className={`shrink-0 text-sand transition-transform ${shown ? 'rotate-180 text-paper' : ''}`}
        />
      </button>

      {shown && (
        // La posición va en un envoltorio y no en el marco —Frame lleva
        // `relative` fijo y ganaría la cascada—, y los 10px de separación son los
        // de NavMenu y AccountMenu: las marcas sobresalen 6px y chocarían con el
        // borde del campo. `z-20` para quedar sobre los campos de debajo, que
        // también son posicionados.
        <div
          className={`absolute inset-x-0 z-20 ${upward ? 'bottom-[calc(100%+10px)]' : 'top-[calc(100%+10px)]'}`}
        >
          <Frame ref={panelRef} className="animate-panel-in">
            {/* El scroll va en la lista y no en el marco: el marco recortaría sus
                marcas. La barra, fina y del color del riel: la del sistema es
                clara y rompería el panel. */}
            <ul
              id={listId}
              role="listbox"
              aria-labelledby={labelId}
              tabIndex={-1}
              style={{ maxHeight: LIST_MAX }}
              className="overflow-y-auto py-[5px] [scrollbar-color:var(--color-rail)_transparent] [scrollbar-width:thin]"
            >
              {options.map((option, index) => {
                const isSelected = index === selected

                return (
                  <li
                    key={option}
                    id={optionId(index)}
                    role="option"
                    aria-selected={isSelected}
                    // Cancelar el mousedown es lo que deja el foco en el
                    // disparador mientras se elige con el ratón.
                    onMouseDown={(event) => event.preventDefault()}
                    // mousemove y no mouseenter: al bajar con las flechas la
                    // lista se desplaza bajo un ratón quieto, y mouseenter le
                    // robaría la opción activa al teclado.
                    onMouseMove={() => {
                      if (active !== index) setActive(index)
                    }}
                    onClick={() => choose(index)}
                    className={`${OPTION} ${index === active ? 'bg-hover text-on-hover' : 'text-paper'}`}
                  >
                    <span className="truncate">{option}</span>
                    {isSelected && (
                      <Check size={14} strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-gold" />
                    )}
                  </li>
                )
              })}
            </ul>
          </Frame>
        </div>
      )}
    </>
  )
}

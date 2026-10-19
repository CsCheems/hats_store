import { ChevronDown } from 'lucide-react'
import { useId } from 'react'
import { Link } from 'react-router-dom'
import { catalogCopy, catalogPath } from '../../data/catalog'
import { useDismissable } from '../../hooks/useDismissable'
import { Frame } from '../ui/Frame'

const TRIGGER =
  'flex cursor-pointer items-center gap-[5px] border-b py-[6px] transition-colors hover:border-gold'

const ITEM =
  'block px-[14px] py-[10px] text-[13px] font-semibold tracking-[.14em] uppercase transition-colors hover:bg-hover hover:text-on-hover'

/**
 * Un menú del navbar con su desplegable.
 *
 * SE ABRE CON CLIC Y NO CON HOVER. Un menú de hover necesita temporizadores de
 * apertura y cierre y un triángulo de seguridad para el recorrido en diagonal
 * —y clic de todas formas, porque en táctil no hay hover—: es una segunda
 * mecánica de cierre viviendo al lado de la que ya tenemos. A cambio,
 * `aria-expanded` + Escape + devolución del foco es un contrato completo.
 *
 * Quién está abierto lo decide el navbar con UNA clave. Cada instancia llama a
 * useDismissable por su cuenta, pero la primera línea de ese hook es
 * `if (!open) return`, así que como mucho una tiene escuchas puestas. Y como el
 * menú de cuenta y la hamburguesa usan el mismo hook, abrir cualquiera cierra a
 * los demás sin una línea de coordinación.
 *
 * El envoltorio es `relative` y de alto completo por dos razones a la vez: el
 * panel se alinea a SU disparador y no al borde de la fila, y `h-full` es lo
 * que hace que `top-full` caiga al fondo de la fila de 78px en vez de a 25px
 * bajo el texto.
 */
export function NavMenu({ item, open, onToggle, onClose }) {
  const panelId = useId()
  const { triggerRef, panelRef } = useDismissable({ open, onClose })

  return (
    <div className="relative flex h-full items-center">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={onToggle}
        className={`${TRIGGER} ${open ? 'border-gold text-paper' : 'border-transparent text-paper'}`}
      >
        {item.label}
        <ChevronDown
          size={14}
          strokeWidth={1.8}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-[200px]">
          <Frame ref={panelRef} id={panelId} className="animate-panel-in py-[4px]">
            {item.params && (
              <Link to={catalogPath(item.params)} onClick={onClose} className={`${ITEM} text-paper`}>
                {catalogCopy.verTodo(item.label)}
              </Link>
            )}

            {item.children.map((child) => (
              <Link
                key={child.label}
                // Los hijos llevan solo el delta y aquí se fusiona con lo del
                // padre: «Fieltro ▸ 6X» es la categoría de arriba más el grado
                // de abajo.
                to={catalogPath({ ...item.params, ...child.params })}
                // Se cierra sin devolver el foco, al revés que AccountMenu: allí
                // las acciones te dejan en la página, y aquí estás navegando.
                onClick={onClose}
                className={`${ITEM} text-paper`}
              >
                {child.label}
              </Link>
            ))}
          </Frame>
        </div>
      )}
    </div>
  )
}

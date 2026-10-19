import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { catalogCopy, catalogPath } from '../../data/catalog'
import { NavMobileSearch, NavMobileTools } from './NavMobileTools'

const ENTRADA =
  'flex w-full items-center justify-between border-b border-transparent py-3 text-left transition-colors hover:border-gold'

const HIJO =
  'block border-b-2 border-transparent py-[8px] pl-3 text-[13px] tracking-wide text-sand uppercase transition-colors hover:border-gold hover:text-paper'

// La misma regla de 2px que separa las secciones del menú de cuenta.
function Division() {
  return <div aria-hidden="true" className="h-px bg-rail" />
}

/**
 * El navbar por debajo de `xl`: el panel de la hamburguesa. De arriba abajo, en
 * tres bloques separados por una regla: el buscador, las entradas del navbar en
 * acordeón, y cuenta y bolsa. Esos tres controles viven aquí y no en la barra
 * porque a 390px la barra no da para más que el logo, el tema y la hamburguesa.
 *
 * NO LLEVA MECÁNICA DE CIERRE PROPIA, y no es un olvido: el panel que lo contiene
 * ya vive dentro de una instancia de useDismissable en Navbar, así que el clic
 * fuera y el Escape ya están puestos. Esto es un desplegable puro — qué sección
 * está abierta y nada más—, con el mismo modismo de clave única que arriba.
 *
 * `closeMenu` cierra el panel entero al navegar: quien pulsa un enlace ya no
 * quiere seguir viendo el menú.
 */
export function NavMobileMenu({ links, closeMenu, bagCount }) {
  const [abierto, setAbierto] = useState(null)
  const base = useId()

  return (
    <div className="mx-auto flex max-w-shell flex-col">
      <div className="pb-3">
        <NavMobileSearch closeMenu={closeMenu} />
      </div>

      <Division />

      {links.map((item) => {
        if (!item.children) {
          return (
            <Link key={item.key} to={item.to} onClick={closeMenu} className={`${ENTRADA} text-paper`}>
              {item.label}
            </Link>
          )
        }

        const desplegado = abierto === item.key
        const panelId = `${base}-${item.key}`

        return (
          <div key={item.key}>
            <button
              type="button"
              aria-expanded={desplegado}
              aria-controls={panelId}
              onClick={() => setAbierto((actual) => (actual === item.key ? null : item.key))}
              className={`${ENTRADA} cursor-pointer text-paper`}
            >
              {item.label}
              <ChevronDown
                size={15}
                strokeWidth={1.8}
                className={`transition-transform ${desplegado ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Los grados van en rejilla de cuatro columnas y no en lista: siete
                hijos en columna alargan el panel más que un teléfono, y eso
                abría una segunda barra de desplazamiento dentro del menú. */}
            <div id={panelId} hidden={!desplegado} className="grid grid-cols-4 pb-2">
              {item.params && (
                <Link to={catalogPath(item.params)} onClick={closeMenu} className={`${HIJO} col-span-4`}>
                  {catalogCopy.verTodo(item.label)}
                </Link>
              )}

              {item.children.map((child) => (
                <Link
                  key={child.label}
                  to={catalogPath({ ...item.params, ...child.params })}
                  onClick={closeMenu}
                  className={HIJO}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        )
      })}

      <Division />

      <NavMobileTools bagCount={bagCount} closeMenu={closeMenu} />
    </div>
  )
}

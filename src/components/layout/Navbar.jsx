import { Menu, ShoppingBag, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { navLinks } from '../../data/site'
import { useDismissable } from '../../hooks/useDismissable'
import { IconButton } from '../ui/IconButton'
import { Logo } from '../ui/Logo'
import { ThemeToggle } from '../ui/ThemeToggle'
import { AccountMenu } from './AccountMenu'
import { NavMenu } from './NavMenu'
import { NavMobileMenu } from './NavMobileMenu'
import { NavSearch } from './NavSearch'

const LINK =
  'border-b border-transparent py-[6px] transition-colors hover:border-gold'

// El contador es parte del diseño, no del estado de un carrito: el handoff
// deja la bolsa como UI. Cuando exista carrito, viene de ahí.
const BAG_COUNT = 3

// `Link` y no un ancla: el logo es la forma de volver a la portada desde /perfil
// o /catalogo, y con un `href` se recargaría el sitio entero para nada.
//
function BrandMark() {
  return (
    <Link to="/" aria-label="Nicol Hats International, inicio" className="mr-auto shrink-0">
      <Logo className="text-paper" />
    </Link>
  )
}

/**
 * Navbar pegajoso, fondo plano y una línea fina debajo. Por debajo de `xl` las entradas pasan al
 * acordeón de la hamburguesa.
 *
 * QUIÉN ESTÁ ABIERTO ES UNA CLAVE, NO VARIOS BOOLEANOS. Con un booleano por menú
 * habría que acordarse de apagar los otros en cada apertura, y el primer olvido
 * deja dos paneles encima. Con una clave, abrir es escribir un nombre. Hoy solo
 * «Fieltro» despliega, pero el patrón no cambia si se añade otro.
 *
 * La forma de actualizador en `setOpenMenu` tampoco es opcional: al pulsar el
 * disparador B con A abierto, el `pointerdown` de useDismissable cierra A y el
 * `click` abre B en el mismo tick. Con un valor plano las dos actualizaciones se
 * pisan; con el actualizador, la segunda ve lo que dejó la primera.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [buscando, setBuscando] = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const closeMenus = useCallback(() => setOpenMenu(null), [])

  // El disparador y el panel no comparten padre —el botón vive en el grupo de
  // controles y el panel cuelga del header—, de ahí las dos refs.
  const { triggerRef, panelRef } = useDismissable({ open: menuOpen, onClose: closeMenu })

  return (
    <header className="sticky top-0 z-30 border-b border-rail bg-ink">
      {/* La fila va a todo el ancho, sin `max-w-shell`: el logo queda en el
          extremo izquierdo de la ventana y todo lo demás —enlaces, buscador,
          iconos— en el derecho, a cualquier ancho. `relative` para que el panel
          del menú de cuenta cuelgue de esta fila y no del header: `right-gutter`
          lo alinea con el borde derecho de los iconos. */}
      <div className="relative flex h-[78px] items-center gap-[clamp(14px,2.2vw,40px)] px-gutter">
        <BrandMark />

        {/* `h-full`: es contra este alto contra el que resuelve el `h-full` de
            cada NavMenu, y de ahí que sus paneles caigan al fondo de la fila. */}
        <nav className="hidden h-full shrink-0 items-center gap-[clamp(16px,2vw,36px)] text-[13px] font-medium tracking-[.18em] whitespace-nowrap uppercase xl:flex">
          {navLinks.map((item) =>
            item.children ? (
              <NavMenu
                key={item.key}
                item={item}
                open={openMenu === item.key}
                onToggle={() => setOpenMenu((actual) => (actual === item.key ? null : item.key))}
                onClose={closeMenus}
              />
            ) : (
              <Link key={item.key} to={item.to} className={`${LINK} text-paper`}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* El buscador va PRIMERO del grupo y los demás controles detrás: al
            ensancharse, los enlaces de la izquierda se recorren y los iconos de
            la derecha se quedan donde están (ver NavSearch). */}
        <div className="flex shrink-0 items-center gap-1">
          {/* Buscador, cuenta y bolsa solo existen en la barra desde `xl`; por
              debajo viven dentro del menú de la hamburguesa (NavMobileTools).
              `hidden xl:contents`: `contents` los deja como hijos directos de la
              fila, sin caja propia, y por debajo de `xl` no se renderizan. */}
          <div className="hidden xl:contents">
            <NavSearch open={buscando} onOpenChange={setBuscando} />
          </div>

          {/* El tema se queda en la barra a cualquier ancho: es un solo icono. */}
          <ThemeToggle />

          <div className="hidden xl:contents">
            <AccountMenu />

            <button
              type="button"
              aria-label={`Bolsa de compra, ${BAG_COUNT} artículos`}
              className="flex h-[38px] shrink-0 cursor-pointer items-center gap-[6px] px-[10px] text-[13px] font-semibold whitespace-nowrap text-paper transition-colors hover:text-gold"
            >
              <ShoppingBag size={17} strokeWidth={1.5} />
              <span>{BAG_COUNT}</span>
            </button>
          </div>

          <IconButton
            ref={triggerRef}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="xl:hidden"
          >
            {menuOpen ? <X size={17} strokeWidth={1.5} /> : <Menu size={17} strokeWidth={1.5} />}
          </IconButton>
        </div>
      </div>

      {menuOpen && (
        // El menú está compactado para caber en un teléfono, pero en una
        // pantalla muy baja (horizontal) puede pasarse: entonces scrollea por
        // dentro, sin barra visible, para no abrir un segundo carril de scroll.
        <nav
          ref={panelRef}
          className="max-h-[calc(100dvh-80px)] overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-t border-rail bg-ink px-gutter py-4 text-[13px] font-medium tracking-[.18em] uppercase xl:hidden"
        >
          <NavMobileMenu links={navLinks} closeMenu={closeMenu} bagCount={BAG_COUNT} />
        </nav>
      )}
    </header>
  )
}

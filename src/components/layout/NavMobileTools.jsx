import { Bookmark, ChevronDown, LayoutDashboard, LogOut, Package, Search, SendHorizontal, ShoppingBag, User, UserRound } from 'lucide-react'
import { useId, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { accountMenu } from '../../data/auth'
import { catalogPath } from '../../data/catalog'
import { useSignOut } from '../../hooks/useSignOut'

const ICONS = { orders: Package, saved: Bookmark, profile: UserRound, admin: LayoutDashboard }

// Las dos herramientas comparten celda: misma altura, mismo hover que las
// entradas del acordeón.
const CELDA =
  'flex min-w-0 items-center justify-center gap-[8px] border-b border-transparent py-3 transition-colors hover:border-gold'

const SUBENTRADA =
  'flex w-full items-center gap-[10px] border-b border-transparent py-[10px] pl-3 text-[12px] tracking-[.16em] text-sand uppercase transition-colors hover:border-gold hover:text-paper'

/**
 * El buscador del menú móvil: una caja siempre abierta, a lo ancho del panel.
 * Por debajo de `xl` no hay enlaces que recorrer, así que la animación del
 * buscador de escritorio (NavSearch) no tendría qué mover; aquí basta el campo.
 *
 * Enter lleva a `/catalogo?q=` igual que NavSearch. Con el campo vacío no hace
 * nada: el menú se queda abierto.
 */
export function NavMobileSearch({ closeMenu }) {
  const navigate = useNavigate()
  const [texto, setTexto] = useState('')

  const consulta = texto.trim()

  const onSubmit = (event) => {
    event.preventDefault()
    if (!consulta) return

    closeMenu()
    navigate(catalogPath({ q: consulta }))
  }

  return (
    <form role="search" onSubmit={onSubmit} className="flex h-[42px] items-center border border-edge">
      <input
        type="text"
        value={texto}
        onChange={(event) => setTexto(event.target.value)}
        placeholder="Buscar sombreros"
        aria-label="Buscar sombreros"
        autoComplete="off"
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-[16px] font-normal tracking-normal text-paper normal-case placeholder:text-sand focus-visible:outline-none"
      />
      {/* Vacío es una lupa que no envía; con texto, un icono de enviar. */}
      <button
        type={consulta ? 'submit' : 'button'}
        aria-label={consulta ? 'Enviar búsqueda' : 'Buscar'}
        className="grid h-full w-[38px] shrink-0 cursor-pointer place-items-center text-paper transition-colors hover:text-gold"
      >
        {consulta ? <SendHorizontal size={17} strokeWidth={1.5} /> : <Search size={17} strokeWidth={1.5} />}
      </button>
    </form>
  )
}

/**
 * Cuenta y bolsa, lado a lado y separadas por una regla vertical. Sin sesión,
 * «Entrar» abre el modal de acceso; con sesión, la cuenta despliega debajo de la
 * fila el mismo contenido que el menú de escritorio.
 *
 * Mientras no se sabe si hay sesión (`status === 'checking'`) la celda de cuenta
 * se reserva vacía, por la misma razón que en AccountMenu: no afirmar «no hay
 * sesión» antes de saberlo.
 */
export function NavMobileTools({ bagCount, closeMenu }) {
  const { user, status, openAuth } = useAuth()
  const [desplegado, setDesplegado] = useState(false)
  const panelId = useId()
  const signOut = useSignOut(closeMenu)

  const nombre = user ? user.nombre : 'Entrar'

  return (
    <div>
      <div className="grid grid-cols-2">
        {status === 'checking' ? (
          <span aria-hidden="true" className={CELDA} />
        ) : (
          <button
            type="button"
            aria-expanded={user ? desplegado : undefined}
            aria-controls={user ? panelId : undefined}
            onClick={
              user
                ? () => setDesplegado((actual) => !actual)
                : () => {
                    closeMenu()
                    openAuth('login')
                  }
            }
            className={`${CELDA} cursor-pointer text-paper`}
          >
            {user ? (
              <span className="text-[13px] font-semibold tracking-[.06em]">
                {`${user.nombre[0]}${user.apellido[0]}`.toUpperCase()}
              </span>
            ) : (
              <User size={17} strokeWidth={1.5} />
            )}
            <span className="truncate">{nombre}</span>
            {user && (
              <ChevronDown
                size={15}
                strokeWidth={1.8}
                className={`shrink-0 transition-transform ${desplegado ? 'rotate-180' : ''}`}
              />
            )}
          </button>
        )}

        {/* La regla vertical cuelga de la segunda celda para que no haga falta un
            hijo extra en la rejilla. */}
        <button
          type="button"
          aria-label={`Bolsa de compra, ${bagCount} artículos`}
          className={`${CELDA} cursor-pointer border-l border-l-rail text-paper`}
        >
          <ShoppingBag size={17} strokeWidth={1.5} />
          <span>Bolsa</span>
          <span>{bagCount}</span>
        </button>
      </div>

      {user && (
        <div id={panelId} hidden={!desplegado} className="pb-2">
          <p className="truncate py-[10px] pl-3 text-[13px] font-normal tracking-normal text-sand normal-case">
            {user.email}
          </p>

          {accountMenu.map((item) => {
            // Mismo criterio que AccountMenu: esconder no protege nada, solo no
            // enseña una puerta que el servidor va a cerrar.
            if (item.soloAdmin && user.rol !== 'admin') return null

            const Icon = ICONS[item.icon]
            const Tag = item.to ? Link : 'a'
            const target = item.to ? { to: item.to } : { href: item.href }

            return (
              <Tag key={item.label} {...target} onClick={closeMenu} className={SUBENTRADA}>
                <Icon size={15} strokeWidth={1.5} className="shrink-0" />
                {item.label}
              </Tag>
            )
          })}

          <button type="button" onClick={signOut} className={`${SUBENTRADA} cursor-pointer`}>
            <LogOut size={15} strokeWidth={1.5} className="shrink-0" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}

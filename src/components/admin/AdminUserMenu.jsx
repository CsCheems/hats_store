import { ChevronDown, LogOut, Store } from 'lucide-react'
import { useCallback, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { adminUserMenu } from '../../data/admin'
import { authToasts } from '../../data/auth'
import { useDismissable } from '../../hooks/useDismissable'

const ICONS = { site: Store }

const ITEM = 'flex w-full items-center gap-[10px] px-[13px] py-[10px] text-[13px] transition-colors'

const ITEM_TONES = {
  link: 'text-admin-ink hover:bg-admin-canvas',
  danger: 'text-admin-muted hover:bg-admin-warn/10 hover:text-admin-warn',
}

/**
 * El menú de quien administra, arriba a la izquierda.
 *
 * Es el primo de AccountMenu y le copia dos cosas a conciencia: el
 * `closeAndReturn`, que devuelve el foco al botón al cerrar desde dentro del
 * panel —si no, se queda en el aire—, y el cierre de sesión con try/catch que
 * distingue «cerrada aquí y en el servidor» de «cerrada solo aquí». Esa
 * distinción vale igual en el panel; en una computadora compartida, más.
 *
 * Lo que NO copia es el aspecto: aquel es una placa de Frame con marcas de
 * registro sobre oscuro, y este una tarjeta blanca con radio. Misma mecánica,
 * otro sistema de diseño. Por eso son dos archivos y no uno con una prop.
 *
 * `useDismissable` sí se reutiliza tal cual: el clic fuera y el Escape se
 * comportan igual en cualquier sitio.
 */
export function AdminUserMenu() {
  const { user, logout } = useAuth()
  const { pushToast } = useToast()

  const [open, setOpen] = useState(false)
  const panelId = useId()

  const close = useCallback(() => setOpen(false), [])
  const { triggerRef, panelRef } = useDismissable({ open, onClose: close })

  const closeAndReturn = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [triggerRef])

  const signOut = useCallback(async () => {
    closeAndReturn()

    try {
      await logout()
      pushToast(authToasts.logout)
    } catch {
      pushToast(authToasts.logoutLocalOnly)
    }
  }, [closeAndReturn, logout, pushToast])

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((shown) => !shown)}
        className="flex cursor-pointer items-center gap-[10px] rounded-admin py-[6px] pr-[8px] pl-[6px] text-left transition-colors hover:bg-admin-slate"
      >
        <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-admin bg-admin-blue text-[11px] tracking-[.04em] text-admin-bright">
          {`${user.nombre[0]}${user.apellido[0]}`.toUpperCase()}
        </span>

        {/* El nombre se cae por debajo de sm: las iniciales ya identifican, y en
            un teléfono ese espacio lo necesita el logo. */}
        <span className="hidden max-w-[160px] truncate text-[13px] text-admin-bright sm:block">
          {`${user.nombre} ${user.apellido}`}
        </span>

        <ChevronDown
          size={15}
          strokeWidth={1.5}
          className={`shrink-0 text-admin-sidebar transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          className="animate-panel-in absolute top-[calc(100%+8px)] left-0 z-40 w-[236px] overflow-hidden rounded-admin border border-admin-line bg-admin-card shadow-admin"
        >
          <div className="px-[13px] py-[11px]">
            <p className="truncate text-[13px] text-admin-ink">{`${user.nombre} ${user.apellido}`}</p>
            <p className="mt-[2px] truncate text-[11px] text-admin-muted">{user.email}</p>
          </div>

          <div className="h-px bg-admin-line" />

          <div className="py-1">
            {adminUserMenu.map((item) => {
              const Icon = ICONS[item.icon]

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeAndReturn}
                  className={`${ITEM} ${ITEM_TONES.link}`}
                >
                  <Icon size={15} strokeWidth={1.5} className="shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="h-px bg-admin-line" />

          <button
            type="button"
            onClick={signOut}
            className={`${ITEM} cursor-pointer ${ITEM_TONES.danger}`}
          >
            <LogOut size={15} strokeWidth={1.5} className="shrink-0" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}

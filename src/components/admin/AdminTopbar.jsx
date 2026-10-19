import { Link } from 'react-router-dom'
import { adminHeader } from '../../data/admin'
import { AdminUserMenu } from './AdminUserMenu'

/**
 * La barra superior: el usuario a la IZQUIERDA y el logo a la DERECHA.
 *
 * Es al revés de lo que hace casi todo panel, y es deliberado — así se pidió—.
 * Queda anotado aquí para que dentro de seis meses no se «arregle» pensando que
 * fue un descuido.
 *
 * Sesenta píxeles de alto, y ese número aparece también en el `lg:top-[60px]` y
 * el `lg:h-[calc(100vh-60px)]` de AdminSidebar: si cambia aquí, cambia allá.
 *
 * El logo lleva a /admin y no a la portada. Dentro del panel, «casa» es el
 * resumen; para salir del panel está la entrada del menú de usuario, que lo dice
 * con todas sus letras en vez de hacerlo por sorpresa desde el logo.
 */
export function AdminTopbar() {
  return (
    <header className="sticky top-0 z-30 h-[60px] border-b border-admin-slate bg-admin-navy">
      <div className="flex h-full items-center justify-between gap-4 px-[clamp(12px,2vw,24px)]">
        <AdminUserMenu />

        <div className="flex min-w-0 items-center gap-[14px]">
          <span className="hidden truncate text-[11px] tracking-label text-admin-sidebar uppercase md:block">
            {adminHeader}
          </span>
          <span className="hidden h-[22px] w-px bg-admin-slate md:block" />

          {/* El nombre en texto y con la tipografía del panel: nada de
              components/admin importa de ui/, así que el logotipo de la tienda
              (Rye, sombrero, tablones) no cruza esta frontera. */}
          <Link
            to="/admin"
            className="shrink-0 text-[17px] font-semibold tracking-[.02em] text-admin-bright"
            aria-label="Nicol Hats, resumen del panel"
          >
            Nicol Hats
          </Link>
        </div>
      </div>
    </header>
  )
}

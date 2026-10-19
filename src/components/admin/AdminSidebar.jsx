import { Archive, Boxes, LayoutDashboard, Shapes, Tag } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { adminSidebar } from '../../data/admin'
import { formatInteger } from '../../utils/format'

const ICONS = { home: LayoutDashboard, boxes: Boxes, archive: Archive, tag: Tag, shapes: Shapes }

const ITEM =
  'flex shrink-0 items-center gap-[10px] rounded-admin px-3 py-[9px] text-[13px] whitespace-nowrap transition-colors'

const TONES = {
  idle: 'text-admin-sidebar hover:bg-admin-slate hover:text-admin-bright',
  active: 'bg-admin-blue text-admin-bright',
}

/**
 * El menú lateral.
 *
 * `NavLink` y no `Link`: el estado activo lo resuelve el router comparando con
 * la URL, así que no hay que escribirlo ni mantenerlo, y sigue siendo correcto
 * cuando se llega escribiendo la dirección a mano.
 *
 * El `end` de cada entrada es lo que impide que se marquen varias a la vez:
 * `/admin` es prefijo de todo lo demás y `/admin/productos` lo es de cada
 * categoría, así que sin él las tres entradas se encenderían juntas al abrir
 * botas.
 *
 * Los rótulos y las cuentas de las categorías vienen del servidor, no de
 * data/admin.js: son datos del catálogo. Una categoría nueva sale aquí sin tocar
 * el frontend, que es la diferencia entre un dato y una cadena de interfaz.
 *
 * Un solo componente para las dos formas. Por encima de `lg` es una columna
 * pegada bajo la barra; por debajo, una fila que se desplaza en horizontal
 * DENTRO de sí misma —de ahí el overflow— para no arrastrar a la página. Un
 * cajón deslizante sería otra pieza, con su foco y su Escape.
 */
export function AdminSidebar({ categorias }) {
  return (
    <nav
      aria-label="Secciones del panel"
      className="border-b border-admin-slate bg-admin-navy lg:sticky lg:top-[60px] lg:h-[calc(100vh-60px)] lg:w-[248px] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0"
    >
      <div className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-col lg:overflow-x-visible">
        {adminSidebar.fijos.map((entrada) => {
          const Icon = ICONS[entrada.icon]

          return (
            <NavLink
              key={entrada.to}
              to={entrada.to}
              end
              className={({ isActive }) => `${ITEM} ${isActive ? TONES.active : TONES.idle}`}
            >
              <Icon size={16} strokeWidth={1.5} className="shrink-0" />
              {entrada.label}
            </NavLink>
          )
        })}

        {/* El rótulo del grupo solo tiene sentido encima de una columna. En la
            fila horizontal sería una etiqueta suelta entre botones. */}
        <span className="mt-4 mb-1 hidden px-3 text-[11px] tracking-label text-admin-sidebar/60 uppercase lg:block">
          {adminSidebar.categorias}
        </span>

        {/* Mientras las categorías no llegan no se pinta nada en su sitio: son
            enlaces, y un enlace fantasma se puede pulsar. Las dos entradas fijas
            de arriba ya dejan el menú utilizable entretanto. */}
        {categorias?.map((categoria) => (
          <NavLink
            key={categoria.id}
            to={`${adminSidebar.base}/${categoria.id}`}
            end
            className={({ isActive }) =>
              `${ITEM} lg:pl-[38px] ${isActive ? TONES.active : TONES.idle}`
            }
          >
            {categoria.label}
            <span className="text-[11px] tabular-nums opacity-70 lg:ml-auto">
              {formatInteger(categoria.count)}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

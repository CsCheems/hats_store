import { Outlet } from 'react-router-dom'
import { useApiResource } from '../../hooks/useApiResource'
import { getCategories } from '../../services/admin'
import { AdminSidebar } from './AdminSidebar'
import { AdminTopbar } from './AdminTopbar'

/**
 * La cáscara del panel, equivalente a lo que en la tienda son AnnouncementBar +
 * Navbar + Footer. Lo que cambia entre páginas es el Outlet.
 *
 * Las categorías se piden AQUÍ y no en cada página: el menú lateral está en
 * todas, y pedirlas en cada una las volvería a traer al cambiar de sección. Se
 * le pasa `getCategories` a pelo porque es una función de módulo, y por tanto
 * una referencia estable — que es lo único que useApiResource pide de su fetcher.
 *
 * Si esa petición falla no se pinta ningún error aquí. El menú se queda con sus
 * dos entradas fijas y quien explica lo que pasó es la página, que ha pedido lo
 * suyo y ha fallado por lo mismo. Dos avisos del mismo problema, uno encima del
 * otro, no informan el doble.
 *
 * SIN `overflow-x-hidden`, al revés que la cáscara de la tienda. Aquí la barra y
 * el lateral son sticky, y un overflow en un ancestro los convierte en su propio
 * puerto de desplazamiento y rompe el pegado. Lo ancho —la tabla— se desplaza
 * dentro de su tarjeta, que es donde toca.
 */
export function AdminShell() {
  const { data: categorias, reload: recargarCategorias } = useApiResource(getCategories)

  return (
    <div className="min-h-screen bg-admin-canvas text-admin-ink">
      <AdminTopbar />

      <div className="lg:flex">
        <AdminSidebar categorias={categorias} />

        {/* min-w-0 en el hijo de un flex: sin él, una tabla ancha estira la
            columna en vez de desplazarse dentro, y se lleva la página consigo. */}
        <main className="min-w-0 flex-1 px-[clamp(16px,3vw,32px)] py-[clamp(20px,3vw,34px)]">
          {/* Las categorías bajan también por el contexto del Outlet. No es
              duplicar la petición: es la misma respuesta, y le ahorra a la
              página de productos tener que esperar a la SUYA para saber cómo se
              llama la categoría que ya está pintada y marcada en el lateral. Sin
              esto, el título dice «Todo el inventario» y salta a «Hebillas y
              espuelas» un instante después.

              `recargarCategorias` baja por lo mismo: crear, archivar o
              restaurar cambia las cuentas del lateral, y quien lo sabe es la
              página que lo hizo. */}
          <Outlet context={{ categorias, recargarCategorias }} />
        </main>
      </div>
    </div>
  )
}

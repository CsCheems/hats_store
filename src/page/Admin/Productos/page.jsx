import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { AdminButton } from '../../../components/admin/AdminButton'
import { AdminDialog } from '../../../components/admin/AdminDialog'
import { AdminNotice } from '../../../components/admin/AdminNotice'
import { AdminState } from '../../../components/admin/AdminState'
import { AdminTable } from '../../../components/admin/AdminTable'
import { adminConfirm, adminCopy, adminNotices, adminStates, productColumns } from '../../../data/admin'
import { useApiResource } from '../../../hooks/useApiResource'
import { useRouteNotice } from '../../../hooks/useRouteNotice'
import { archiveProduct, getProducts } from '../../../services/admin'

/**
 * El inventario, entero o de una categoría. Las dos rutas —/admin/productos y
 * /admin/productos/:categoria— comparten esta página: lo único que cambia es un
 * parámetro, y partirlas en dos archivos sería duplicar la tabla para filtrarla.
 *
 * El fetcher se envuelve en useCallback con `categoria` de dependencia, y ahí
 * está toda la mecánica del filtro: al pulsar otra categoría cambia el
 * parámetro, cambia el fetcher, y useApiResource vuelve a pedir por su cuenta.
 * La página no tiene ningún efecto propio ni se acuerda de recargar nada.
 *
 * El rótulo NUNCA se reconstruye a partir de la URL: diría «Hebillas» donde la
 * tienda dice «Hebillas y espuelas». Sale del menú lateral —que ya lo tiene, y
 * por eso baja por el contexto del Outlet— y, si esa petición aún no ha llegado,
 * de la respuesta propia. Mientras no se sepa, el hueco se queda vacío con su
 * alto reservado: preferimos un título en blanco medio segundo a uno que diga
 * «Todo el inventario» y se desdiga.
 *
 * Una categoría inventada en la URL responde 404, y eso se enseña como error con
 * su «no encontramos lo que buscabas», no como una tabla vacía: son dos cosas
 * distintas y la segunda haría pasar por buena una dirección mal escrita.
 *
 * Archivar se confirma y, al terminar, se vuelve a pedir la lista en vez de
 * quitar la fila a mano: lo que se ve es lo que la base confirma. Las cuentas
 * del lateral también cambian, así que se le pide a la cáscara que las recargue.
 */
export default function AdminProductos() {
  const { categoria } = useParams()
  const { categorias, recargarCategorias } = useOutletContext()

  const fetcher = useCallback((options) => getProducts(categoria, options), [categoria])
  const { data, status, error, reload } = useApiResource(fetcher)

  const { aviso: avisoRuta, cerrar: cerrarAvisoRuta } = useRouteNotice()
  const [aviso, setAviso] = useState(null)

  const [aArchivar, setAArchivar] = useState(null)
  const [archivando, setArchivando] = useState(false)

  const delMenu = categorias?.find((entrada) => entrada.id === categoria)?.label
  const titulo = categoria ? (delMenu ?? data?.categoria?.label ?? '') : adminCopy.inventarioTitulo

  const archivar = async () => {
    setArchivando(true)

    try {
      await archiveProduct(aArchivar.id)
      setAviso({ tone: 'good', texto: adminNotices.archivado(aArchivar.titulo) })
      reload()
      recargarCategorias()
    } catch (fallo) {
      setAviso({ tone: 'warn', texto: fallo.message })
    } finally {
      setArchivando(false)
      setAArchivar(null)
    }
  }

  // El aviso de esta página manda sobre el que traía la navegación: es más
  // reciente.
  const visible = aviso ?? (avisoRuta ? { tone: 'good', texto: avisoRuta } : null)
  const cerrarAviso = () => (aviso ? setAviso(null) : cerrarAvisoRuta())

  return (
    <>
      <header className="mb-[18px] flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="min-h-[22px] text-[22px] leading-none text-admin-ink">{titulo}</h1>
          <p className="mt-[6px] min-h-[18px] text-[13px] text-admin-muted">
            {status === 'ready' ? adminCopy.inventarioCuenta(data.items.length) : null}
          </p>
        </div>

        <AdminButton variant="primary" to="/admin/productos/nuevo">
          <Plus size={15} strokeWidth={1.5} />
          {adminCopy.nuevo}
        </AdminButton>
      </header>

      {visible && (
        <AdminNotice tone={visible.tone} onClose={cerrarAviso} className="mb-[14px]">
          {visible.texto}
        </AdminNotice>
      )}

      {status !== 'ready' ? (
        <AdminState status={status} error={error} onRetry={reload} />
      ) : (
        <AdminTable
          columns={productColumns}
          rows={data.items}
          rowKey="id"
          empty={adminStates.vacio}
          renderActions={(fila) => (
            <>
              <AdminButton size="sm" to={`/admin/articulos/${fila.id}`} aria-label={`${adminCopy.editar} ${fila.titulo}`}>
                {adminCopy.editar}
              </AdminButton>
              <AdminButton
                size="sm"
                variant="warn"
                onClick={() => setAArchivar(fila)}
                aria-label={`${adminCopy.archivar} ${fila.titulo}`}
              >
                {adminCopy.archivar}
              </AdminButton>
            </>
          )}
        />
      )}

      <AdminDialog
        open={Boolean(aArchivar)}
        title={adminConfirm.archivar.titulo}
        confirmLabel={adminConfirm.archivar.confirmar}
        pendingLabel={adminConfirm.archivar.pendiente}
        pending={archivando}
        onConfirm={archivar}
        onCancel={() => setAArchivar(null)}
      >
        {aArchivar && adminConfirm.archivar.cuerpo(aArchivar.titulo)}
      </AdminDialog>
    </>
  )
}

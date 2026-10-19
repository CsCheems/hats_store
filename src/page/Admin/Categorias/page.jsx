import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { AdminButton } from '../../../components/admin/AdminButton'
import { AdminDialog } from '../../../components/admin/AdminDialog'
import { AdminNotice } from '../../../components/admin/AdminNotice'
import { AdminState } from '../../../components/admin/AdminState'
import { AdminTable } from '../../../components/admin/AdminTable'
import { adminConfirm, adminCopy, adminNotices, categoryColumns } from '../../../data/admin'
import { useApiResource } from '../../../hooks/useApiResource'
import { useRouteNotice } from '../../../hooks/useRouteNotice'
import { deleteCategory, getCategories } from '../../../services/admin'

/**
 * Las categorías: prefijo del SKU, qué atributos usan, qué marcas las trabajan
 * y cuántos artículos tienen.
 *
 * Es la misma lista que pinta el menú lateral —GET /admin/categories trae
 * también lo que esta sección necesita—, pero se pide aquí otra vez: la cáscara
 * solo baja los datos, no si están cargando o fallaron, y esta página tiene que
 * poder decirlo. Después de borrar recarga las dos.
 */
export default function AdminCategorias() {
  const { recargarCategorias } = useOutletContext()
  const { data, status, error, reload } = useApiResource(getCategories)

  const { aviso: avisoRuta, cerrar: cerrarAvisoRuta } = useRouteNotice()
  const [aviso, setAviso] = useState(null)

  const [aBorrar, setABorrar] = useState(null)
  const [borrando, setBorrando] = useState(false)

  const borrar = async () => {
    setBorrando(true)

    try {
      await deleteCategory(aBorrar.id)
      setAviso({ tone: 'good', texto: adminNotices.categoriaBorrada(aBorrar.label) })
      reload()
      recargarCategorias()
    } catch (fallo) {
      setAviso({ tone: 'warn', texto: fallo.message })
    } finally {
      setBorrando(false)
      setABorrar(null)
    }
  }

  const visible = aviso ?? (avisoRuta ? { tone: 'good', texto: avisoRuta } : null)
  const cerrarAviso = () => (aviso ? setAviso(null) : cerrarAvisoRuta())

  return (
    <>
      <header className="mb-[18px] flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 max-w-[68ch]">
          <h1 className="text-[22px] leading-none text-admin-ink">{adminCopy.categoriasTitulo}</h1>
          <p className="mt-[8px] text-[13px] leading-[1.5] text-admin-muted">{adminCopy.categoriasIntro}</p>
        </div>

        <AdminButton variant="primary" to="/admin/categorias/nueva">
          <Plus size={15} strokeWidth={1.5} />
          {adminCopy.nuevaCategoria}
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
          columns={categoryColumns}
          rows={data}
          rowKey="id"
          empty={adminCopy.categoriasVacio}
          renderActions={(fila) => (
            <>
              <AdminButton
                size="sm"
                to={`/admin/categorias/${fila.id}/editar`}
                aria-label={`${adminCopy.editar} ${fila.label}`}
              >
                {adminCopy.editar}
              </AdminButton>
              {fila.borrable && (
                <AdminButton
                  size="sm"
                  variant="warn"
                  onClick={() => setABorrar(fila)}
                  aria-label={`${adminCopy.borrar} ${fila.label}`}
                >
                  {adminCopy.borrar}
                </AdminButton>
              )}
            </>
          )}
        />
      )}

      <AdminDialog
        open={Boolean(aBorrar)}
        title={adminConfirm.borrarCategoria.titulo}
        confirmLabel={adminConfirm.borrarCategoria.confirmar}
        pendingLabel={adminConfirm.borrarCategoria.pendiente}
        pending={borrando}
        onConfirm={borrar}
        onCancel={() => setABorrar(null)}
      >
        {aBorrar && adminConfirm.borrarCategoria.cuerpo(aBorrar.label)}
      </AdminDialog>
    </>
  )
}

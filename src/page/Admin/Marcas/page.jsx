import { Plus } from 'lucide-react'
import { useState } from 'react'
import { AdminButton } from '../../../components/admin/AdminButton'
import { AdminDialog } from '../../../components/admin/AdminDialog'
import { AdminNotice } from '../../../components/admin/AdminNotice'
import { AdminState } from '../../../components/admin/AdminState'
import { AdminTable } from '../../../components/admin/AdminTable'
import { adminConfirm, adminCopy, adminNotices, brandColumns } from '../../../data/admin'
import { useApiResource } from '../../../hooks/useApiResource'
import { useRouteNotice } from '../../../hooks/useRouteNotice'
import { deleteBrand, getBrands } from '../../../services/admin'

/**
 * Las marcas: qué categorías trabaja cada una, cuántos artículos tiene y si ya
 * sale en la tienda.
 *
 * «Borrar» solo aparece donde se puede —marcas sin artículos, archivados
 * incluidos— en vez de aparecer siempre y fallar: la introducción dice la regla,
 * y el servidor la vuelve a imponer.
 *
 * Como en el inventario, después de borrar se vuelve a pedir la lista en vez de
 * quitar la fila a mano.
 */
export default function AdminMarcas() {
  const { data, status, error, reload } = useApiResource(getBrands)

  const { aviso: avisoRuta, cerrar: cerrarAvisoRuta } = useRouteNotice()
  const [aviso, setAviso] = useState(null)

  const [aBorrar, setABorrar] = useState(null)
  const [borrando, setBorrando] = useState(false)

  const borrar = async () => {
    setBorrando(true)

    try {
      await deleteBrand(aBorrar.id)
      setAviso({ tone: 'good', texto: adminNotices.marcaBorrada(aBorrar.label) })
      reload()
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
          <h1 className="text-[22px] leading-none text-admin-ink">{adminCopy.marcasTitulo}</h1>
          <p className="mt-[8px] text-[13px] leading-[1.5] text-admin-muted">{adminCopy.marcasIntro}</p>
        </div>

        <AdminButton variant="primary" to="/admin/marcas/nueva">
          <Plus size={15} strokeWidth={1.5} />
          {adminCopy.nuevaMarca}
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
          columns={brandColumns}
          rows={data}
          rowKey="id"
          empty={adminCopy.marcasVacio}
          renderActions={(fila) => (
            <>
              <AdminButton size="sm" to={`/admin/marcas/${fila.id}/editar`} aria-label={`${adminCopy.editar} ${fila.label}`}>
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
        title={adminConfirm.borrarMarca.titulo}
        confirmLabel={adminConfirm.borrarMarca.confirmar}
        pendingLabel={adminConfirm.borrarMarca.pendiente}
        pending={borrando}
        onConfirm={borrar}
        onCancel={() => setABorrar(null)}
      >
        {aBorrar && adminConfirm.borrarMarca.cuerpo(aBorrar.label)}
      </AdminDialog>
    </>
  )
}

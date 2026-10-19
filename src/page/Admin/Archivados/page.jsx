import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { AdminButton } from '../../../components/admin/AdminButton'
import { AdminNotice } from '../../../components/admin/AdminNotice'
import { AdminState } from '../../../components/admin/AdminState'
import { AdminTable } from '../../../components/admin/AdminTable'
import { adminCopy, adminNotices, productColumns } from '../../../data/admin'
import { useApiResource } from '../../../hooks/useApiResource'
import { getArchivedProducts, restoreProduct } from '../../../services/admin'

/**
 * Lo archivado: fuera de la tienda y del inventario, con su fila y sus imágenes
 * intactas. Restaurar no se confirma —se deshace archivando otra vez— y, como al
 * archivar, recarga la lista y las cuentas del lateral en vez de suponerlas.
 *
 * `getArchivedProducts` se pasa a pelo: no lleva argumentos, así que es la
 * referencia estable que useApiResource necesita.
 */
export default function AdminArchivados() {
  const { recargarCategorias } = useOutletContext()
  const { data, status, error, reload } = useApiResource(getArchivedProducts)

  const [aviso, setAviso] = useState(null)
  const [restaurando, setRestaurando] = useState(null)

  const restaurar = async (fila) => {
    setRestaurando(fila.id)

    try {
      await restoreProduct(fila.id)
      setAviso({ tone: 'good', texto: adminNotices.restaurado(fila.titulo) })
      reload()
      recargarCategorias()
    } catch (fallo) {
      setAviso({ tone: 'warn', texto: fallo.message })
    } finally {
      setRestaurando(null)
    }
  }

  return (
    <>
      <header className="mb-[18px]">
        <h1 className="text-[22px] leading-none text-admin-ink">{adminCopy.archivadosTitulo}</h1>
        <p className="mt-[6px] min-h-[18px] text-[13px] text-admin-muted">{adminCopy.archivadosIntro}</p>
      </header>

      {aviso && (
        <AdminNotice tone={aviso.tone} onClose={() => setAviso(null)} className="mb-[14px]">
          {aviso.texto}
        </AdminNotice>
      )}

      {status !== 'ready' ? (
        <AdminState status={status} error={error} onRetry={reload} />
      ) : (
        <AdminTable
          columns={productColumns}
          rows={data.items}
          rowKey="id"
          empty={adminCopy.archivadosVacio}
          renderActions={(fila) => (
            <AdminButton
              size="sm"
              disabled={Boolean(restaurando)}
              onClick={() => restaurar(fila)}
              aria-label={`${adminCopy.restaurar} ${fila.titulo}`}
            >
              {adminCopy.restaurar}
            </AdminButton>
          )}
        />
      )}
    </>
  )
}

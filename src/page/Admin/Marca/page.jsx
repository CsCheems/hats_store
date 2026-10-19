import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminButton } from '../../../components/admin/AdminButton'
import { AdminCard } from '../../../components/admin/AdminCard'
import { AdminField } from '../../../components/admin/AdminField'
import { AdminFormHeader } from '../../../components/admin/AdminFormHeader'
import { AdminNotice } from '../../../components/admin/AdminNotice'
import { AdminState } from '../../../components/admin/AdminState'
import {
  adminNotices,
  brandFields,
  catalogFormCopy,
  newBrandValues,
  toBrandValues,
} from '../../../data/admin'
import { useApiResource } from '../../../hooks/useApiResource'
import { useForm } from '../../../hooks/useForm'
import { createBrand, getBrand, getCatalogos, updateBrand } from '../../../services/admin'
import { validateBrand } from '../../../utils/validation'

const COPY = catalogFormCopy.marca
const VOLVER = { to: COPY.lista, label: COPY.volver }

const sinMarca = () => Promise.resolve(null)

/**
 * Alta y edición de una marca: /admin/marcas/nueva y /admin/marcas/:id/editar.
 *
 * Espera a los catálogos —sin ellos no hay casillas— y, en la edición, a la
 * marca. El editor se monta con `key`, igual que el de artículos.
 */
export default function AdminMarca() {
  const { id } = useParams()

  const catalogos = useApiResource(getCatalogos)
  const fetcher = useCallback((options) => (id ? getBrand(id, options) : sinMarca()), [id])
  const marca = useApiResource(fetcher)

  const pendiente = catalogos.status !== 'ready' ? catalogos : marca

  if (pendiente.status !== 'ready') {
    return (
      <>
        <AdminFormHeader volver={VOLVER} titulo={id ? COPY.editarTitulo : COPY.nuevoTitulo} />
        <AdminState status={pendiente.status} error={pendiente.error} onRetry={pendiente.reload} />
      </>
    )
  }

  return <Editor key={id ?? 'nueva'} categorias={catalogos.data.categorias} inicial={marca.data} />
}

function Editor({ categorias, inicial }) {
  const navigate = useNavigate()
  const [aviso, setAviso] = useState(null)

  const editando = Boolean(inicial)

  const onSubmit = useCallback(
    async (values) => {
      setAviso(null)

      try {
        const guardada = editando ? await updateBrand(inicial.id, values) : await createBrand(values)
        const texto = editando ? adminNotices.marcaGuardada(guardada.label) : adminNotices.marcaCreada(guardada.label)

        navigate(COPY.lista, { state: { aviso: texto } })
      } catch (error) {
        // Lo que no es de un campo —la red, un 403— se dice arriba.
        if (!error.field) setAviso(error.message)
        throw error
      }
    },
    [editando, inicial, navigate],
  )

  const { formRef, values, errors, pending, handleChange, handleSubmit } = useForm({
    initialValues: () => (inicial ? toBrandValues(inicial) : newBrandValues),
    validate: validateBrand,
    onSubmit,
  })

  // Las categorías en las que la marca ya tiene artículos se ven marcadas y no
  // se pueden quitar: la base no lo dejaría, y así no hace falta intentarlo.
  const fijas = new Set(inicial?.categoriasFijas ?? [])
  const opciones = categorias.map((categoria) => ({
    id: categoria.id,
    label: categoria.label,
    disabled: fijas.has(categoria.id),
    nota: fijas.has(categoria.id) ? catalogFormCopy.conArticulos : undefined,
  }))

  return (
    <div className="max-w-[880px]">
      <AdminFormHeader volver={VOLVER} titulo={editando ? COPY.editarTitulo : COPY.nuevoTitulo}>
        {editando && (inicial.enTienda ? catalogFormCopy.enTiendaSi : catalogFormCopy.enTiendaNo)}
      </AdminFormHeader>

      {aviso && (
        <AdminNotice tone="warn" onClose={() => setAviso(null)} className="mb-[14px]">
          {aviso}
        </AdminNotice>
      )}

      <AdminCard
        as="form"
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        aria-busy={pending}
        className="p-[clamp(16px,2.4vw,24px)]"
      >
        <div className="grid gap-5">
          {brandFields.map((field) => (
            <AdminField
              key={field.name}
              field={field}
              value={values[field.name]}
              error={errors[field.name]}
              options={field.type === 'checkboxes' ? opciones : undefined}
              disabled={pending}
              onChange={handleChange}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-admin-line pt-5">
          <AdminButton to={COPY.lista} aria-disabled={pending}>
            {catalogFormCopy.cancelar}
          </AdminButton>
          <AdminButton type="submit" variant="primary" disabled={pending}>
            {editando
              ? pending
                ? catalogFormCopy.guardando
                : catalogFormCopy.guardar
              : pending
                ? catalogFormCopy.creando
                : COPY.crear}
          </AdminButton>
        </div>
      </AdminCard>
    </div>
  )
}

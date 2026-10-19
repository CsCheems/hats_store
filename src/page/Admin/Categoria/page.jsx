import { useCallback, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { AdminButton } from '../../../components/admin/AdminButton'
import { AdminCard } from '../../../components/admin/AdminCard'
import { AdminField } from '../../../components/admin/AdminField'
import { AdminFormHeader } from '../../../components/admin/AdminFormHeader'
import { AdminNotice } from '../../../components/admin/AdminNotice'
import { AdminState } from '../../../components/admin/AdminState'
import {
  adminNotices,
  catalogFormCopy,
  categoryFields,
  newCategoryValues,
  toCategoryValues,
} from '../../../data/admin'
import { useApiResource } from '../../../hooks/useApiResource'
import { useForm } from '../../../hooks/useForm'
import { createCategory, getCategory, updateCategory } from '../../../services/admin'
import { validateCategory } from '../../../utils/validation'

const COPY = catalogFormCopy.categoria
const VOLVER = { to: COPY.lista, label: COPY.volver }
const SECCIONES = ['datos', 'atributos']

// Datos a dos columnas; las casillas, una debajo de otra con su explicación.
const REJILLA = {
  datos: 'grid-cols-1 sm:grid-cols-2',
  atributos: 'grid-cols-1',
}

const sinCategoria = () => Promise.resolve(null)

/**
 * Alta y edición de una categoría: /admin/categorias/nueva y
 * /admin/categorias/:id/editar.
 *
 * Lo que la categoría ya no puede cambiar —el prefijo y el género en cuanto
 * tiene artículos, el fieltro si alguno lo lleva— lo dice el servidor con sus
 * `*Fijo`, y aquí se pinta deshabilitado con el motivo en lugar de la ayuda.
 */
export default function AdminCategoria() {
  const { id } = useParams()

  const fetcher = useCallback((options) => (id ? getCategory(id, options) : sinCategoria()), [id])
  const categoria = useApiResource(fetcher)

  if (categoria.status !== 'ready') {
    return (
      <>
        <AdminFormHeader volver={VOLVER} titulo={id ? COPY.editarTitulo : COPY.nuevoTitulo} />
        <AdminState status={categoria.status} error={categoria.error} onRetry={categoria.reload} />
      </>
    )
  }

  return <Editor key={id ?? 'nueva'} inicial={categoria.data} />
}

function Editor({ inicial }) {
  const navigate = useNavigate()
  const { recargarCategorias } = useOutletContext()
  const [aviso, setAviso] = useState(null)

  const editando = Boolean(inicial)

  const onSubmit = useCallback(
    async (values) => {
      setAviso(null)

      try {
        const guardada = editando ? await updateCategory(inicial.id, values) : await createCategory(values)
        const texto = editando
          ? adminNotices.categoriaGuardada(guardada.label)
          : adminNotices.categoriaCreada(guardada.label)

        // El menú lateral la nombra y la cuenta.
        recargarCategorias()
        navigate(COPY.lista, { state: { aviso: texto } })
      } catch (error) {
        if (!error.field) setAviso(error.message)
        throw error
      }
    },
    [editando, inicial, navigate, recargarCategorias],
  )

  const { formRef, values, errors, pending, handleChange, handleSubmit } = useForm({
    initialValues: () => (inicial ? toCategoryValues(inicial) : newCategoryValues),
    validate: validateCategory,
    onSubmit,
  })

  // El prefijo se escribe en mayúsculas mientras se teclea: así es como va a
  // salir en el SKU.
  const onChange = useCallback(
    (name, value) => handleChange(name, name === 'prefijo' ? value.toUpperCase() : value),
    [handleChange],
  )

  const marcas = inicial?.marcas.map((marca) => marca.label).join(', ')

  return (
    <div className="max-w-[880px]">
      <AdminFormHeader volver={VOLVER} titulo={editando ? COPY.editarTitulo : COPY.nuevoTitulo}>
        {editando && (marcas ? catalogFormCopy.marcasDe(marcas) : catalogFormCopy.sinMarcas)}
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
        {SECCIONES.map((seccion, index) => (
          <fieldset
            key={seccion}
            className={`min-w-0 ${index > 0 ? 'mt-5 border-t border-admin-line pt-5' : ''}`}
          >
            <legend className="mb-3 text-[12px] tracking-wide text-admin-muted uppercase">
              {COPY.secciones[seccion]}
            </legend>

            <div className={`grid gap-4 ${REJILLA[seccion]}`}>
              {categoryFields
                .filter((field) => field.seccion === seccion)
                .map((field) => {
                  const fijo = Boolean(inicial?.[field.fijo])

                  return (
                    <AdminField
                      key={field.name}
                      field={fijo ? { ...field, hint: field.hintFijo } : field}
                      value={values[field.name]}
                      error={errors[field.name]}
                      disabled={pending || fijo}
                      onChange={onChange}
                    />
                  )
                })}
            </div>
          </fieldset>
        ))}

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

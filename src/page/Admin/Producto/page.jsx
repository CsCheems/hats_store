import { useCallback, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { AdminBadge } from '../../../components/admin/AdminBadge'
import { AdminButton } from '../../../components/admin/AdminButton'
import { AdminCard } from '../../../components/admin/AdminCard'
import { AdminField } from '../../../components/admin/AdminField'
import { AdminFormHeader } from '../../../components/admin/AdminFormHeader'
import { AdminGallery } from '../../../components/admin/AdminGallery'
import { AdminNotice } from '../../../components/admin/AdminNotice'
import { AdminState } from '../../../components/admin/AdminState'
import {
  adminCopy,
  adminNotices,
  newProductValues,
  productFields,
  productFormCopy,
  toProductValues,
} from '../../../data/admin'
import { useApiResource } from '../../../hooks/useApiResource'
import { useForm } from '../../../hooks/useForm'
import { useRouteNotice } from '../../../hooks/useRouteNotice'
import {
  createProduct,
  getCatalogos,
  getProduct,
  restoreProduct,
  updateProduct,
} from '../../../services/admin'
import { validateProduct } from '../../../utils/validation'

const SECCIONES = ['datos', 'clasificacion', 'venta', 'publicacion']

// Cuántas columnas ocupa cada sección en pantallas medianas: los textos largos
// van a lo ancho, los selectores y las cifras de dos en dos.
const REJILLA = {
  datos: 'grid-cols-1',
  clasificacion: 'grid-cols-1 sm:grid-cols-2',
  venta: 'grid-cols-1 sm:grid-cols-2',
  publicacion: 'grid-cols-1',
}

// Para el alta no hay nada que pedir: una referencia estable que resuelve null.
const sinProducto = () => Promise.resolve(null)

/**
 * Alta y edición de un artículo: /admin/productos/nuevo y /admin/articulos/:id.
 *
 * Espera a los catálogos —sin ellos no hay selectores— y, en la edición, al
 * artículo. Después monta el editor con `key`: pasar de un artículo a otro
 * vuelve a sembrar el formulario en vez de arrastrar lo escrito.
 */
export default function AdminProducto() {
  const { id } = useParams()

  const catalogos = useApiResource(getCatalogos)
  const fetcher = useCallback((options) => (id ? getProduct(id, options) : sinProducto()), [id])
  const producto = useApiResource(fetcher)

  const pendiente = catalogos.status !== 'ready' ? catalogos : producto

  if (pendiente.status !== 'ready') {
    return (
      <>
        <Cabecera titulo={id ? productFormCopy.editarTitulo : productFormCopy.nuevoTitulo} />
        <AdminState status={pendiente.status} error={pendiente.error} onRetry={pendiente.reload} />
      </>
    )
  }

  return <Editor key={id ?? 'nuevo'} catalogos={catalogos.data} inicial={producto.data} />
}

const VOLVER = { to: '/admin/productos', label: productFormCopy.volver }

function Cabecera({ titulo, children }) {
  return (
    <AdminFormHeader volver={VOLVER} titulo={titulo}>
      {children}
    </AdminFormHeader>
  )
}

function Editor({ catalogos, inicial }) {
  const navigate = useNavigate()
  const { recargarCategorias } = useOutletContext()
  const { aviso: avisoRuta, cerrar: cerrarAvisoRuta } = useRouteNotice()

  // El artículo tal como lo confirmó la base. La galería y restaurar lo
  // reemplazan con lo que devuelve cada petición; el formulario, no: sus valores
  // son lo que se está escribiendo.
  const [producto, setProducto] = useState(inicial)
  const [aviso, setAviso] = useState(null)

  const editando = Boolean(producto)
  const categoriaDe = useCallback(
    (slug) => catalogos.categorias.find((entrada) => entrada.id === slug),
    [catalogos],
  )

  const validate = useCallback(
    (values) => validateProduct(values, categoriaDe(values.categoria)),
    [categoriaDe],
  )

  const onSubmit = useCallback(
    async (values) => {
      setAviso(null)

      try {
        if (editando) {
          const guardado = await updateProduct(producto.id, values)
          recargarCategorias()
          navigate(`/admin/productos/${guardado.categoria}`, {
            state: { aviso: adminNotices.guardado(guardado.titulo) },
          })
        } else {
          const creado = await createProduct(values)
          recargarCategorias()
          // replace: «atrás» desde la edición no debe volver a un formulario de
          // alta que ya se usó.
          navigate(`/admin/articulos/${creado.id}`, {
            replace: true,
            state: { aviso: adminNotices.creado },
          })
        }
      } catch (error) {
        // Lo que no es de un campo —la red, un 403, un 500— se dice arriba. Lo
        // de un campo lo coloca useForm bajo su campo.
        if (!error.field) setAviso({ tone: 'warn', texto: error.message })
        throw error
      }
    },
    [editando, producto, navigate, recargarCategorias],
  )

  const { formRef, values, errors, pending, handleChange, handleSubmit } = useForm({
    initialValues: () => (inicial ? toProductValues(inicial) : newProductValues),
    validate,
    onSubmit,
  })

  const categoria = categoriaDe(values.categoria)

  // Cambiar de categoría limpia lo que deja de valer: una marca que no la
  // trabaja, un género o un fieltro que no lleva. Si no, el formulario enviaría
  // una combinación que el servidor va a rechazar, con el campo ya escondido.
  const onChange = useCallback(
    (name, value) => {
      handleChange(name, value)
      if (name !== 'categoria') return

      const nueva = categoriaDe(value)
      if (!nueva?.marcas.includes(values.marca)) handleChange('marca', '')
      if (!nueva?.llevaGenero) handleChange('genero', '')
      if (!nueva?.admiteFieltro) handleChange('fieltro', '')
    },
    [handleChange, categoriaDe, values.marca],
  )

  const opciones = (field) => {
    if (field.options === 'marcas') {
      return categoria ? catalogos.marcas.filter((marca) => categoria.marcas.includes(marca.id)) : []
    }
    return catalogos[field.options]
  }

  const restaurar = async () => {
    try {
      const restaurado = await restoreProduct(producto.id)
      setProducto(restaurado)
      recargarCategorias()
      setAviso({ tone: 'good', texto: adminNotices.restaurado(restaurado.titulo) })
    } catch (error) {
      setAviso({ tone: 'warn', texto: error.message })
    }
  }

  const visible = aviso ?? (avisoRuta ? { tone: 'good', texto: avisoRuta } : null)

  return (
    <div className="max-w-[880px]">
      <Cabecera titulo={editando ? productFormCopy.editarTitulo : productFormCopy.nuevoTitulo}>
        {editando ? (
          <>
            <span className="tabular-nums">
              {productFormCopy.sku} {producto.sku}
            </span>
            <AdminBadge estado={producto.estado} />
          </>
        ) : (
          productFormCopy.nuevoIntro
        )}
      </Cabecera>

      {visible && (
        <AdminNotice
          tone={visible.tone}
          onClose={() => (aviso ? setAviso(null) : cerrarAvisoRuta())}
          className="mb-[14px]"
        >
          {visible.texto}
        </AdminNotice>
      )}

      {producto?.archivado && (
        <AdminNotice tone="warn" className="mb-[14px]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {adminNotices.archivadoAviso}
            <AdminButton size="sm" onClick={restaurar}>
              {adminCopy.restaurar}
            </AdminButton>
          </div>
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
        {SECCIONES.map((seccion, index) => {
          const campos = productFields.filter(
            (field) => field.seccion === seccion && (!field.visibleIf || categoria?.[field.visibleIf]),
          )

          return (
            <fieldset
              key={seccion}
              className={`min-w-0 ${index > 0 ? 'mt-5 border-t border-admin-line pt-5' : ''}`}
            >
              <legend className="mb-3 text-[12px] tracking-wide text-admin-muted uppercase">
                {productFormCopy.secciones[seccion]}
              </legend>

              <div className={`grid gap-4 ${REJILLA[seccion]}`}>
                {campos.map((field) => {
                  const lista = field.type === 'select' ? opciones(field) : undefined
                  const sinOpciones = field.dependsOn && !values[field.dependsOn]
                  const listaVacia = !sinOpciones && field.noOptionsPlaceholder && lista?.length === 0

                  return (
                    <AdminField
                      key={field.name}
                      field={field}
                      value={values[field.name]}
                      error={errors[field.name]}
                      options={lista}
                      placeholder={
                        sinOpciones
                          ? field.emptyPlaceholder
                          : listaVacia
                            ? field.noOptionsPlaceholder
                            : undefined
                      }
                      disabled={pending || Boolean(sinOpciones)}
                      onChange={onChange}
                    />
                  )
                })}
              </div>
            </fieldset>
          )
        })}

        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-admin-line pt-5">
          <AdminButton to="/admin/productos" aria-disabled={pending}>
            {productFormCopy.cancelar}
          </AdminButton>
          <AdminButton type="submit" variant="primary" disabled={pending}>
            {editando
              ? pending
                ? productFormCopy.guardando
                : productFormCopy.guardar
              : pending
                ? productFormCopy.creando
                : productFormCopy.crear}
          </AdminButton>
        </div>
      </AdminCard>

      {editando && (
        <div className="mt-[18px]">
          <AdminGallery product={producto} onChange={setProducto} />
        </div>
      )}
    </div>
  )
}

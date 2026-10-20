import { Star } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useToast } from '../../context/ToastContext'
import { REVIEW_MAX, reviewsCopy, shopMessages, shopToasts } from '../../data/shop'
import { useApiResource } from '../../hooks/useApiResource'
import { useForm } from '../../hooks/useForm'
import { deleteReview, getMyReview, saveReview } from '../../services/shop'
import { Button } from '../ui/Button'
import { INPUT, TONES } from '../ui/fieldStyles'

// Espejo de reviewSchema en backend/validation/shop.schema.js, con los mensajes
// copiados literalmente. El cliente puede ser igual o más laxo, nunca más
// estricto.
function validateReview(values) {
  const errors = {}

  if (!values.calificacion) errors.calificacion = shopMessages.calificacion

  const texto = values.texto.trim()
  if (!texto) errors.texto = shopMessages.required
  else if (texto.length > REVIEW_MAX) errors.texto = shopMessages.resenaLarga

  return errors
}

/**
 * Las cinco estrellas para elegir. Son radios de verdad —ocultos, con las
 * estrellas como sus etiquetas—, así que el teclado funciona gratis: flechas para
 * moverse, tabulador para entrar y salir.
 *
 * Al pasar por encima se iluminan hasta la que se apunta, como pide cualquier
 * selector de estrellas; sin puntero, las del valor elegido.
 */
function StarInput({ value, error, disabled, onChange }) {
  const [apuntada, setApuntada] = useState(0)
  const hasta = apuntada || Number(value) || 0

  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-[13px] font-semibold tracking-label text-sand uppercase">
        {reviewsCopy.calificacion}
      </legend>

      <div className="flex gap-1" onMouseLeave={() => setApuntada(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            onMouseEnter={() => setApuntada(n)}
            className={`relative grid h-[40px] w-[40px] place-items-center text-gold ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <input
              type="radio"
              name="calificacion"
              value={n}
              checked={Number(value) === n}
              disabled={disabled}
              aria-invalid={error ? true : undefined}
              onChange={() => onChange('calificacion', String(n))}
              className="peer absolute inset-0 cursor-pointer opacity-0"
            />
            <span className="sr-only">{reviewsCopy.estrellas(n)}</span>
            <Star
              size={26}
              strokeWidth={1.5}
              fill={n <= hasta ? 'currentColor' : 'none'}
              aria-hidden="true"
              className="peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2"
            />
          </label>
        ))}
      </div>

      {error && <p className="mt-[6px] text-[14px] text-rust">{error}</p>}
    </fieldset>
  )
}

function ReviewEditor({ slug, inicial, onSaved, onDeleted }) {
  const { pushToast } = useToast()
  const [borrando, setBorrando] = useState(false)
  const editando = Boolean(inicial)

  const onSubmit = useCallback(
    async (values) => {
      await saveReview(slug, values)
      pushToast(shopToasts.resenaOk)
      onSaved({ calificacion: Number(values.calificacion), texto: values.texto.trim() })
    },
    [slug, pushToast, onSaved],
  )

  const { formRef, values, errors, pending, handleChange, handleSubmit } = useForm({
    initialValues: () => ({
      calificacion: inicial ? String(inicial.calificacion) : '',
      texto: inicial?.texto ?? '',
    }),
    validate: validateReview,
    onSubmit,
  })

  const borrar = async () => {
    setBorrando(true)
    try {
      await deleteReview(slug)
      pushToast(shopToasts.resenaBorrada)
      onDeleted()
    } catch (fallo) {
      pushToast(shopToasts.error(fallo.message))
    } finally {
      setBorrando(false)
    }
  }

  const ocupado = pending || borrando

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={ocupado} className="flex flex-col gap-5">
      <StarInput value={values.calificacion} error={errors.calificacion} disabled={ocupado} onChange={handleChange} />

      <div>
        <label htmlFor="resena-texto" className="mb-2 block text-[13px] font-semibold tracking-label text-sand uppercase">
          {reviewsCopy.texto}
        </label>
        <textarea
          id="resena-texto"
          name="texto"
          rows={4}
          value={values.texto}
          disabled={ocupado}
          placeholder={reviewsCopy.textoPlaceholder}
          aria-invalid={errors.texto ? true : undefined}
          onChange={(event) => handleChange('texto', event.target.value)}
          className={`${INPUT} ${errors.texto ? TONES.error : TONES.idle} h-auto min-h-[120px] resize-y py-3 leading-[1.5]`}
        />
        <div className="mt-[6px] flex justify-between gap-4 text-[14px]">
          <span className="text-rust">{errors.texto}</span>
          <span className="text-sand tabular-nums">{reviewsCopy.contador(values.texto.length, REVIEW_MAX)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={ocupado} className="px-[26px] py-[13px]">
          {pending ? reviewsCopy.guardando : editando ? reviewsCopy.guardar : reviewsCopy.publicar}
        </Button>
        {editando && (
          <Button variant="quiet" disabled={ocupado} onClick={borrar} className="px-[22px] py-[13px]">
            {borrando ? reviewsCopy.borrando : reviewsCopy.borrar}
          </Button>
        )}
      </div>
    </form>
  )
}

/**
 * El formulario de reseña de quien tiene sesión. Primero pide la suya, si la hay,
 * y solo entonces monta el editor: así el formulario nace ya relleno, como los
 * demás editores del sitio, en vez de rellenarse con un efecto.
 *
 * `key` cambia entre «nueva» y «editando»: al publicar o borrar, el editor se
 * vuelve a sembrar con lo que acaba de pasar.
 *
 * La reseña propia NO se vuelve a pedir tras guardar o borrar: se sabe lo que se
 * acaba de enviar, y pedirla otra vez haría desaparecer el formulario un instante
 * detrás de un «Cargando». Lo que sí se relee es la lista pública (`onChanged`),
 * que es lo que cambió para los demás.
 */
export function ReviewForm({ slug, onChanged }) {
  const fetcher = useCallback((options) => getMyReview(slug, options), [slug])
  const mia = useApiResource(fetcher)

  // `undefined` = sin cambios desde que se cargó; null = se borró; objeto = se
  // acaba de guardar.
  const [local, setLocal] = useState(undefined)

  const alGuardar = useCallback(
    (resena) => {
      setLocal(resena)
      onChanged()
    },
    [onChanged],
  )

  const alBorrar = useCallback(() => {
    setLocal(null)
    onChanged()
  }, [onChanged])

  if (mia.status === 'loading') {
    return <p className="text-[14px] text-sand">{reviewsCopy.cargando}</p>
  }

  if (mia.status === 'error') {
    return (
      <p className="text-[14px] text-sand">
        {mia.error?.message}{' '}
        <button type="button" onClick={mia.reload} className="cursor-pointer underline hover:text-gold">
          {reviewsCopy.reintentar}
        </button>
      </p>
    )
  }

  const inicial = local === undefined ? mia.data.resena : local

  return (
    <>
      <h3 className="mb-5 font-display text-[22px] font-semibold text-paper">
        {inicial ? reviewsCopy.formTituloEditar : reviewsCopy.formTitulo}
      </h3>
      <ReviewEditor
        key={inicial ? 'editando' : 'nueva'}
        slug={slug}
        inicial={inicial}
        onSaved={alGuardar}
        onDeleted={alBorrar}
      />
    </>
  )
}

import { useCallback } from 'react'
import { useToast } from '../../context/ToastContext'
import { cardFields, checkoutCopy, checkoutToasts } from '../../data/checkout'
import { useForm } from '../../hooks/useForm'
import { placeOrder } from '../../services/pedidos'
import { tokenizeCard } from '../../services/pagos'
import { formatMoney } from '../../utils/format'
import { validateCard } from '../../utils/validation'
import { Button } from '../ui/Button'
import { Field } from '../ui/Field'
import { Frame } from '../ui/Frame'
import { FormSection } from './FormSection'

const FRAME = 'px-[clamp(20px,4vw,38px)] py-[clamp(26px,3.4vw,38px)]'

// Errores que dicen «lo que viste ya no vale»: el total cambió o se acabó una
// pieza. Tras ellos la página vuelve a pedir el resumen y la bolsa.
const OBSOLETO = new Set(['total_changed', 'insufficient_stock', 'cart_empty'])

const soloDigitos = (valor) => valor.replace(/\D/g, '')

// Lo que se teclea en cada campo de la tarjeta, ordenado mientras se escribe: el
// número en grupos de cuatro, la fecha con su diagonal, el código sin letras.
// Quien pega «4242424242424242» ve «4242 4242 4242 4242».
const FORMATO = {
  tarjetaNumero: (valor) => soloDigitos(valor).slice(0, 19).replace(/(.{4})(?=.)/g, '$1 '),
  tarjetaVence: (valor) => {
    const d = soloDigitos(valor).slice(0, 4)
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  },
  tarjetaCvc: (valor) => soloDigitos(valor).slice(0, 4),
}

/**
 * Paso 2: el pago. Repite a dónde se envía (con su «Cambiar») y pide la tarjeta.
 *
 * Al enviar, el número se convierte en un token (services/pagos.js) y al servidor
 * solo viaja el token, junto con el total que se estaba viendo: si cambió, el
 * servidor se niega a cobrar y aquí se avisa y se vuelve a pedir el resumen. Un
 * rechazo de la pasarela vuelve como error del campo del número.
 */
export function PaymentStep({ envio, total, onBack, onPaid, onStale }) {
  const { pushToast } = useToast()

  const onInvalid = useCallback(() => pushToast(checkoutToasts.invalid), [pushToast])

  const onSubmit = useCallback(
    async (values) => {
      try {
        const { token } = await tokenizeCard(values)
        const pedido = await placeOrder({ envio, total, token })

        onPaid(pedido)
      } catch (error) {
        pushToast({ ...checkoutToasts.failure, body: error.message })
        if (OBSOLETO.has(error.code)) onStale()

        // Se relanza para que useForm coloque el mensaje bajo su campo.
        throw error
      }
    },
    [envio, total, onPaid, onStale, pushToast],
  )

  const { formRef, values, errors, pending, handleChange, handleSubmit } = useForm({
    initialValues: { tarjetaNombre: '', tarjetaNumero: '', tarjetaVence: '', tarjetaCvc: '' },
    validate: validateCard,
    onSubmit,
    onInvalid,
  })

  const onChange = (name, valor) => handleChange(name, FORMATO[name]?.(valor) ?? valor)

  return (
    <Frame as="form" ref={formRef} weight="strong" onSubmit={handleSubmit} aria-busy={pending} noValidate className={FRAME}>
      <h2 className="font-display text-h3 font-extrabold text-paper">{checkoutCopy.pagoTitulo}</h2>
      <p className="mt-3 text-[16px] leading-[1.5] text-sand">{checkoutCopy.pagoIntro}</p>

      <section aria-label={checkoutCopy.enviarA} className="mt-7 border-t-2 border-rail pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 text-[16px] leading-[1.5] text-paper">
            <span className="block text-[13px] font-semibold tracking-label text-sand uppercase">
              {checkoutCopy.enviarA}
            </span>
            <span className="mt-1 block font-semibold">{envio.destinatario}</span>
            {envio.calle} {envio.numero}, {envio.colonia}
            <span className="block text-sand">
              {envio.codigoPostal}, {envio.estado}, {envio.pais}
            </span>
            {envio.referencias && <span className="block text-sand">{envio.referencias}</span>}
          </div>

          <button
            type="button"
            disabled={pending}
            onClick={onBack}
            className="shrink-0 cursor-pointer text-[13px] font-semibold tracking-[.14em] text-paper uppercase underline-offset-4 transition-colors hover:text-gold hover:underline disabled:cursor-not-allowed disabled:text-sand"
          >
            {checkoutCopy.cambiar}
          </button>
        </div>
      </section>

      <FormSection title={checkoutCopy.tarjeta}>
        {cardFields.map((field) => (
          <Field
            key={field.name}
            field={field}
            value={values[field.name]}
            error={errors[field.name]}
            disabled={pending}
            onChange={onChange}
          />
        ))}
      </FormSection>

      <p className="mt-5 text-[14px] leading-[1.5] text-sand">{checkoutCopy.pagoSeguro}</p>
      <p className="mt-2 text-[14px] leading-[1.5] text-sand">{checkoutCopy.pagoNotaDemo}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Button variant="outline" disabled={pending} onClick={onBack} className="py-[14px]">
          {checkoutCopy.volverEnvio}
        </Button>

        <Button type="submit" disabled={pending} className="relative overflow-hidden py-[14px]">
          {pending ? checkoutCopy.pagando : checkoutCopy.pagar(formatMoney(total))}

          {/* La espera: el mismo filete de 1px del modal de acceso y del perfil. */}
          {pending && (
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px]">
              <span className="block h-[2px] w-2/5 animate-sweep bg-ink" />
            </span>
          )}
        </Button>
      </div>
    </Frame>
  )
}

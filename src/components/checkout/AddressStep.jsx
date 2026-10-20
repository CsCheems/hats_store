import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import {
  addressFields,
  checkoutCopy,
  checkoutToasts,
  contactFields,
  OTRA,
  referenciasField,
} from '../../data/checkout'
import { useApiResource } from '../../hooks/useApiResource'
import { useForm } from '../../hooks/useForm'
import { useUbicaciones } from '../../hooks/useUbicaciones'
import { getAddresses } from '../../services/pedidos'
import { validateShipping } from '../../utils/validation'
import { ShopState } from '../shop/ShopState'
import { Button } from '../ui/Button'
import { Field } from '../ui/Field'
import { Frame } from '../ui/Frame'
import { CASILLA, OPCION } from './checkoutStyles'
import { FormSection } from './FormSection'

const FRAME = 'px-[clamp(20px,4vw,38px)] py-[clamp(26px,3.4vw,38px)]'

// Los valores de la dirección nueva al empezar: vacíos, salvo lo que el campo
// declara por omisión (el país).
const direccionVacia = () => Object.fromEntries(addressFields.map((field) => [field.name, field.defaultValue ?? '']))

/**
 * Paso 1: adónde se envía. Pide las direcciones guardadas y, cuando llegan,
 * monta el formulario con la predeterminada ya elegida; si no cargaron, el
 * formulario sale igual con la dirección en blanco, porque una lista caída no
 * puede impedir comprar.
 *
 * El formulario se monta DESPUÉS de saber las direcciones y no antes porque
 * useForm solo lee sus valores iniciales al montar, y la elección inicial depende
 * de ellas.
 */
export function AddressStep({ user, inicial, onDone }) {
  const { status, data } = useApiResource(getAddresses)

  if (status === 'loading') return <ShopState status="loading" copy={checkoutCopy} />

  // Un error al pedir la lista no bloquea la compra: el formulario sale con la
  // dirección en blanco.
  return <AddressForm user={user} guardadas={data?.direcciones ?? []} inicial={inicial} onDone={onDone} />
}

function AddressForm({ user, guardadas, inicial, onDone }) {
  const { pushToast } = useToast()

  const onInvalid = useCallback(() => pushToast(checkoutToasts.invalid), [pushToast])

  const onSubmit = useCallback(
    async (values) => {
      const guardada = guardadas.find((direccion) => String(direccion.id) === values.eleccion)
      const direccion = guardada ?? values

      onDone(values, {
        destinatario: values.destinatario.trim(),
        telefono: values.telefono.trim(),
        pais: direccion.pais.trim(),
        estado: direccion.estado.trim(),
        codigoPostal: direccion.codigoPostal.trim(),
        colonia: direccion.colonia.trim(),
        calle: direccion.calle.trim(),
        numero: direccion.numero.trim(),
        referencias: values.referencias.trim(),
        // Una dirección que ya está guardada no se guarda otra vez.
        guardar: !guardada && values.guardar,
      })
    },
    [guardadas, onDone],
  )

  const { formRef, values, errors, pending, handleChange, handleSubmit } = useForm({
    initialValues: () =>
      inicial ?? {
        destinatario: `${user.nombre} ${user.apellido}`,
        telefono: user.telefono,
        referencias: '',
        eleccion: guardadas[0] ? String(guardadas[0].id) : OTRA,
        guardar: false,
        ...direccionVacia(),
      },
    validate: validateShipping,
    onSubmit,
    onInvalid,
  })

  const ubicaciones = useUbicaciones(addressFields)
  const escribiendo = values.eleccion === OTRA

  return (
    <Frame as="form" ref={formRef} weight="strong" onSubmit={handleSubmit} aria-busy={pending} noValidate className={FRAME}>
      <h2 className="font-display text-h3 font-extrabold text-paper">{checkoutCopy.envioTitulo}</h2>
      <p className="mt-3 text-[16px] leading-[1.5] text-sand">{checkoutCopy.envioIntro}</p>

      <FormSection title={checkoutCopy.contacto} first>
        {contactFields.map((field) => (
          <Field
            key={field.name}
            field={{ ...field, half: true }}
            value={values[field.name]}
            error={errors[field.name]}
            disabled={pending}
            onChange={handleChange}
          />
        ))}
      </FormSection>

      <FormSection title={checkoutCopy.direccion}>
        {guardadas.length > 0 && (
          <fieldset className="grid gap-3 sm:col-span-2">
            <legend className="sr-only">{checkoutCopy.guardadas}</legend>

            {guardadas.map((direccion) => (
              <label key={direccion.id} className={OPCION}>
                <input
                  type="radio"
                  name="eleccion"
                  value={direccion.id}
                  checked={values.eleccion === String(direccion.id)}
                  onChange={(event) => handleChange('eleccion', event.target.value)}
                  disabled={pending}
                  className={`${CASILLA} mt-[3px]`}
                />
                <span className="min-w-0 text-[16px] leading-[1.45] text-paper">
                  {direccion.calle} {direccion.numero}, {direccion.colonia}
                  <span className="block text-sand">
                    {direccion.codigoPostal}, {direccion.estado}, {direccion.pais}
                  </span>
                  {direccion.predeterminada && (
                    <span className="mt-1 block text-[12px] font-semibold tracking-label text-gold uppercase">
                      {checkoutCopy.predeterminada}
                    </span>
                  )}
                </span>
              </label>
            ))}

            <label className={OPCION}>
              <input
                type="radio"
                name="eleccion"
                value={OTRA}
                checked={escribiendo}
                onChange={(event) => handleChange('eleccion', event.target.value)}
                disabled={pending}
                className={`${CASILLA} mt-[3px]`}
              />
              <span className="text-[16px] leading-[1.45] text-paper">{checkoutCopy.otraDireccion}</span>
            </label>
          </fieldset>
        )}

        {escribiendo && (
          <>
            {guardadas.length > 0 && (
              <p className="text-[15px] text-sand sm:col-span-2">{checkoutCopy.otraNota}</p>
            )}

            {addressFields.map((field) => (
              <Field
                key={field.name}
                field={field}
                value={values[field.name]}
                error={errors[field.name]}
                disabled={pending}
                {...ubicaciones.propsFor(field, values, handleChange)}
              />
            ))}

            <label className="flex cursor-pointer items-center gap-3 text-[16px] text-paper sm:col-span-2">
              <input
                type="checkbox"
                name="guardar"
                checked={values.guardar}
                onChange={(event) => handleChange('guardar', event.target.checked)}
                disabled={pending}
                className={CASILLA}
              />
              {checkoutCopy.guardar}
            </label>
          </>
        )}

        <Field
          field={referenciasField}
          value={values.referencias}
          error={errors.referencias}
          disabled={pending}
          onChange={handleChange}
        />
      </FormSection>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Button as={Link} to="/carrito" variant="outline" className="py-[14px]">
          {checkoutCopy.volverBolsa}
        </Button>
        <Button type="submit" disabled={pending} className="py-[14px]">
          {checkoutCopy.continuar}
        </Button>
      </div>
    </Frame>
  )
}

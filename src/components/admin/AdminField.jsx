import { TriangleAlert } from 'lucide-react'
import { useId } from 'react'

// Controles del panel. Mismo radio, mismo borde y mismo anillo azul para los
// cuatro tipos: un select que no se parece a su input vecino se lee como otra
// cosa.
const CONTROL =
  'w-full min-w-0 rounded-admin border bg-admin-card px-3 text-[13px] text-admin-ink transition-colors placeholder:text-admin-muted focus-visible:outline-admin-blue disabled:cursor-not-allowed disabled:bg-admin-canvas disabled:text-admin-muted'

const TONES = {
  idle: 'border-admin-line hover:border-admin-muted/60',
  error: 'border-admin-warn',
}

const CASILLA =
  'mt-[2px] size-[16px] shrink-0 cursor-pointer rounded-admin accent-admin-blue focus-visible:outline-admin-blue disabled:cursor-not-allowed'

/**
 * Un campo del panel: etiqueta, control, ayuda y error. Es el Field de la tienda
 * en el otro sistema de diseño —mismo contrato (`field`, `value`, `error`,
 * `onChange(name, value)`), para que useForm sirva a los dos—, y NO lo importa:
 * nada de components/ui cruza a esta carpeta.
 *
 * El select es el NATIVO. En la tienda la lista tiene que llevar el marco de la
 * marca y por eso existe Select; el panel es una herramienta interna, y aquí
 * vale más un control que el sistema operativo ya sabe manejar con teclado,
 * lector de pantalla y dedo.
 *
 * `options` son `{ id, label }`. Un select con `placeholder` lo ofrece como
 * primera opción con valor vacío: en uno obligatorio es «todavía no elegiste», y
 * en uno opcional (el fieltro) es la respuesta «ninguno».
 *
 * `checkboxes` es un grupo cuyo valor es la lista de ids marcados. Cada opción
 * puede traer `disabled` y una `nota` —«con artículos»— que dice por qué. Todas
 * las casillas llevan el `name` del campo, que es lo que busca focusField.
 */
export function AdminField({ field, value, error, options = [], disabled = false, placeholder, onChange }) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  const tone = error ? TONES.error : TONES.idle
  const describedBy = [error ? errorId : null, field.hint ? hintId : null].filter(Boolean).join(' ') || undefined

  const change = (event) => {
    const next = field.type === 'checkbox' ? event.target.checked : event.target.value
    onChange?.(field.name, next)
  }

  // La casilla suelta y el grupo sangran la ayuda hasta el texto, no hasta la
  // casilla.
  const sangria = field.type === 'checkbox' ? 'pl-[26px]' : ''

  const pie = (
    <>
      {field.hint && (
        <p id={hintId} className={`mt-1 text-[12px] leading-[1.45] text-admin-muted ${sangria}`}>
          {field.hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={`mt-[6px] flex items-start gap-[6px] text-[12px] leading-[1.45] text-admin-warn ${sangria}`}>
          <TriangleAlert size={13} strokeWidth={1.5} className="mt-[2px] shrink-0" />
          {error}
        </p>
      )}
    </>
  )

  if (field.type === 'checkbox') {
    return (
      <div>
        <label htmlFor={id} className={`flex items-start gap-[10px] ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <input
            id={id}
            name={field.name}
            type="checkbox"
            checked={value}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onChange={change}
            className={CASILLA}
          />
          <span className={`text-[13px] ${disabled ? 'text-admin-muted' : 'text-admin-ink'}`}>{field.label}</span>
        </label>
        {pie}
      </div>
    )
  }

  if (field.type === 'checkboxes') {
    const alternar = (opcion) =>
      onChange?.(
        field.name,
        value.includes(opcion) ? value.filter((marcada) => marcada !== opcion) : [...value, opcion],
      )

    return (
      <fieldset className="min-w-0" aria-describedby={describedBy}>
        <legend className="mb-[8px] block text-[12px] text-admin-muted">{field.label}</legend>

        <div className="grid gap-x-4 gap-y-[8px] sm:grid-cols-2 lg:grid-cols-3">
          {options.map((opcion) => {
            const bloqueada = disabled || opcion.disabled

            return (
              <label
                key={opcion.id}
                className={`flex items-start gap-[10px] ${bloqueada ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <input
                  name={field.name}
                  type="checkbox"
                  value={opcion.id}
                  checked={value.includes(opcion.id)}
                  disabled={bloqueada}
                  onChange={() => alternar(opcion.id)}
                  className={CASILLA}
                />
                <span className="text-[13px] text-admin-ink">
                  {opcion.label}
                  {opcion.nota && <span className="ml-[6px] text-[12px] text-admin-muted">· {opcion.nota}</span>}
                </span>
              </label>
            )
          })}
        </div>

        {pie}
      </fieldset>
    )
  }

  const common = {
    id,
    name: field.name,
    value,
    disabled,
    onChange: change,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  }

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-[6px] block text-[12px] text-admin-muted">
        {field.label}
      </label>

      {field.type === 'textarea' && (
        <textarea
          {...common}
          rows={3}
          maxLength={field.maxLength}
          className={`${CONTROL} ${tone} min-h-[84px] resize-y py-[8px] leading-[1.5]`}
        />
      )}

      {field.type === 'select' && (
        <select {...common} className={`${CONTROL} ${tone} h-[38px] cursor-pointer`}>
          <option value="">{placeholder ?? field.placeholder}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {field.type === 'text' && (
        <input
          {...common}
          type="text"
          inputMode={field.inputMode}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          autoComplete="off"
          className={`${CONTROL} ${tone} h-[38px]`}
        />
      )}

      {pie}
    </div>
  )
}

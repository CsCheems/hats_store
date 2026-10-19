import { AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { useId, useState } from 'react'
import { INPUT, TONES } from './fieldStyles'
import { Select } from './Select'

/**
 * Campo del formulario: etiqueta visible, control y mensaje de error.
 *
 * El sitio etiqueta sus controles con `aria-label`, que basta para un icono
 * suelto pero no para un alta de once campos —ahí la etiqueta tiene que verse—.
 *
 * El mensaje de error va en `notice` con el icono en `rust`: óxido sobre panel
 * son 3.6:1, suficiente para un icono (AA no textual pide 3:1) pero corto para
 * texto de 11px.
 *
 * `readOnly` y `disabled` NO son lo mismo y la diferencia importa: un campo
 * deshabilitado se apaga, sale del orden de tabulación y no deja seleccionar su
 * contenido —es para un formulario que ahora mismo no se puede usar, como
 * mientras se envía—; uno de solo lectura se enfoca, se lee y se copia, que es
 * lo que se quiere de unos datos que se están consultando. De ahí que el perfil
 * use el segundo.
 *
 * Un campo `type: 'select'` se dibuja con Select cuando hay lista que ofrecer
 * (`options`) o se está esperando (`loading`). En solo lectura no hay nada que
 * elegir y es el input de siempre; y si la lista no llegó, también: un campo de
 * texto, para que el formulario siga sirviendo.
 */
export function Field({
  field,
  value,
  error,
  disabled = false,
  readOnly = false,
  options,
  loading = false,
  onChange,
}) {
  const id = useId()
  const errorId = `${id}-error`
  const labelId = `${id}-label`

  const [revealed, setRevealed] = useState(false)
  const isPassword = field.type === 'password'
  const isSelect = field.type === 'select' && !readOnly && (loading || Array.isArray(options))

  // El ojo no se pinta en lectura: no hay nada que revelar que no se pueda ver.
  const canReveal = isPassword && !readOnly

  const tone = readOnly ? TONES.readonly : error ? TONES.error : TONES.idle

  // Un select sin lista se escribe a mano.
  const inputType = field.type === 'select' ? 'text' : isPassword && revealed ? 'text' : field.type

  return (
    <div className={field.half ? '' : 'sm:col-span-2'}>
      <label
        id={labelId}
        htmlFor={id}
        className="block text-[13px] font-semibold tracking-label text-sand uppercase"
      >
        {field.label}
      </label>

      <div className="relative mt-[7px]">
        {isSelect ? (
          <Select
            id={id}
            name={field.name}
            value={value}
            options={options ?? []}
            placeholder={loading ? 'Cargando…' : field.placeholder}
            // Sin opciones no hay nada que abrir: mientras carga, o si el país
            // elegido no tiene estados.
            disabled={disabled || loading || !options?.length}
            toneClass={tone}
            invalid={Boolean(error)}
            describedBy={error ? errorId : undefined}
            labelId={labelId}
            onChange={(next) => onChange?.(field.name, next)}
          />
        ) : (
          <input
            id={id}
            name={field.name}
            type={inputType}
            value={value}
            // Sin placeholder en lectura: un «Mínimo 8 caracteres» bajo un campo
            // que no se puede escribir invita a algo imposible.
            placeholder={readOnly ? undefined : field.placeholder}
            autoComplete={field.autoComplete}
            inputMode={field.inputMode}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => onChange?.(field.name, event.target.value)}
            className={`${INPUT} ${tone} ${canReveal ? 'pr-[40px]' : ''}`}
          />
        )}

        {canReveal && (
          <button
            type="button"
            disabled={disabled}
            aria-label={revealed ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => setRevealed((shown) => !shown)}
            className="absolute inset-y-0 right-0 grid w-[40px] cursor-pointer place-items-center text-sand transition-colors hover:text-gold disabled:cursor-not-allowed"
          >
            {revealed ? (
              <EyeOff size={15} strokeWidth={1.5} />
            ) : (
              <Eye size={15} strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          className="mt-[6px] flex items-start gap-[6px] text-[14px] leading-[1.45] text-paper"
        >
          <AlertTriangle size={12} strokeWidth={1.5} className="mt-[3px] shrink-0 text-rust" />
          {error}
        </p>
      )}
    </div>
  )
}

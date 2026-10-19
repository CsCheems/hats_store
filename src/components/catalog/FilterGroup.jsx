import { formatInteger } from '../../utils/format'

// El reseteo de la capa base ya deja los input en radio 0, así que la casilla
// solo tiene que apagar el dibujo del sistema. Marcada es un cuadro macizo
// sin palomita: la jerarquía de la casa se dibuja con reglas y rellenos.
const CASILLA =
  'h-[16px] w-[16px] shrink-0 cursor-pointer appearance-none border border-paper bg-transparent transition-colors checked:bg-paper disabled:cursor-not-allowed disabled:border-rail'

const FILA =
  'flex cursor-pointer items-center gap-[12px] py-[7px] text-[15px] transition-colors hover:text-gold'

/**
 * Un grupo de casillas de la columna de filtros, con su cuenta a la derecha.
 *
 * Una opción con cero se deshabilita en vez de esconderse: las cuentas salen del
 * catálogo entero y no de lo ya filtrado, así que un cero significa «esto no se
 * vende aquí hoy» y no «lo has escondido tú». Quitarla de la lista haría que el
 * grupo cambiara de tamaño al filtrar, que es justo lo que no queremos.
 */
export function FilterGroup({ title, options, selected, onToggle }) {
  return (
    // `min-w-0` NO es de adorno: el navegador le impone a todo <fieldset> un
    // `min-inline-size: min-content` desde su hoja de usuario, así que el grupo
    // no puede encoger por debajo de su etiqueta más larga y desalinea las
    // cuentas de la derecha.
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="mb-[10px] w-full border-t-2 border-paper p-0 pt-[20px] text-[12px] font-semibold tracking-[.24em] text-gold uppercase">{title}</legend>

      {options.map((opcion) => {
        const marcado = selected.has(opcion.id)
        const vacio = opcion.count === 0

        return (
          <label
            key={opcion.id}
            className={`${FILA} ${vacio ? 'cursor-not-allowed text-sand/50 hover:text-sand/50' : 'text-paper'}`}
          >
            <input
              type="checkbox"
              checked={marcado}
              disabled={vacio}
              onChange={() => onToggle(opcion.id)}
              className={CASILLA}
            />
            <span className="flex-1 truncate">{opcion.label}</span>
            <span className="text-[14px] text-sand tabular-nums">{formatInteger(opcion.count)}</span>
          </label>
        )
      })}
    </fieldset>
  )
}

/**
 * Una casilla suelta —«solo disponibles»— que no pertenece a ningún grupo.
 *
 * Vive en este archivo y no en el suyo porque comparte la receta de la casilla
 * con el grupo de arriba, y esa receta en dos archivos es como acaban con dos
 * bordes distintos.
 */
export function FilterToggle({ label, count, checked, onChange }) {
  return (
    <label className={`${FILA} border-t-2 border-paper pt-[20px] text-paper`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className={CASILLA}
      />
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span className="text-[14px] text-sand tabular-nums">{formatInteger(count)}</span>
      )}
    </label>
  )
}

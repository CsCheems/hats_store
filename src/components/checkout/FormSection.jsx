/**
 * Un grupo de campos con su rótulo y una regla de 2px, el mismo del perfil: el
 * título en el acento, la regla suave detrás. Los hijos caen en la retícula de dos
 * columnas de siempre, que es la que hace que el `half` de cada Field caiga donde
 * cae.
 */
export function FormSection({ title, first = false, children }) {
  return (
    <div className={first ? 'mt-8' : 'mt-7'}>
      <div className="mb-4 flex items-center gap-3">
        <span className="shrink-0 text-[13px] font-semibold tracking-label text-gold uppercase">{title}</span>
        <span className="h-[2px] flex-1 bg-rail/40" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  )
}

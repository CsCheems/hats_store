import { announcements } from '../../data/site'

/**
 * Barra de avisos: mensajes de confianza siempre visibles, en oro con tinta. Los
 * avisos se separan con una raya y no con puntos ni barras verticales.
 */
export function AnnouncementBar() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-[14px] gap-y-1 bg-oro px-5 py-[10px] text-center text-[12px] font-semibold tracking-wide text-tinta uppercase">
      {announcements.map((text, i) => (
        <span key={text} className="flex items-center gap-x-[14px]">
          {i > 0 && <span aria-hidden="true">—</span>}
          {text}
        </span>
      ))}
    </div>
  )
}

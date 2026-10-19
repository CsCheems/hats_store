import { Button } from '../ui/Button'

/** Alta al boletín: UI del diseño, sin envío conectado. */
export function Newsletter() {
  return (
    <>
      <div className="mt-6 flex">
        <input
          type="email"
          placeholder="tu@correo.com"
          aria-label="Correo electrónico"
          className="h-[48px] min-w-0 flex-1 border border-r-0 border-edge bg-field px-[14px] text-[16px] text-paper placeholder:text-sand"
        />
        <Button className="shrink-0 px-[18px]">Suscribir</Button>
      </div>
      <p className="mt-[10px] text-[14px] leading-[1.5] text-sand">
        Lanzamientos y fieltro de temporada, sin spam.
      </p>
    </>
  )
}

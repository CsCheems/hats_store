import { useEffect, useState } from 'react'
import { catalogCopy } from '../../data/catalog'
import { formatMoney } from '../../utils/format'

const PASO = 100
const RETARDO = 200

/**
 * Deslizador de dos topes, con dos `<input type="range">` superpuestos y sin
 * dependencia nueva: son treinta líneas.
 *
 * Tres mecánicas lo sostienen, y quitar cualquiera lo rompe de una forma que
 * cuesta diagnosticar:
 *
 *   1. `pointer-events-none` en los inputs y `auto` solo en los pulgares. Sin
 *      esto el input que se pinta segundo se traga todos los clics de todo el
 *      ancho y el primer pulgar no se puede agarrar nunca.
 *   2. Acotar, NUNCA intercambiar. Si el bajo empuja al alto se le acota un paso
 *      por debajo; cambiarles la identidad a media arrastrada es donde estos
 *      deslizadores se vuelven locos.
 *   3. Subir el pulgar bajo pasado el punto medio. Con los dos en el máximo, el
 *      bajo queda enterrado bajo el alto y ya no se puede recuperar.
 */

// Las variantes arbitrarias van en un const de módulo, que es el modismo de la
// casa (LINK en Navbar, ITEM en AccountMenu): la geometría de un pulgar no es un
// token de tema.
const PULGAR = [
  'pointer-events-none absolute inset-0 h-[20px] w-full cursor-ew-resize appearance-none bg-transparent',
  // El anillo de :focus-visible rodearía la barra entera. Se apaga aquí y se
  // devuelve en el pulgar, que es lo que se está moviendo.
  'focus-visible:outline-none',
  // WebKit exige appearance-none EN EL PULGAR además de en el input, y su pulgar
  // por omisión es un círculo: de ahí el rounded-none explícito, porque el
  // reseteo de la capa base solo alcanza a la caja del input.
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-[20px]',
  '[&::-webkit-slider-thumb]:w-[14px] [&::-webkit-slider-thumb]:appearance-none',
  '[&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:border',
  '[&::-webkit-slider-thumb]:border-paper [&::-webkit-slider-thumb]:bg-paper',
  '[&:focus-visible::-webkit-slider-thumb]:border-rust [&:focus-visible::-webkit-slider-thumb]:bg-rust',
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-[20px]',
  '[&::-moz-range-thumb]:w-[14px] [&::-moz-range-thumb]:rounded-none',
  '[&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-paper [&::-moz-range-thumb]:bg-paper',
  '[&:focus-visible::-moz-range-thumb]:border-rust [&:focus-visible::-moz-range-thumb]:bg-rust',
  // Firefox dibuja su propia pista bajo el pulgar; la nuestra ya está debajo.
  '[&::-moz-range-track]:bg-transparent',
].join(' ')

export function PriceRange({ bounds, value, onChange }) {
  // Los topes se redondean a centenas para que el deslizador avance en pasos que
  // se leen —$1,200 y no $1,187— y para que llegar al extremo sea posible.
  const piso = Math.floor(bounds.min / PASO) * PASO
  const techo = Math.ceil(bounds.max / PASO) * PASO

  const urlBajo = value.min ?? piso
  const urlAlto = value.max ?? techo

  const [bajo, setBajo] = useState(urlBajo)
  const [alto, setAlto] = useState(urlAlto)

  // La URL mandó por fuera: navegación desde el navbar, botón atrás, «limpiar
  // filtros» o la primera respuesta del servidor, que es la que trae los topes.
  //
  // Se ajusta DURANTE EL RENDER y no en un efecto: es el patrón que React
  // documenta para poner al día un estado cuando cambia una prop, y además un
  // efecto aquí lo rechazaría react-hooks/set-state-in-effect.
  const firma = `${value.min}|${value.max}|${piso}|${techo}`
  const [vista, setVista] = useState(firma)

  if (firma !== vista) {
    setVista(firma)
    setBajo(urlBajo)
    setAlto(urlAlto)
  }

  // Los pulgares y la lectura se mueven en cada píxel; la URL —y con ella la
  // retícula— confirma al soltar. Se lee como asentarse, no como retraso.
  useEffect(() => {
    if (bajo === urlBajo && alto === urlAlto) return

    const id = setTimeout(
      // Un tope que sigue en su sitio no viaja en la URL: así «/catalogo» a
      // secas nunca acarrea un rango que no filtra nada.
      () => onChange(bajo === piso ? null : bajo, alto === techo ? null : alto),
      RETARDO,
    )

    return () => clearTimeout(id)
  }, [bajo, alto, urlBajo, urlAlto, piso, techo, onChange])

  const recorrido = techo - piso
  const pct = (valor) => (recorrido > 0 ? ((valor - piso) / recorrido) * 100 : 0)

  return (
    <div className="border-t-2 border-paper pt-[20px]">
      <p className="mb-[14px] text-[12px] font-semibold tracking-[.24em] text-gold uppercase">{catalogCopy.precio}</p>

      <div className="relative h-[20px]">
        {/* Pista y tramo elegido, los dos por debajo de los inputs. */}
        <div className="absolute top-1/2 right-0 left-0 h-[2px] -translate-y-1/2 bg-rail" />
        <div
          className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-paper"
          style={{ left: `${pct(bajo)}%`, right: `${100 - pct(alto)}%` }}
        />

        <input
          type="range"
          min={piso}
          max={techo}
          step={PASO}
          value={bajo}
          aria-label={catalogCopy.precioMin}
          aria-valuetext={formatMoney(bajo)}
          onChange={(event) => setBajo(Math.min(Number(event.target.value), alto - PASO))}
          // Con los dos pulgares arriba del todo, el bajo queda debajo del alto y
          // no hay forma de volver a agarrarlo. Pasado el punto medio, sube.
          style={{ zIndex: bajo > (piso + techo) / 2 ? 3 : 1 }}
          className={PULGAR}
        />

        <input
          type="range"
          min={piso}
          max={techo}
          step={PASO}
          value={alto}
          aria-label={catalogCopy.precioMax}
          aria-valuetext={formatMoney(alto)}
          onChange={(event) => setAlto(Math.max(Number(event.target.value), bajo + PASO))}
          style={{ zIndex: 2 }}
          className={PULGAR}
        />
      </div>

      <p className="mt-[10px] text-[14px] text-sand tabular-nums">
        {formatMoney(bajo)} — {formatMoney(alto)} {catalogCopy.moneda}
      </p>
    </div>
  )
}

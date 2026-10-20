import { Bookmark } from 'lucide-react'
import { useFavorites } from '../../context/FavoritesContext'
import { productCopy } from '../../data/shop'
import { Button } from '../ui/Button'

/**
 * El marcador de favoritos. Dos formas del mismo control:
 *
 *   · `icon`: un cuadrado con el marcador, para ponerlo sobre la foto de una
 *     tarjeta. El fondo es el de la página con algo de transparencia, así que se
 *     lee sobre cualquier foto sin tapar demasiado.
 *   · `labeled`: el botón de la ficha, con el icono y «Guardar» / «Guardado».
 *
 * El estado sale de FavoritesProvider, y como allí la respuesta es inmediata, el
 * icono cambia al pulsar sin esperar a la red. `aria-pressed` dice si está
 * marcado; la etiqueta cambia con él.
 */
export function BookmarkButton({ slug, titulo, variant = 'icon', className = '' }) {
  const { isSaved, toggle } = useFavorites()
  const guardado = isSaved(slug)
  const etiqueta = guardado ? productCopy.quitarGuardado : productCopy.guardar

  const icono = (
    <Bookmark size={variant === 'icon' ? 18 : 16} strokeWidth={1.5} fill={guardado ? 'currentColor' : 'none'} />
  )

  if (variant === 'labeled') {
    return (
      <Button
        variant="quiet"
        aria-pressed={guardado}
        onClick={() => toggle(slug, titulo)}
        className={`px-[20px] py-[14px] ${className}`}
      >
        {icono}
        {guardado ? productCopy.guardado : productCopy.guardar}
      </Button>
    )
  }

  return (
    <button
      type="button"
      aria-pressed={guardado}
      aria-label={`${etiqueta}: ${titulo}`}
      onClick={() => toggle(slug, titulo)}
      className={`grid h-[38px] w-[38px] cursor-pointer place-items-center bg-ink/85 text-paper transition-colors hover:text-gold ${guardado ? 'text-gold' : ''} ${className}`}
    >
      {icono}
    </button>
  )
}

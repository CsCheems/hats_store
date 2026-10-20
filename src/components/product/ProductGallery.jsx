import { Expand } from 'lucide-react'
import { useState } from 'react'
import { productCopy } from '../../data/shop'
import { ImageSlot } from '../ui/ImageSlot'
import { Lightbox } from './Lightbox'

/**
 * La galería de la ficha: la foto grande, las miniaturas debajo (hasta 8, las que
 * el panel permite) y, al pulsar la foto grande, el visor a pantalla completa.
 *
 * La foto grande usa el mismo encuadre que las tarjetas —4:5 con `object-cover`—,
 * así que lo que se ve recortado aquí es lo que se ve recortado en el catálogo; el
 * visor es donde se ve entera. Con una sola foto no hay miniaturas, y sin ninguna
 * se dibuja el hueco de bandas de siempre.
 *
 * El índice es de la galería y el visor lo comparte: pasar de foto en el visor
 * deja la misma elegida al cerrarlo.
 */
export function ProductGallery({ images, titulo }) {
  const [actual, setActual] = useState(0)
  const [ampliada, setAmpliada] = useState(false)

  if (images.length === 0) {
    return (
      <div className="aspect-4/5">
        <ImageSlot src={null} alt={productCopy.sinFoto} />
      </div>
    )
  }

  return (
    <div role="group" aria-label={productCopy.galeria}>
      <button
        type="button"
        aria-label={productCopy.verMejor}
        onClick={() => setAmpliada(true)}
        className="group relative block aspect-4/5 w-full cursor-zoom-in overflow-hidden"
      >
        <img
          src={images[actual]}
          alt={productCopy.foto(titulo, actual + 1, images.length)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span
          aria-hidden="true"
          className="absolute right-3 bottom-3 grid h-[38px] w-[38px] place-items-center bg-ink/85 text-paper transition-colors group-hover:text-gold"
        >
          <Expand size={17} strokeWidth={1.5} />
        </span>
      </button>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
          {images.map((url, n) => (
            <li key={url}>
              <button
                type="button"
                aria-label={productCopy.miniatura(n + 1)}
                aria-current={n === actual}
                onClick={() => setActual(n)}
                className={`block aspect-4/5 w-full cursor-pointer overflow-hidden border transition-colors ${
                  n === actual ? 'border-paper' : 'border-rail hover:border-edge'
                }`}
              >
                <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Lightbox
        open={ampliada}
        images={images}
        index={actual}
        titulo={titulo}
        onIndex={setActual}
        onClose={() => setAmpliada(false)}
      />
    </div>
  )
}

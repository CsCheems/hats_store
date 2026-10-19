import { Play } from 'lucide-react'
import { useEffect, useRef } from 'react'

/**
 * El medio del hero, modular: foto estática o video, con el mismo encuadre y el
 * mismo parallax. Lo que se muestra lo decide `hero.media` en data/home.js.
 *
 *   { type: 'image', src, alt }           una foto
 *   { type: 'video', src, poster, alt }   un MP4 en bucle, mudo
 *
 * Con `src: null` dibuja el hueco de siempre —las bandas de atardecer— y, si el
 * tipo es video, un icono de reproducir: así el diseño se puede revisar sin
 * tener todavía el archivo.
 *
 * EL PARALLAX ES UNA CAPA MÁS ALTA QUE SU CAJA. El contenedor recorta
 * (`overflow-hidden`) y la capa mide 124% de alto, con -12% arriba; `.parallax`
 * (index.css) la desplaza ±9% mientras se hace scroll. Los 12% de sobra son lo
 * que impide que asome el fondo por un borde al moverse.
 *
 * EL VIDEO RESPETA `prefers-reduced-motion`: quien lo pide no ve la imagen
 * moverse, y el video se detiene en su cuadro `poster`. Va `muted` y
 * `playsInline`, que es lo único con lo que los navegadores dejan arrancar solo.
 */
export function HeroMedia({ media, className = '' }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.pause()
  }, [media.src])

  const esVideo = media.type === 'video'

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="parallax absolute inset-x-0 -top-[12%] h-[124%]">
        {media.src && esVideo ? (
          <video
            ref={videoRef}
            src={media.src}
            poster={media.poster ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={media.alt}
            className="h-full w-full object-cover"
          />
        ) : media.src ? (
          <img src={media.src} alt={media.alt} className="h-full w-full object-cover" />
        ) : (
          // Sin archivo: las bandas de la variable —que cambian con el modo— y,
          // si es video, el icono de reproducir.
          <div
            role="img"
            aria-label={media.alt}
            style={{ background: 'var(--band-hero)' }}
            className="flex h-full w-full items-center justify-center"
          >
            {esVideo && <Play size={72} strokeWidth={1.2} aria-hidden="true" className="text-paper" />}
          </div>
        )}
      </div>

      {/* La nota sobre el formato solo existe mientras falte el archivo. */}
      {!media.src && (
        <span className="absolute bottom-5 left-6 text-[11px] tracking-[.22em] text-sand uppercase">
          {esVideo ? 'Video MP4 1080×1350, en bucle, sin audio' : 'Foto hero 1080×1350'}
        </span>
      )}
    </div>
  )
}

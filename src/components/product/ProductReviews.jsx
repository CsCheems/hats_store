import { useCallback, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { reviewsCopy } from '../../data/shop'
import { useApiResource } from '../../hooks/useApiResource'
import { getReviews } from '../../services/shop'
import { formatDate } from '../../utils/format'
import { Button } from '../ui/Button'
import { ReviewForm } from './ReviewForm'
import { StarRating } from './StarRating'

/**
 * El resumen: el promedio en grande, el total y una barra por cada puntuación,
 * de 5 a 1. Las barras son líneas de 6px —sin puntos ni degradados— y su ancho es
 * la parte que representa del total.
 */
function Summary({ resumen }) {
  return (
    <div className="grid gap-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-12">
      <div>
        <p className="font-display text-[56px] leading-none font-extrabold text-paper tabular-nums">
          {resumen.promedio}
        </p>
        <StarRating value={resumen.promedio} size={20} className="mt-3" />
        <p className="mt-2 text-[15px] text-sand">{reviewsCopy.total(resumen.total)}</p>
      </div>

      <ul className="flex flex-col gap-[10px]">
        {resumen.distribucion.map(({ estrellas, cantidad }) => (
          <li key={estrellas} className="grid grid-cols-[84px_minmax(0,1fr)_28px] items-center gap-3 text-[14px] text-sand">
            <span>{reviewsCopy.estrellas(estrellas)}</span>
            <span className="h-[6px] bg-rail">
              <span
                className="block h-full bg-gold"
                style={{ width: `${resumen.total ? (cantidad / resumen.total) * 100 : 0}%` }}
              />
            </span>
            <span className="text-right tabular-nums">{cantidad}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Las reseñas de un artículo: resumen, lista y, debajo, el formulario para quien
 * tiene sesión o la invitación a entrar para quien no.
 *
 * La lista es pública y se pide sin sesión; el formulario sí la necesita. Cuando
 * el formulario guarda o borra, le pide a esta sección que vuelva a leer la lista
 * (`onChanged`), y es la respuesta del servidor la que se pinta.
 */
export function ProductReviews({ slug }) {
  const { user, status, openAuth } = useAuth()

  const fetcher = useCallback((options) => getReviews(slug, options), [slug])
  const { data: leida, status: estado, error, reload } = useApiResource(fetcher)

  // Al releer la lista (tras publicar o borrar) useApiResource pasa por
  // 'loading' y su `data` es null. Para que la sección no se vacíe un instante se
  // recuerda la última lista leída y se sigue pintando mientras llega la nueva.
  // Guardar el valor anterior mientras se renderiza es el patrón que React
  // documenta para esto; la página monta la sección con `key={slug}` para que una
  // lista de otro artículo nunca se cuele.
  const [previa, setPrevia] = useState(null)
  if (estado === 'ready' && previa !== leida) setPrevia(leida)

  const data = estado === 'ready' ? leida : previa
  const cargando = estado === 'loading' && !previa

  return (
    <section aria-labelledby="resenas-titulo">
      <h2 id="resenas-titulo" className="font-display text-h3 font-extrabold text-paper">
        {reviewsCopy.titulo}
      </h2>

      <div className="mt-8">
        {cargando && <p className="text-[15px] text-sand">{reviewsCopy.cargando}</p>}

        {estado === 'error' && !data && (
          <p className="text-[15px] text-sand">
            {error?.message ?? reviewsCopy.error}{' '}
            <button type="button" onClick={reload} className="cursor-pointer underline hover:text-gold">
              {reviewsCopy.reintentar}
            </button>
          </p>
        )}

        {data && data.resenas.length === 0 && (
          <div>
            <p className="font-display text-[22px] font-semibold text-paper">{reviewsCopy.sinResenas}</p>
            <p className="mt-1 text-[16px] text-sand">{reviewsCopy.sePrimera}</p>
          </div>
        )}

        {data && data.resenas.length > 0 && (
          <>
            <Summary resumen={data.resumen} />

            <ul className="mt-10 flex flex-col border-t-2 border-rail">
              {data.resenas.map((resena) => (
                <li key={resena.id} className="border-b border-rail py-6">
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                    <StarRating value={resena.calificacion} size={15} />
                    <p className="text-[14px] text-sand">
                      {resena.autor} — {formatDate(resena.fecha)}
                    </p>
                  </div>
                  <p className="mt-3 max-w-[68ch] text-[17px] leading-[1.6] whitespace-pre-line text-paper">
                    {resena.texto}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="mt-12 border-t-2 border-rail pt-8">
        {/* Mientras no se sabe si hay sesión no se pinta nada: la invitación a
            entrar sería afirmar que no la hay antes de saberlo. */}
        {status === 'ready' && !user && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="text-[17px] text-sand">{reviewsCopy.invitacion}</p>
            <Button variant="quiet" onClick={() => openAuth('login')} className="px-[22px] py-[10px]">
              {reviewsCopy.entrar}
            </Button>
          </div>
        )}

        {user && <ReviewForm slug={slug} onChanged={reload} />}
      </div>
    </section>
  )
}

import { useCallback, useEffect, useState } from 'react'

const CARGANDO = { status: 'loading', data: null, error: null }

/**
 * Pedir algo a la API y quedarse con el resultado.
 *
 * Las tres vistas del panel hacen exactamente lo mismo —pedir, guardar, cancelar
 * al desmontar y saber en cuál de los tres estados están—, y ese patrón ya
 * estaba escrito a mano en el arranque de AuthProvider con un `let vigente`.
 * Escribirlo cuatro veces es como se acaba teniendo cuatro versiones distintas
 * de la cancelación, tres de ellas con una fuga.
 *
 * Aquí se aborta de verdad con AbortController en vez de con el `let vigente` de
 * allá: la diferencia es que la petición se corta en la red, no solo se ignora
 * la respuesta. AuthProvider no puede hacerlo —su llamada tiene que terminar
 * pase lo que pase, porque de ella depende que `status` deje de ser 'checking'—,
 * así que las dos formas conviven a propósito.
 *
 * `fetcher` TIENE que venir de un useCallback. No es una molestia gratuita: es
 * lo que hace que el hook sepa cuándo volver a pedir. En cuanto la categoría de
 * la URL cambie, cambia el fetcher, y con él la dependencia del efecto — la
 * tabla se recarga sola sin que la página tenga que acordarse de decirlo. Un
 * fetcher declarado en línea cambiaría en cada render y pediría sin parar.
 * (Cuando la petición no lleva argumentos —getSummary, getCategories— la propia
 * función del módulo ya es una referencia estable y se pasa tal cual.)
 *
 * NO HAY «CARGANDO» GUARDADO EN NINGÚN ESTADO, y esa es la decisión de diseño de
 * este archivo. Lo guardado apunta a qué petición pertenece; si no es la
 * vigente, es que la vigente aún no ha contestado, y eso ya *es* estar cargando.
 * Derivarlo en vez de escribirlo evita el setState síncrono dentro del efecto
 * —que encadena un render de más cada vez— y, de regalo, hace imposible el fallo
 * clásico: una respuesta lenta que llega tarde y pinta las botas bajo el título
 * de los sombreros. Aunque se colara, no sería «al día» y se ignoraría sola.
 *
 * @param {(options: { signal: AbortSignal }) => Promise<unknown>} fetcher
 * @returns {{ status: 'loading'|'ready'|'error', data: unknown, error: Error|null, reload: () => void }}
 */
export function useApiResource(fetcher) {
  const [resultado, setResultado] = useState(null)

  // El contador del «reintentar». Es la única forma de volver a lanzar un efecto
  // cuyas dependencias no han cambiado — y no han cambiado: falló el servidor,
  // no la petición.
  const [intento, setIntento] = useState(0)

  const reload = useCallback(() => setIntento((n) => n + 1), [])

  useEffect(() => {
    const controller = new AbortController()

    // Cada resultado se guarda firmado con la petición que lo produjo. Es lo que
    // permite saber después si sigue valiendo.
    const guardar = (parcial) => setResultado({ fetcher, intento, ...parcial })

    fetcher({ signal: controller.signal })
      .then((data) => guardar({ status: 'ready', data, error: null }))
      .catch((error) => {
        // Cancelado por el `abort` de aquí abajo, casi siempre porque el
        // componente ya no está. No es un fallo y no hay a quién contárselo.
        if (error.code === 'canceled') return

        guardar({ status: 'error', data: null, error })
      })

    return () => controller.abort()
  }, [fetcher, intento])

  const alDia = resultado?.fetcher === fetcher && resultado?.intento === intento

  const { status, data, error } = alDia ? resultado : CARGANDO

  return { status, data, error, reload }
}

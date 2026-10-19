import { useMemo, useRef, useState } from 'react'
import { CatalogFilters } from '../../components/catalog/CatalogFilters'
import { CatalogGrid } from '../../components/catalog/CatalogGrid'
import { CatalogHero } from '../../components/catalog/CatalogHero'
import { CatalogPagination } from '../../components/catalog/CatalogPagination'
import { CatalogState } from '../../components/catalog/CatalogState'
import { CatalogToolbar } from '../../components/catalog/CatalogToolbar'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar'
import { Footer } from '../../components/layout/Footer'
import { Navbar } from '../../components/layout/Navbar'
import { catalogCopy } from '../../data/catalog'
import { useApiResource } from '../../hooks/useApiResource'
import { useCatalogFilters } from '../../hooks/useCatalogFilters'
import { getCatalog } from '../../services/catalog'
import { filtrarProductos, indexar, paginar } from '../../utils/catalog'

/**
 * El catálogo entero. La misma cáscara que la portada —anuncio, navbar, footer—;
 * lo que cambia es que esta página SÍ pide sus datos al servidor.
 *
 * SE PIDE UNA VEZ Y SE FILTRA EN MEMORIA. `getCatalog` es una función de módulo
 * sin argumentos, así que es una referencia estable y cambiar un filtro no cambia
 * el fetcher: useApiResource no vuelve a pedir nunca. Es lo que permite que el
 * deslizador de precio responda al arrastre en vez de esperar a la red, y lo que
 * hace que las cuentas de las casillas sean las del catálogo entero —si
 * encogieran al filtrar, nadie sabría qué se está perdiendo—.
 *
 * `abierto` es estado local y no un parámetro de la URL: si el panel de filtros está
 * desplegado es un modo de la interfaz, no un filtro, y compartir un enlace no
 * debe abrirle el panel a quien lo reciba. La PÁGINA sí va en la URL, con el
 * mismo criterio al revés: «mira la página 3 de esto» es una dirección que se
 * comparte, y el botón atrás tiene que deshacerla.
 */
export default function Catalog() {
  const { data, status, error, reload } = useApiResource(getCatalog)
  const { filtros, activos, acciones } = useCatalogFilters()
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const resultadosRef = useRef(null)

  // Una vez por respuesta: los mapas de rótulo y la cadena de búsqueda ya
  // normalizada de cada pieza. Filtrar después no vuelve a tocar ninguna de las
  // dos cosas.
  const catalogo = useMemo(() => (data ? indexar(data) : null), [data])

  const resultados = useMemo(
    () => (catalogo ? filtrarProductos(catalogo.items, filtros, catalogo.facetas.precio) : []),
    [catalogo, filtros],
  )

  // Se pagina DESPUÉS de filtrar y sobre el resultado entero, que es lo que hace
  // que la barra siga contando todos los sombreros mientras la retícula enseña
  // nueve.
  const pagina = useMemo(
    () => paginar(resultados, filtros.pagina),
    [resultados, filtros.pagina],
  )

  /**
   * Cambiar de página deja la vista a media retícula, así que hay que volver
   * arriba. Va en el manejador y no en un efecto sobre `filtros.pagina`: un
   * efecto también saltaría en el primer render y al llegar desde el navbar con
   * un filtro puesto, que es un salto que nadie pidió.
   */
  const irAPagina = (n) => {
    acciones.irAPagina(n)
    resultadosRef.current?.scrollIntoView()
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />

      <main>
        <CatalogHero />

        <section className="bg-panel px-gutter py-[clamp(38px,5vw,72px)]">
          {/* `scroll-mt` para que al cambiar de página el ancla no quede debajo
              del navbar pegajoso: sus 80px más el aire de la barra. */}
          <div ref={resultadosRef} className="mx-auto max-w-shell scroll-mt-[100px]">
            {status !== 'ready' ? (
              <CatalogState status={status} error={error} onRetry={reload} />
            ) : (
              <>
                {/* La barra va por encima de las dos columnas, y eso resuelve un
                    detalle de móvil: si el botón «Filtros» estuviera debajo del
                    panel, abrirlo lo empujaría hacia abajo y se movería justo
                    bajo el dedo que acaba de pulsarlo. */}
                <CatalogToolbar
                  count={resultados.length}
                  total={catalogo.total}
                  activos={activos}
                  rotulos={catalogo.rotulos}
                  precio={catalogo.facetas.precio}
                  filtros={filtros}
                  acciones={acciones}
                  filtrosAbiertos={filtrosAbiertos}
                  onToggleFiltros={() => setFiltrosAbiertos((abierto) => !abierto)}
                />

                <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-[clamp(40px,4.4vw,64px)]">
                  {/* EL PANEL DE FILTROS NO ES PEGAJOSO, y no es un descuido: aun con dos
                      grupos de casillas mide más que una ventana baja, y un
                      `sticky` lo clavaría con su último grupo fuera de cuadro y
                      sin forma de alcanzarlo. `self-start` sí se queda: sin él la
                      columna se estira a lo alto de la fila y el panel se
                      estiraría con ella. */}
                  <aside
                    aria-label={catalogCopy.filtros}
                    className={`${filtrosAbiertos ? 'mb-[28px] block' : 'hidden'} lg:mb-0 lg:block lg:self-start`}
                  >
                    <CatalogFilters
                      facetas={catalogo.facetas}
                      filtros={filtros}
                      acciones={acciones}
                    />
                  </aside>

                  {/* La retícula y sus números son una sola columna: el div
                      envuelve a los dos para que la paginación no se convierta
                      en una tercera fila de la retícula exterior, debajo del
                      panel. */}
                  <div>
                    <CatalogGrid
                      items={pagina.items}
                      rotulos={catalogo.rotulos}
                      onLimpiar={acciones.limpiar}
                    />

                    <CatalogPagination
                      pagina={pagina.pagina}
                      total={pagina.total}
                      onIr={irAPagina}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

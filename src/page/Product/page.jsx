import { TriangleAlert } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar'
import { Footer } from '../../components/layout/Footer'
import { Navbar } from '../../components/layout/Navbar'
import { ProductBuy } from '../../components/product/ProductBuy'
import { ProductGallery } from '../../components/product/ProductGallery'
import { ProductReviews } from '../../components/product/ProductReviews'
import { SuggestedProducts } from '../../components/product/SuggestedProducts'
import { Button } from '../../components/ui/Button'
import { Frame } from '../../components/ui/Frame'
import { catalogPath } from '../../data/catalog'
import { productCopy } from '../../data/shop'
import { useApiResource } from '../../hooks/useApiResource'
import { getCatalog } from '../../services/catalog'
import { getProduct } from '../../services/shop'
import { formatMoney } from '../../utils/format'

// Cuántas sugerencias caben en la columna lateral.
const SUGERENCIAS = 4

/**
 * Las sugerencias salen del catálogo que la tienda ya sabe pedir: primero otros
 * sombreros de la misma categoría, después del resto, y dentro de cada grupo los
 * que hay en existencia antes que los agotados. No hay endpoint propio: el
 * catálogo entero son unos 10 kB y ya se pide para la página de catálogo.
 */
function sugerir(items, actual) {
  const otros = items.filter((item) => item.id !== actual.id)
  const primero = (a, b) => Number(b.disponible) - Number(a.disponible)

  const misma = otros.filter((item) => item.categoria === actual.categoria).sort(primero)
  const resto = otros.filter((item) => item.categoria !== actual.categoria).sort(primero)

  return [...misma, ...resto].slice(0, SUGERENCIAS)
}

function Estado({ status, error, onRetry }) {
  if (status === 'loading') {
    return (
      <Frame weight="strong" className="grid min-h-[320px] place-items-center">
        <p className="text-[13px] font-semibold tracking-label text-sand uppercase">{productCopy.cargando}</p>
      </Frame>
    )
  }

  // Un artículo que no existe, está en borrador o se archivó da el mismo 404: no
  // es un fallo, es que ese enlace ya no lleva a nada.
  const noExiste = error?.status === 404

  return (
    <Frame weight="strong" className="grid min-h-[320px] place-items-center px-6">
      <div className="max-w-[400px] text-center">
        <TriangleAlert size={22} strokeWidth={1.5} className="mx-auto text-rust" />

        <p className="mt-[14px] font-display text-[26px] leading-[1.15] font-semibold text-paper">
          {noExiste ? productCopy.noExisteTitulo : productCopy.errorTitulo}
        </p>
        <p className="mt-[8px] text-[17px] leading-[1.4] text-sand">
          {noExiste ? productCopy.noExisteCuerpo : error?.message}
        </p>

        {noExiste ? (
          <Button as={Link} to="/catalogo" variant="quiet" className="mt-[18px] px-[22px] py-[10px]">
            {productCopy.volverCatalogo}
          </Button>
        ) : (
          <Button variant="quiet" onClick={onRetry} className="mt-[18px] px-[22px] py-[10px]">
            {productCopy.reintentar}
          </Button>
        )}
      </div>
    </Frame>
  )
}

/** Inicio — Catálogo — Categoría — Título. Con raya y no con puntos ni barras. */
function Ruta({ producto }) {
  const enlace = 'transition-colors hover:text-gold'

  return (
    <nav aria-label="Ruta" className="text-[13px] tracking-label text-sand uppercase">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <li>
          <Link to="/" className={enlace}>
            {productCopy.inicio}
          </Link>
        </li>
        <li aria-hidden="true">—</li>
        <li>
          <Link to="/catalogo" className={enlace}>
            {productCopy.catalogo}
          </Link>
        </li>
        <li aria-hidden="true">—</li>
        <li>
          <Link to={catalogPath({ categoria: producto.categoria })} className={enlace}>
            {producto.categoriaLabel}
          </Link>
        </li>
        <li aria-hidden="true">—</li>
        <li aria-current="page" className="text-paper">
          {producto.titulo}
        </li>
      </ol>
    </nav>
  )
}

/**
 * La ficha de un artículo: /producto/:slug.
 *
 * Se monta con `key={slug}` por una razón concreta: al pasar de una ficha a otra
 * desde las sugerencias, el router reutiliza la misma instancia, y con ella la foto
 * elegida, la cantidad y la reseña a medio escribir del artículo anterior.
 * Remontar es la forma de que cada ficha empiece de cero.
 */
export default function Product() {
  const { slug } = useParams()

  return <Ficha key={slug} slug={slug} />
}

function Ficha({ slug }) {
  const fetcher = useCallback((options) => getProduct(slug, options), [slug])
  const detalle = useApiResource(fetcher)

  // Las sugerencias no bloquean la ficha: si el catálogo falla, simplemente no
  // hay columna lateral.
  const catalogo = useApiResource(getCatalog)

  const producto = detalle.data

  const sugerencias = useMemo(
    () => (producto && catalogo.data ? sugerir(catalogo.data.items, producto) : []),
    [producto, catalogo.data],
  )

  const rotulos = useMemo(
    () => new Map((catalogo.data?.facetas.categorias ?? []).map((c) => [c.id, c.label])),
    [catalogo.data],
  )

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />

      <main className="px-gutter py-[clamp(28px,4vw,56px)]">
        <div className="mx-auto max-w-shell">
          {detalle.status !== 'ready' ? (
            <Estado status={detalle.status} error={detalle.error} onRetry={detalle.reload} />
          ) : (
            <>
              <Ruta producto={producto} />

              <div className="mt-8 grid gap-[clamp(40px,5vw,72px)] xl:grid-cols-[minmax(0,1fr)_300px]">
                <div className="min-w-0">
                  <div className="grid gap-[clamp(28px,4vw,56px)] md:grid-cols-2">
                    <ProductGallery images={producto.imagenes} titulo={producto.titulo} />

                    <div className="flex flex-col gap-7">
                      <div>
                        <Link
                          to={catalogPath({ categoria: producto.categoria })}
                          className="text-[12px] font-semibold tracking-kicker text-gold uppercase transition-colors hover:text-paper"
                        >
                          {producto.categoriaLabel}
                        </Link>
                        <h1 className="mt-3 font-display text-h2 font-extrabold text-paper">{producto.titulo}</h1>
                        <p className="mt-4 font-display text-[34px] leading-none font-semibold text-paper">
                          {formatMoney(producto.precio)}
                        </p>
                      </div>

                      <dl className="border-t-2 border-rail text-[16px]">
                        <div className="flex justify-between gap-4 border-b border-rail py-3">
                          <dt className="text-sand">{productCopy.disponibilidad}</dt>
                          <dd className="text-paper">{producto.disponible ? productCopy.disponible : productCopy.agotado}</dd>
                        </div>
                        {producto.fieltro && (
                          <div className="flex justify-between gap-4 border-b border-rail py-3">
                            <dt className="text-sand">{productCopy.fieltro}</dt>
                            <dd className="text-paper uppercase">{producto.fieltro}</dd>
                          </div>
                        )}
                      </dl>

                      <ProductBuy product={producto} />

                      <div>
                        <h2 className="text-[13px] font-semibold tracking-label text-sand uppercase">
                          {productCopy.descripcion}
                        </h2>
                        <p className="mt-3 max-w-[62ch] text-[18px] leading-[1.65] whitespace-pre-line text-paper">
                          {producto.descripcion}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-[clamp(56px,7vw,104px)]">
                    <ProductReviews key={slug} slug={slug} />
                  </div>
                </div>

                {/* Pegajosa en pantallas anchas: la ficha y las reseñas son largas
                    y las sugerencias se quedan a la vista mientras se baja. */}
                <div className="xl:sticky xl:top-[110px] xl:self-start xl:border-l xl:border-rail xl:pl-10">
                  <SuggestedProducts items={sugerencias} rotulos={rotulos} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

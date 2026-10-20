import { LayoutGrid, List } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { CatalogCard } from '../../components/catalog/CatalogCard'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar'
import { Footer } from '../../components/layout/Footer'
import { Navbar } from '../../components/layout/Navbar'
import { SavedList } from '../../components/shop/SavedList'
import { ShopState } from '../../components/shop/ShopState'
import { SignInGate } from '../../components/shop/SignInGate'
import { Button } from '../../components/ui/Button'
import { Frame } from '../../components/ui/Frame'
import { useAuth } from '../../context/AuthContext'
import { useFavorites } from '../../context/FavoritesContext'
import { savedCopy } from '../../data/shop'

// Las dos vistas. La elegida va en la dirección (`?vista=lista`): como en el
// catálogo, así se comparte, sobrevive a recargar y el botón atrás la deshace. El
// catálogo es la de por omisión y no escribe nada en la URL.
const VISTAS = [
  { key: 'catalogo', label: savedCopy.vistaCatalogo, Icon: LayoutGrid },
  { key: 'lista', label: savedCopy.vistaLista, Icon: List },
]

function Vista({ actual, onElegir }) {
  return (
    <div role="group" aria-label={savedCopy.vista} className="inline-flex border border-edge">
      {VISTAS.map(({ key, label, Icon }) => {
        const activa = actual === key

        return (
          <button
            key={key}
            type="button"
            aria-pressed={activa}
            onClick={() => onElegir(key)}
            className={`flex h-[40px] cursor-pointer items-center gap-2 px-4 text-[13px] font-semibold tracking-[.14em] uppercase transition-colors ${
              activa ? 'bg-paper text-ink' : 'text-paper hover:bg-hover hover:text-on-hover'
            }`}
          >
            <Icon size={15} strokeWidth={1.5} />
            {label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Los sombreros que la persona marcó, en dos vistas: el catálogo (las mismas
 * tarjetas de /catalogo) o una lista compacta. Es de la cuenta, así que sin sesión
 * invita a entrar en vez de redirigir, como /perfil.
 */
export default function Saved() {
  const { user, status: sesion } = useAuth()
  const { items, status, error, reload } = useFavorites()
  const [params, setParams] = useSearchParams()

  const vista = params.get('vista') === 'lista' ? 'lista' : 'catalogo'

  const elegirVista = (key) => {
    const siguiente = new URLSearchParams(params)
    if (key === 'catalogo') siguiente.delete('vista')
    else siguiente.set('vista', key)
    setParams(siguiente, { replace: true })
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />

      <main>
        <section className="px-gutter pt-[clamp(48px,6vw,88px)] pb-[clamp(40px,5vw,72px)]">
          <div className="mx-auto flex max-w-shell flex-wrap items-end justify-between gap-6">
            <div>
              <span className="block text-[12px] font-semibold tracking-kicker text-gold uppercase">{savedCopy.kicker}</span>
              <h1 className="mt-4 font-display text-h1 font-extrabold tracking-[-.02em] text-paper">{savedCopy.title}</h1>
            </div>
            <p className="max-w-[34ch] text-[18px] leading-[1.55] text-sand">{savedCopy.intro}</p>
          </div>
        </section>

        <section className="bg-panel px-gutter py-[clamp(38px,5vw,72px)]">
          <div className="mx-auto max-w-shell">
            {/* Mientras no se sabe si hay sesión no se pinta la invitación:
                afirmaría que no la hay antes de saberlo. */}
            {sesion === 'checking' ? null : !user ? (
              <SignInGate
                kicker={savedCopy.invitacionKicker}
                title={savedCopy.invitacionTitulo}
                body={savedCopy.invitacionCuerpo}
              />
            ) : status === 'loading' || status === 'error' ? (
              <ShopState status={status} error={error} copy={savedCopy} onRetry={reload} />
            ) : items.length === 0 ? (
              <Frame weight="strong" className="grid min-h-[280px] place-items-center px-6">
                <div className="max-w-[400px] text-center">
                  <p className="font-display text-[26px] leading-[1.15] font-semibold text-paper">{savedCopy.vacioTitulo}</p>
                  <p className="mt-[8px] text-[17px] leading-[1.4] text-sand">{savedCopy.vacioCuerpo}</p>
                  <Button as={Link} to="/catalogo" variant="quiet" className="mt-[18px] px-[22px] py-[10px]">
                    {savedCopy.verCatalogo}
                  </Button>
                </div>
              </Frame>
            ) : (
              <>
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b-2 border-rail pb-5">
                  <p className="text-[17px] text-sand" aria-live="polite">
                    {savedCopy.cuenta(items.length)}
                  </p>
                  <Vista actual={vista} onElegir={elegirVista} />
                </div>

                {vista === 'lista' ? (
                  <SavedList items={items} />
                ) : (
                  <div className="grid grid-cols-1 content-start gap-[clamp(28px,3vw,44px)] sm:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => (
                      <CatalogCard key={item.id} product={item} categoria={item.categoriaLabel} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

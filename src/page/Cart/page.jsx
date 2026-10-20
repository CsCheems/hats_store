import { Link } from 'react-router-dom'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar'
import { Footer } from '../../components/layout/Footer'
import { Navbar } from '../../components/layout/Navbar'
import { CartLine } from '../../components/shop/CartLine'
import { ShopState } from '../../components/shop/ShopState'
import { SignInGate } from '../../components/shop/SignInGate'
import { Button } from '../../components/ui/Button'
import { Frame } from '../../components/ui/Frame'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { cartCopy } from '../../data/shop'
import { formatMoney } from '../../utils/format'

/**
 * La bolsa: /carrito. Lista lo que la persona añadió, deja cambiar cantidades o
 * quitar artículos y enseña el total. Es de la cuenta, así que sin sesión invita
 * a entrar en vez de redirigir.
 *
 * El pago todavía no existe (no hay pedidos en la base): el botón está, pero
 * deshabilitado y con su nota. Cuando haya checkout, aquí es donde empieza.
 *
 * Las cantidades y el total son los que el servidor devolvió en la última
 * escritura; esta página no suma nada por su cuenta, salvo el subtotal de cada
 * línea para pintarlo.
 */
export default function Cart() {
  const { user, status: sesion } = useAuth()
  const { items, unidades, total, status, error, ocupada, setQuantity, remove, reload } = useCart()

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />

      <main>
        <section className="px-gutter pt-[clamp(48px,6vw,88px)] pb-[clamp(40px,5vw,72px)]">
          <div className="mx-auto max-w-shell">
            <span className="block text-[12px] font-semibold tracking-kicker text-gold uppercase">{cartCopy.kicker}</span>
            <h1 className="mt-4 font-display text-h1 font-extrabold tracking-[-.02em] text-paper">{cartCopy.title}</h1>
          </div>
        </section>

        <section className="bg-panel px-gutter py-[clamp(38px,5vw,72px)]">
          <div className="mx-auto max-w-shell">
            {sesion === 'checking' ? null : !user ? (
              <SignInGate
                kicker={cartCopy.invitacionKicker}
                title={cartCopy.invitacionTitulo}
                body={cartCopy.invitacionCuerpo}
              />
            ) : status === 'loading' || status === 'error' ? (
              <ShopState status={status} error={error} copy={cartCopy} onRetry={reload} />
            ) : items.length === 0 ? (
              <Frame weight="strong" className="grid min-h-[280px] place-items-center px-6">
                <div className="max-w-[400px] text-center">
                  <p className="font-display text-[26px] leading-[1.15] font-semibold text-paper">{cartCopy.vacioTitulo}</p>
                  <p className="mt-[8px] text-[17px] leading-[1.4] text-sand">{cartCopy.vacioCuerpo}</p>
                  <Button as={Link} to="/catalogo" variant="quiet" className="mt-[18px] px-[22px] py-[10px]">
                    {cartCopy.verCatalogo}
                  </Button>
                </div>
              </Frame>
            ) : (
              <div className="grid gap-[clamp(36px,5vw,64px)] lg:grid-cols-[minmax(0,1fr)_340px]">
                <ul aria-busy={ocupada} className="min-w-0 border-t-2 border-rail">
                  {items.map((item) => (
                    <CartLine
                      key={item.id}
                      item={item}
                      ocupada={ocupada}
                      onQuantity={(cantidad) => setQuantity(item.id, cantidad)}
                      onRemove={() => remove(item.id)}
                    />
                  ))}
                </ul>

                <aside aria-label={cartCopy.resumen} className="lg:sticky lg:top-[110px] lg:self-start">
                  <Frame weight="strong" className="px-[clamp(20px,3vw,28px)] py-[clamp(22px,3vw,30px)]">
                    <h2 className="font-display text-[24px] font-extrabold text-paper">{cartCopy.resumen}</h2>

                    <dl className="mt-5 border-t-2 border-rail text-[16px]">
                      <div className="flex justify-between gap-4 border-b border-rail py-3">
                        <dt className="text-sand">{cartCopy.articulos(unidades)}</dt>
                        <dd className="text-paper tabular-nums">{formatMoney(total)}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4 py-4">
                        <dt className="text-[13px] font-semibold tracking-label text-sand uppercase">{cartCopy.total}</dt>
                        <dd className="font-display text-[30px] font-semibold text-paper tabular-nums">
                          {formatMoney(total)}
                        </dd>
                      </div>
                    </dl>

                    <Button disabled className="mt-2 w-full px-[26px] py-[14px]">
                      {cartCopy.pagar}
                    </Button>
                    <p className="mt-3 text-[14px] leading-[1.45] text-sand">{cartCopy.pagarNota}</p>

                    <Link
                      to="/catalogo"
                      className="mt-5 inline-block text-[13px] font-semibold tracking-[.14em] text-paper uppercase underline-offset-4 transition-colors hover:text-gold hover:underline"
                    >
                      {cartCopy.continuar}
                    </Link>
                  </Frame>
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

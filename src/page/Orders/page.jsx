import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar'
import { Footer } from '../../components/layout/Footer'
import { Navbar } from '../../components/layout/Navbar'
import { ShopState } from '../../components/shop/ShopState'
import { SignInGate } from '../../components/shop/SignInGate'
import { Button } from '../../components/ui/Button'
import { Frame } from '../../components/ui/Frame'
import { ImageSlot } from '../../components/ui/ImageSlot'
import { useAuth } from '../../context/AuthContext'
import { orderCopy, ordersCopy } from '../../data/checkout'
import { useApiResource } from '../../hooks/useApiResource'
import { getOrders } from '../../services/pedidos'
import { formatMoney } from '../../utils/format'

// Un instante, no una fecha de calendario: se pasa por Date (formatDate de
// utils/format es para las fechas sin hora).
const FECHA = new Intl.DateTimeFormat('es-MX', { dateStyle: 'long' })

// Cuántas fotos caben en la fila antes de resumir el resto en «+N».
const MINIATURAS = 3

/**
 * Mis pedidos: /pedidos. Los que se pagaron, del más reciente al más antiguo, cada
 * uno con sus fotos, su estado y su total; el desglose y la dirección están un
 * clic más allá, en /pedido/:folio.
 *
 * Es de la cuenta, así que sin sesión invita a entrar en vez de redirigir, como la
 * bolsa y Guardados. La lista se pide ligada al id de la sesión: al entrar desde
 * el modal, la página se llena sola.
 */
export default function Orders() {
  const { user, status: sesion } = useAuth()

  const userId = user?.id ?? null
  const pedirPedidos = useCallback((options) => (userId ? getOrders(options) : Promise.resolve(null)), [userId])
  const { status, data, error, reload } = useApiResource(pedirPedidos)

  const pedidos = data?.pedidos ?? []

  let contenido

  if (sesion === 'checking') contenido = null
  else if (!user)
    contenido = (
      <SignInGate
        kicker={ordersCopy.invitacionKicker}
        title={ordersCopy.invitacionTitulo}
        body={ordersCopy.invitacionCuerpo}
      />
    )
  else if (status !== 'ready' || !data)
    contenido = <ShopState status={status === 'error' ? 'error' : 'loading'} error={error} copy={ordersCopy} onRetry={reload} />
  else if (pedidos.length === 0)
    contenido = (
      <Frame weight="strong" className="grid min-h-[280px] place-items-center px-6">
        <div className="max-w-[400px] text-center">
          <p className="font-display text-[26px] leading-[1.15] font-semibold text-paper">{ordersCopy.vacioTitulo}</p>
          <p className="mt-[8px] text-[17px] leading-[1.4] text-sand">{ordersCopy.vacioCuerpo}</p>
          <Button as={Link} to="/catalogo" variant="quiet" className="mt-[18px] px-[22px] py-[10px]">
            {ordersCopy.verCatalogo}
          </Button>
        </div>
      </Frame>
    )
  else
    contenido = (
      <>
        <p className="mb-5 text-[13px] font-semibold tracking-label text-sand uppercase">{ordersCopy.cuenta(pedidos.length)}</p>

        <ul className="border-t-2 border-rail">
          {pedidos.map((pedido) => {
            const visibles = pedido.items.slice(0, MINIATURAS)
            const resto = pedido.items.length - visibles.length

            return (
              <li
                key={pedido.folio}
                className="grid gap-x-8 gap-y-4 border-b border-rail py-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="flex items-center gap-2" aria-hidden="true">
                  {visibles.map((item) => (
                    <div key={item.id} className="aspect-4/5 w-[56px] overflow-hidden">
                      <ImageSlot src={item.foto} alt="" />
                    </div>
                  ))}
                  {resto > 0 && <span className="px-2 text-[15px] text-sand">+{resto}</span>}
                </div>

                <div className="min-w-0">
                  <Link
                    to={`/pedido/${pedido.folio}`}
                    className="font-display text-[22px] leading-[1.2] font-semibold text-paper transition-colors hover:text-gold"
                  >
                    {pedido.folio}
                  </Link>
                  <span className="mt-1 block text-[15px] text-sand">
                    {FECHA.format(new Date(pedido.pagado))}
                  </span>
                  <span className="mt-1 block text-[15px] text-paper">
                    {orderCopy.estados[pedido.estado] ?? pedido.estado}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end sm:gap-2">
                  <span className="font-display text-[22px] font-semibold text-paper tabular-nums">
                    {formatMoney(pedido.total)}
                    <span className="block text-right text-[13px] font-normal text-sand">
                      {ordersCopy.piezas(pedido.unidades)}
                    </span>
                  </span>
                  <Link
                    to={`/pedido/${pedido.folio}`}
                    className="text-[13px] font-semibold tracking-[.14em] text-paper uppercase underline-offset-4 transition-colors hover:text-gold hover:underline"
                  >
                    {ordersCopy.ver}
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      </>
    )

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />

      <main>
        <section className="px-gutter pt-[clamp(48px,6vw,88px)] pb-[clamp(40px,5vw,72px)]">
          <div className="mx-auto max-w-shell">
            <span className="block text-[12px] font-semibold tracking-kicker text-gold uppercase">{ordersCopy.kicker}</span>
            <h1 className="mt-4 font-display text-h1 font-extrabold tracking-[-.02em] text-paper">{ordersCopy.title}</h1>
            <p className="mt-4 max-w-[52ch] text-[18px] leading-[1.5] text-sand">{ordersCopy.intro}</p>
          </div>
        </section>

        <section className="bg-panel px-gutter py-[clamp(38px,5vw,72px)]">
          <div className="mx-auto max-w-shell">{contenido}</div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

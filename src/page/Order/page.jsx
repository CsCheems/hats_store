import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { OrderSummary } from '../../components/checkout/OrderSummary'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar'
import { Footer } from '../../components/layout/Footer'
import { Navbar } from '../../components/layout/Navbar'
import { ShopState } from '../../components/shop/ShopState'
import { SignInGate } from '../../components/shop/SignInGate'
import { Button } from '../../components/ui/Button'
import { Frame } from '../../components/ui/Frame'
import { ImageSlot } from '../../components/ui/ImageSlot'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { checkoutToasts, orderCopy } from '../../data/checkout'
import { useApiResource } from '../../hooks/useApiResource'
import { cancelOrder, getOrder } from '../../services/pedidos'
import { formatMoney } from '../../utils/format'

// «2026-10-19T18:04:00+00:00» → «19 de octubre de 2026». Con hora: se pasa por
// Date porque es un instante, no una fecha de calendario (formatDate de
// utils/format es para estas últimas).
const FECHA = new Intl.DateTimeFormat('es-MX', { dateStyle: 'long' })

function Dato({ titulo, children }) {
  return (
    <div className="border-t-2 border-rail pt-4">
      <dt className="text-[13px] font-semibold tracking-label text-sand uppercase">{titulo}</dt>
      <dd className="mt-2 text-[16px] leading-[1.5] text-paper">{children}</dd>
    </div>
  )
}

/**
 * El pedido hecho: /pedido/:folio. Lo que llega al pagar y lo que sobrevive a
 * recargar. Repite lo que se compró, adónde va, cómo se pagó y el desglose con el
 * IVA; todo lo calcula el servidor con la tasa y el envío de ese día.
 *
 * Un pedido ajeno o inexistente da 404 desde el servidor, y aquí se dice igual
 * para los dos: no confirma que un folio existe.
 *
 * Mientras el pedido esté `pendiente` (pagado y sin enviar) se puede cancelar desde
 * aquí, con una confirmación en el propio panel de la derecha. Es la regla de
 * negocio: enviado o entregado ya no se cancela, y entonces el botón no existe y se
 * dice por qué. Quien manda es el servidor (409 si el pedido salió mientras la
 * página estaba abierta); esto solo evita ofrecer lo que no se puede.
 */
export default function Order() {
  const { folio } = useParams()
  const { user, status: sesion } = useAuth()
  const { pushToast } = useToast()

  // Cancelar devuelve el pedido como quedó, y esa respuesta sustituye al cargado.
  // Va firmada con el folio para no arrastrarla a otro pedido si cambia la URL.
  const [cancelado, setCancelado] = useState(null)
  const [confirmando, setConfirmando] = useState(false)
  const [cancelando, setCancelando] = useState(false)

  const userId = user?.id ?? null
  const pedirPedido = useCallback(
    (options) => (userId ? getOrder(folio, options) : Promise.resolve(null)),
    [userId, folio],
  )
  const { status, data: cargado, error, reload } = useApiResource(pedirPedido)

  const pedido = cancelado?.folio === folio ? cancelado.pedido : cargado

  const cancelar = async () => {
    setCancelando(true)

    try {
      const actualizado = await cancelOrder(folio)

      setCancelado({ folio, pedido: actualizado })
      pushToast(checkoutToasts.cancelado(actualizado.folio))
    } catch (fallo) {
      pushToast({ ...checkoutToasts.cancelFailure, body: fallo.message })
      // Si salió de la tienda mientras la página estaba abierta, se vuelve a
      // pedir para que deje de ofrecer el botón.
      if (fallo.code === 'cannot_cancel') reload()
    } finally {
      setCancelando(false)
      setConfirmando(false)
    }
  }

  let contenido

  if (sesion === 'checking') contenido = null
  else if (!user)
    contenido = (
      <SignInGate
        kicker={orderCopy.invitacionKicker}
        title={orderCopy.invitacionTitulo}
        body={orderCopy.invitacionCuerpo}
      />
    )
  else if (status === 'error' && error?.status === 404)
    contenido = (
      <Frame weight="strong" className="grid min-h-[280px] place-items-center px-6">
        <div className="max-w-[420px] text-center">
          <p className="font-display text-[26px] leading-[1.15] font-semibold text-paper">{orderCopy.noExisteTitulo}</p>
          <p className="mt-[8px] text-[17px] leading-[1.4] text-sand">{orderCopy.noExisteCuerpo}</p>
          <Button as={Link} to="/catalogo" variant="quiet" className="mt-[18px] px-[22px] py-[10px]">
            {orderCopy.seguirComprando}
          </Button>
        </div>
      </Frame>
    )
  else if (status !== 'ready' || !pedido)
    contenido = <ShopState status={status === 'error' ? 'error' : 'loading'} error={error} copy={orderCopy} onRetry={reload} />
  else
    contenido = (
      <div className="grid gap-[clamp(36px,5vw,64px)] lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0">
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <Dato titulo={orderCopy.folio}>
              <span className="font-display text-[22px] font-semibold">{pedido.folio}</span>
            </Dato>
            <Dato titulo={orderCopy.estado}>{orderCopy.estados[pedido.estado] ?? pedido.estado}</Dato>
            <Dato titulo={orderCopy.fecha}>{FECHA.format(new Date(pedido.pagado ?? pedido.creado))}</Dato>
            <Dato titulo={orderCopy.pago}>{pedido.pago ? orderCopy.tarjeta(pedido.pago.ultimos4) : '—'}</Dato>
            <Dato titulo={orderCopy.envio}>
              <span className="font-semibold">{pedido.envio.destinatario}</span>
              <span className="block">
                {pedido.envio.calle} {pedido.envio.numero}, {pedido.envio.colonia}
              </span>
              <span className="block text-sand">
                {pedido.envio.codigoPostal}, {pedido.envio.estado}, {pedido.envio.pais}
              </span>
              {pedido.envio.referencias && <span className="block text-sand">{pedido.envio.referencias}</span>}
            </Dato>
            <Dato titulo={orderCopy.telefono}>{pedido.envio.telefono}</Dato>
          </dl>

          <h2 className="mt-12 font-display text-[24px] font-extrabold text-paper">{orderCopy.articulos}</h2>
          <ul className="mt-4 border-t-2 border-rail">
            {pedido.items.map((item) => (
              <li
                key={item.id}
                className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-x-5 border-b border-rail py-5"
              >
                <Link to={`/producto/${item.id}`} className="block aspect-4/5 overflow-hidden" aria-label={item.titulo}>
                  <ImageSlot src={item.foto} alt="" />
                </Link>
                <div className="min-w-0">
                  <Link
                    to={`/producto/${item.id}`}
                    className="font-display text-[20px] leading-[1.2] font-semibold text-paper transition-colors hover:text-gold"
                  >
                    {item.titulo}
                  </Link>
                  <span className="mt-1 block text-[14px] text-sand">{orderCopy.cantidad(item.cantidad)}</span>
                </div>
                <span className="font-display text-[20px] font-semibold text-paper tabular-nums">
                  {formatMoney(item.precio * item.cantidad)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-[110px] lg:self-start">
          <OrderSummary desglose={pedido.desglose} unidades={pedido.unidades}>
            <Button as={Link} to="/pedidos" variant="outline" className="mt-6 w-full px-[26px] py-[14px]">
              {orderCopy.misPedidos}
            </Button>
            <Button as={Link} to="/catalogo" variant="quiet" className="mt-3 w-full px-[26px] py-[14px]">
              {orderCopy.seguirComprando}
            </Button>

            {pedido.estado === 'pendiente' &&
              (confirmando ? (
                <div role="alertdialog" aria-label={orderCopy.cancelarPregunta} className="mt-6 border-t-2 border-danger pt-5">
                  <p className="font-display text-[20px] font-semibold text-danger">{orderCopy.cancelarPregunta}</p>
                  <p className="mt-2 text-[15px] leading-[1.45] text-sand">{orderCopy.cancelarCuerpo}</p>
                  <div className="mt-4 grid gap-3">
                    <Button
                      variant="danger-solid"
                      disabled={cancelando}
                      onClick={cancelar}
                      className="w-full px-[26px] py-[12px]"
                    >
                      {cancelando ? orderCopy.cancelando : orderCopy.cancelarConfirmar}
                    </Button>
                    <Button
                      variant="quiet"
                      disabled={cancelando}
                      onClick={() => setConfirmando(false)}
                      className="w-full px-[26px] py-[12px]"
                    >
                      {orderCopy.cancelarConservar}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="danger" onClick={() => setConfirmando(true)} className="mt-6 w-full px-[26px] py-[14px]">
                  {orderCopy.cancelar}
                </Button>
              ))}

            {(pedido.estado === 'enviado' || pedido.estado === 'entregado') && (
              <p className="mt-6 text-[14px] leading-[1.45] text-sand">{orderCopy.noSeCancela}</p>
            )}
          </OrderSummary>
        </aside>
      </div>
    )

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />

      <main>
        <section className="px-gutter pt-[clamp(48px,6vw,88px)] pb-[clamp(40px,5vw,72px)]">
          <div className="mx-auto max-w-shell">
            <span className="block text-[12px] font-semibold tracking-kicker text-gold uppercase">{orderCopy.kicker}</span>
            <h1 className="mt-4 font-display text-h1 font-extrabold tracking-[-.02em] text-paper">
              {user ? orderCopy.title(user.nombre) : orderCopy.kicker}
            </h1>
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

import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AddressStep } from '../../components/checkout/AddressStep'
import { CheckoutSteps } from '../../components/checkout/CheckoutSteps'
import { OrderSummary } from '../../components/checkout/OrderSummary'
import { PaymentStep } from '../../components/checkout/PaymentStep'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar'
import { Footer } from '../../components/layout/Footer'
import { Navbar } from '../../components/layout/Navbar'
import { ShopState } from '../../components/shop/ShopState'
import { SignInGate } from '../../components/shop/SignInGate'
import { Button } from '../../components/ui/Button'
import { Frame } from '../../components/ui/Frame'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { checkoutCopy, checkoutToasts } from '../../data/checkout'
import { useApiResource } from '../../hooks/useApiResource'
import { getOrderSummary } from '../../services/pedidos'

// Un aviso a pantalla completa para los tres casos en que no se puede pagar: la
// bolsa vacía, un artículo sin las piezas pedidas y la ausencia de sesión.
function Bloqueo({ titulo, cuerpo, accion }) {
  return (
    <Frame weight="strong" className="grid min-h-[280px] place-items-center px-6">
      <div className="max-w-[420px] text-center">
        <p className="font-display text-[26px] leading-[1.15] font-semibold text-paper">{titulo}</p>
        <p className="mt-[8px] text-[17px] leading-[1.4] text-sand">{cuerpo}</p>
        <Button as={Link} to={accion.to} variant="quiet" className="mt-[18px] px-[22px] py-[10px]">
          {accion.label}
        </Button>
      </div>
    </Frame>
  )
}

/**
 * La compra: /compra. Dos pasos en una sola página —el envío y el pago— y, al
 * lado, el desglose con el IVA incluido. Al pagar lleva a /pedido/<folio>, que es
 * lo que sobrevive a recargar; el paso en el que se va no sobrevive, y recargar
 * en el pago vuelve al envío, que es inofensivo (las direcciones están guardadas).
 *
 * Es de la cuenta, así que sin sesión invita a entrar en vez de redirigir, como la
 * bolsa. La bolsa viene del CartProvider y el desglose del servidor: aquí no se
 * suma dinero.
 *
 * Lo que se ve al pagar es lo que se envía al servidor (el total, como texto):
 * si entretanto cambió algo, el servidor se niega y `alQuedarObsoleto` vuelve a
 * pedir el resumen y la bolsa para que la pantalla diga la verdad.
 */
export default function Checkout() {
  const { user, status: sesion } = useAuth()
  const { items, status: estadoBolsa, error: errorBolsa, reload: recargarBolsa } = useCart()
  const { pushToast } = useToast()
  const navigate = useNavigate()

  // Pasos: `valores` son los del formulario de envío tal cual (para volver a él
  // con todo escrito) y `envio` lo que se manda al servidor.
  const [paso, setPaso] = useState('envio')
  const [valores, setValores] = useState(undefined)
  const [envio, setEnvio] = useState(null)

  const userId = user?.id ?? null
  const pedirResumen = useCallback(
    (options) => (userId ? getOrderSummary(options) : Promise.resolve(null)),
    [userId],
  )
  const resumen = useApiResource(pedirResumen)
  const { reload: recargarResumen } = resumen

  // Al cambiar de paso el foco va al paso nuevo: sin esto, quien navega con
  // teclado o lector de pantalla se queda en un botón que acaba de desaparecer.
  const pasoRef = useRef(null)
  const primerPaso = useRef(true)

  useEffect(() => {
    if (primerPaso.current) {
      primerPaso.current = false
      return
    }

    pasoRef.current?.focus()
  }, [paso])

  const alEnvio = useCallback((formValues, aEnviar) => {
    setValores(formValues)
    setEnvio(aEnviar)
    setPaso('pago')
  }, [])

  const alPagar = useCallback(
    (pedido) => {
      pushToast(checkoutToasts.pagado(pedido.folio))
      navigate(`/pedido/${pedido.folio}`, { replace: true })
      // Después de navegar: la bolsa ya se vació en el servidor, y esto la trae.
      recargarBolsa()
    },
    [pushToast, navigate, recargarBolsa],
  )

  const alQuedarObsoleto = useCallback(() => {
    recargarResumen()
    recargarBolsa()
  }, [recargarResumen, recargarBolsa])

  const disponibles = items.filter((item) => item.disponible)
  const sinPiezas = disponibles.some((item) => item.cantidad > item.maximo)

  let contenido

  if (sesion === 'checking') contenido = null
  else if (!user)
    contenido = (
      <SignInGate
        kicker={checkoutCopy.invitacionKicker}
        title={checkoutCopy.invitacionTitulo}
        body={checkoutCopy.invitacionCuerpo}
      />
    )
  else if (estadoBolsa === 'loading' || estadoBolsa === 'error')
    contenido = <ShopState status={estadoBolsa} error={errorBolsa} copy={checkoutCopy} onRetry={recargarBolsa} />
  else if (disponibles.length === 0)
    contenido = (
      <Bloqueo
        titulo={checkoutCopy.vacioTitulo}
        cuerpo={checkoutCopy.vacioCuerpo}
        accion={{ to: '/catalogo', label: checkoutCopy.verCatalogo }}
      />
    )
  else if (sinPiezas)
    contenido = (
      <Bloqueo
        titulo={checkoutCopy.problemaTitulo}
        cuerpo={checkoutCopy.problemaCuerpo}
        accion={{ to: '/carrito', label: checkoutCopy.volverBolsa }}
      />
    )
  else if (resumen.status !== 'ready')
    contenido = <ShopState status={resumen.status} error={resumen.error} copy={checkoutCopy} onRetry={resumen.reload} />
  else {
    const desglose = resumen.data

    contenido = (
      <div className="grid gap-[clamp(36px,5vw,64px)] lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0">
          <CheckoutSteps paso={paso} />

          <div ref={pasoRef} tabIndex={-1} className="mt-6 outline-none">
            {paso === 'envio' ? (
              <AddressStep user={user} inicial={valores} onDone={alEnvio} />
            ) : (
              <PaymentStep
                envio={envio}
                total={desglose.total}
                onBack={() => setPaso('envio')}
                onPaid={alPagar}
                onStale={alQuedarObsoleto}
              />
            )}
          </div>
        </div>

        <aside aria-label={checkoutCopy.pagoTitulo} className="lg:sticky lg:top-[110px] lg:self-start">
          <OrderSummary
            desglose={desglose}
            unidades={desglose.unidades}
            envioGratisDesde={desglose.envioGratisDesde}
            items={paso === 'pago' ? disponibles : undefined}
          />
        </aside>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />

      <main>
        <section className="px-gutter pt-[clamp(48px,6vw,88px)] pb-[clamp(40px,5vw,72px)]">
          <div className="mx-auto max-w-shell">
            <span className="block text-[12px] font-semibold tracking-kicker text-gold uppercase">{checkoutCopy.kicker}</span>
            <h1 className="mt-4 font-display text-h1 font-extrabold tracking-[-.02em] text-paper">{checkoutCopy.title}</h1>
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

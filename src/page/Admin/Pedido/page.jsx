import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AdminBadge } from '../../../components/admin/AdminBadge'
import { AdminButton } from '../../../components/admin/AdminButton'
import { AdminCard } from '../../../components/admin/AdminCard'
import { AdminDialog } from '../../../components/admin/AdminDialog'
import { AdminFormHeader } from '../../../components/admin/AdminFormHeader'
import { AdminNotice } from '../../../components/admin/AdminNotice'
import { AdminState } from '../../../components/admin/AdminState'
import { adminConfirm, adminNotices, orderDetailCopy as copy } from '../../../data/admin'
import { useApiResource } from '../../../hooks/useApiResource'
import { getOrder, setOrderState } from '../../../services/admin'
import { formatMoney } from '../../../utils/format'

const VOLVER = { to: '/admin/pedidos', label: copy.volver }

// Un instante con hora, en la zona de la tienda. No es una fecha de calendario,
// así que no pasa por formatDate de utils/format.
const FECHA_HORA = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Mexico_City',
})

/**
 * Un pedido: /admin/pedidos/:folio. Quién compró, adónde va, cómo se pagó, qué
 * lleva y el desglose con el IVA, y los botones para moverlo por su camino
 * (enviar, entregar, cancelar).
 *
 * Espera al pedido y monta el detalle con `key={folio}`: pasar de un pedido a otro
 * vuelve a sembrar el estado en vez de arrastrar el del anterior.
 */
export default function AdminPedido() {
  const { folio } = useParams()

  const pedirPedido = useCallback((options) => getOrder(folio, options), [folio])
  const { data, status, error, reload } = useApiResource(pedirPedido)

  if (status !== 'ready') {
    return (
      <>
        <AdminFormHeader volver={VOLVER} titulo={copy.titulo(folio)} />
        <AdminState status={status} error={error} onRetry={reload} />
      </>
    )
  }

  return <Detalle key={folio} inicial={data} />
}

function Dato({ titulo, children }) {
  return (
    <div>
      <dt className="text-[11px] tracking-wide text-admin-muted uppercase">{titulo}</dt>
      <dd className="mt-[2px] text-[13px] leading-[1.5] text-admin-ink">{children}</dd>
    </div>
  )
}

function Fila({ titulo, children, fuerte = false }) {
  return (
    <div className={`flex justify-between gap-4 py-[6px] text-[13px] ${fuerte ? 'border-t border-admin-line pt-3 text-[15px]' : ''}`}>
      <dt className={fuerte ? 'text-admin-ink' : 'text-admin-muted'}>{titulo}</dt>
      <dd className="text-right text-admin-ink tabular-nums">{children}</dd>
    </div>
  )
}

function Detalle({ inicial }) {
  // El pedido tal como lo confirmó el servidor. Cambiar de estado devuelve el
  // pedido entero y esa respuesta lo sustituye: no se parchea a mano.
  const [pedido, setPedido] = useState(inicial)
  const [aCambiar, setACambiar] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [aviso, setAviso] = useState(null)

  const acciones = copy.acciones[pedido.estado] ?? []
  const confirmacion = aCambiar && adminConfirm[aCambiar.confirma]

  const cambiar = async () => {
    setGuardando(true)

    try {
      const nuevo = await setOrderState(pedido.folio, aCambiar.estado)

      setPedido(nuevo)
      setAviso({ tone: 'good', texto: adminNotices.pedidoActualizado(nuevo.folio, nuevo.estado) })
    } catch (fallo) {
      setAviso({ tone: 'warn', texto: fallo.message })
    } finally {
      setGuardando(false)
      setACambiar(null)
    }
  }

  const { desglose, envio } = pedido

  return (
    <>
      <AdminFormHeader volver={VOLVER} titulo={copy.titulo(pedido.folio)}>
        <AdminBadge estado={pedido.estado} />
        <span>{copy.pagadoEl(FECHA_HORA.format(new Date(pedido.pagado)))}</span>
      </AdminFormHeader>

      {aviso && (
        <AdminNotice tone={aviso.tone} onClose={() => setAviso(null)} className="mb-[14px]">
          {aviso.texto}
        </AdminNotice>
      )}

      <div className="mb-[18px] flex flex-wrap items-center gap-2">
        {acciones.length === 0 && <p className="text-[13px] text-admin-muted">{copy.sinAcciones}</p>}

        {acciones.map((accion) => (
          <AdminButton key={accion.estado} variant={accion.variante} onClick={() => setACambiar(accion)}>
            {accion.label}
          </AdminButton>
        ))}
      </div>

      <div className="grid gap-[18px] xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <AdminCard as="section" className="min-w-0 self-start">
          <h2 className="border-b border-admin-line px-4 py-3 text-[14px] text-admin-ink">{copy.articulos}</h2>

          <ul>
            {pedido.items.map((item) => (
              <li
                key={item.id}
                className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-x-4 border-t border-admin-line px-4 py-3 first:border-t-0"
              >
                {item.foto ? (
                  <img
                    src={item.foto}
                    alt=""
                    loading="lazy"
                    className="h-[50px] w-[40px] rounded-admin border border-admin-line bg-admin-canvas object-cover"
                  />
                ) : (
                  <span className="h-[50px] w-[40px] rounded-admin border border-dashed border-admin-line" />
                )}

                <div className="min-w-0 text-[13px]">
                  <Link to={`/admin/articulos/${item.id}`} className="text-admin-ink hover:text-admin-blue hover:underline">
                    {item.titulo}
                  </Link>
                  <span className="block text-admin-muted tabular-nums">
                    {formatMoney(item.precio)} {copy.cantidad(item.cantidad)}
                  </span>
                </div>

                <span className="text-[13px] text-admin-ink tabular-nums">{formatMoney(item.precio * item.cantidad)}</span>
              </li>
            ))}
          </ul>
        </AdminCard>

        <div className="flex min-w-0 flex-col gap-[18px]">
          <AdminCard as="section" className="p-4">
            <h2 className="mb-3 text-[14px] text-admin-ink">{copy.cliente}</h2>
            <dl className="grid gap-3">
              <Dato titulo={copy.cliente}>{pedido.cliente.nombre}</Dato>
              <Dato titulo={copy.correo}>
                <a href={`mailto:${pedido.cliente.email}`} className="break-all text-admin-blue hover:underline">
                  {pedido.cliente.email}
                </a>
              </Dato>
            </dl>
          </AdminCard>

          <AdminCard as="section" className="p-4">
            <h2 className="mb-3 text-[14px] text-admin-ink">{copy.envio}</h2>
            <dl className="grid gap-3">
              <Dato titulo={copy.envio}>
                <span className="font-medium">{envio.destinatario}</span>
                <span className="block">
                  {envio.calle} {envio.numero}, {envio.colonia}
                </span>
                <span className="block text-admin-muted">
                  {envio.codigoPostal}, {envio.estado}, {envio.pais}
                </span>
              </Dato>
              <Dato titulo={copy.telefono}>{envio.telefono}</Dato>
              {envio.referencias && <Dato titulo={copy.referencias}>{envio.referencias}</Dato>}
            </dl>
          </AdminCard>

          <AdminCard as="section" className="p-4">
            <h2 className="mb-3 text-[14px] text-admin-ink">{copy.pago}</h2>
            <dl className="grid gap-3">
              <Dato titulo={copy.pago}>{pedido.pago ? copy.tarjeta(pedido.pago.ultimos4) : '—'}</Dato>
              {pedido.pago?.referencia && (
                <Dato titulo={copy.referenciaCobro}>
                  <span className="text-[12px] break-all text-admin-muted">{pedido.pago.referencia}</span>
                </Dato>
              )}
            </dl>
          </AdminCard>

          <AdminCard as="section" className="p-4">
            <h2 className="mb-2 text-[14px] text-admin-ink">{copy.desglose}</h2>
            <dl>
              <Fila titulo={copy.piezas(pedido.unidades)}>{formatMoney(desglose.articulos)}</Fila>
              <Fila titulo={copy.envioCosto}>{desglose.envio === 0 ? copy.gratis : formatMoney(desglose.envio)}</Fila>
              <Fila titulo={copy.base}>{formatMoney(desglose.base)}</Fila>
              <Fila titulo={copy.iva(desglose.tasa)}>{formatMoney(desglose.iva)}</Fila>
              <Fila titulo={`${copy.total} (${copy.ivaIncluido})`} fuerte>
                {formatMoney(desglose.total)}
              </Fila>
            </dl>
          </AdminCard>
        </div>
      </div>

      <AdminDialog
        open={Boolean(aCambiar)}
        title={confirmacion?.titulo}
        confirmLabel={confirmacion?.confirmar}
        pendingLabel={confirmacion?.pendiente}
        pending={guardando}
        onConfirm={cambiar}
        onCancel={() => setACambiar(null)}
      >
        {confirmacion?.cuerpo(pedido.folio)}
      </AdminDialog>
    </>
  )
}

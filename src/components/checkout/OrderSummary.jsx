import { summaryCopy } from '../../data/checkout'
import { formatMoney } from '../../utils/format'
import { Frame } from '../ui/Frame'

const FILA = 'flex justify-between gap-4 border-b border-rail py-3'

/**
 * El desglose de lo que se paga, con el IVA incluido en el total: artículos,
 * envío, el subtotal sin IVA, el IVA y el total.
 *
 * No suma nada. Cada cifra llega calculada por el servidor (la base de datos, con
 * la misma función que usa al cobrar), y esto solo la pone en pantalla: así lo que
 * se enseña y lo que se cobra no pueden diferir. La única resta de aquí es la del
 * aviso de envío gratis, que es una frase y no un importe.
 *
 * Lo usan el paso de pago (con la bolsa de ahora) y la confirmación (con el
 * desglose del pedido, que lleva la tasa y el envío de ESE día). `items` es
 * opcional: con él, el resumen lista lo que se compra.
 */
export function OrderSummary({ desglose, unidades, items, envioGratisDesde, titulo = summaryCopy.resumen, children }) {
  const faltaParaGratis =
    envioGratisDesde && desglose.envio > 0
      ? Math.round((envioGratisDesde - desglose.articulos) * 100) / 100
      : 0

  return (
    <Frame weight="strong" className="px-[clamp(20px,3vw,28px)] py-[clamp(22px,3vw,30px)]">
      <h2 className="font-display text-[24px] font-extrabold text-paper">{titulo}</h2>

      {items && (
        <ul className="mt-5 border-t-2 border-rail">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 border-b border-rail py-3 text-[15px]">
              <span className="min-w-0 text-paper">
                {item.titulo}
                <span className="block text-[13px] text-sand">{summaryCopy.cantidad(item.cantidad)}</span>
              </span>
              <span className="shrink-0 text-paper tabular-nums">{formatMoney(item.precio * item.cantidad)}</span>
            </li>
          ))}
        </ul>
      )}

      <dl className={`${items ? '' : 'mt-5 border-t-2 border-rail'} text-[16px]`}>
        <div className={FILA}>
          <dt className="text-sand">{summaryCopy.articulos(unidades)}</dt>
          <dd className="text-paper tabular-nums">{formatMoney(desglose.articulos)}</dd>
        </div>
        <div className={FILA}>
          <dt className="text-sand">{summaryCopy.envio}</dt>
          <dd className="text-paper tabular-nums">
            {desglose.envio === 0 ? summaryCopy.gratis : formatMoney(desglose.envio)}
          </dd>
        </div>

        {/* Lo que sigue es el total partido en dos: base + IVA = total. No se suma
            al total; es de dónde sale. */}
        <div className={`${FILA} text-[15px]`}>
          <dt className="text-sand">{summaryCopy.base}</dt>
          <dd className="text-paper tabular-nums">{formatMoney(desglose.base)}</dd>
        </div>
        <div className={`${FILA} text-[15px]`}>
          <dt className="text-sand">{summaryCopy.iva(desglose.tasa)}</dt>
          <dd className="text-paper tabular-nums">{formatMoney(desglose.iva)}</dd>
        </div>

        <div className="flex items-baseline justify-between gap-4 border-t-2 border-rail pt-4">
          <dt className="text-[13px] font-semibold tracking-label text-sand uppercase">{summaryCopy.total}</dt>
          <dd className="text-right">
            <span className="block font-display text-[30px] font-semibold text-paper tabular-nums">
              {formatMoney(desglose.total)}
            </span>
            <span className="block text-[13px] text-sand">{summaryCopy.ivaIncluido}</span>
          </dd>
        </div>
      </dl>

      {faltaParaGratis > 0 && (
        <p className="mt-4 text-[14px] leading-[1.45] text-sand">{summaryCopy.faltaGratis(formatMoney(faltaParaGratis))}</p>
      )}

      {children}
    </Frame>
  )
}

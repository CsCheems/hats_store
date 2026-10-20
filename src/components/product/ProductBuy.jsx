import { ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { productCopy } from '../../data/shop'
import { Button } from '../ui/Button'
import { BookmarkButton } from './BookmarkButton'
import { QuantityStepper } from './QuantityStepper'

// Por debajo de este número se dice cuántas piezas quedan. `maximo` es
// min(existencias, tope por artículo): con el tope entero no se sabe si hay más.
const TOPE = 10

/**
 * La compra: cantidad, «Añadir a la bolsa» y el marcador de favoritos.
 *
 * La cantidad máxima la manda el servidor (`maximo`), no se calcula aquí: es lo
 * único que la ficha sabe de las existencias. Sin sesión, «Añadir» no escribe
 * nada: CartProvider avisa y abre el modal de acceso, y tras entrar se vuelve a
 * pulsar. Tras añadir, la cantidad vuelve a 1.
 */
export function ProductBuy({ product }) {
  const { add } = useCart()
  const [cantidad, setCantidad] = useState(1)
  const [anadiendo, setAnadiendo] = useState(false)

  const agotado = !product.disponible || product.maximo < 1
  const max = Math.max(product.maximo, 1)

  const anadir = async () => {
    setAnadiendo(true)
    const ok = await add(product.id, cantidad, product.titulo)
    setAnadiendo(false)
    if (ok) setCantidad(1)
  }

  return (
    <div className="flex flex-col gap-5">
      {!agotado && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-[13px] font-semibold tracking-label text-sand uppercase">
            {productCopy.cantidad}
          </span>
          <QuantityStepper value={cantidad} max={max} onChange={setCantidad} disabled={anadiendo} />
          {product.maximo < TOPE && (
            <span className="text-[14px] text-sand">{productCopy.quedan(product.maximo)}</span>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={anadir}
          disabled={agotado || anadiendo}
          className="min-w-[220px] flex-1 px-[26px] py-[14px]"
        >
          <ShoppingBag size={16} strokeWidth={1.5} />
          {agotado ? productCopy.sinExistencias : anadiendo ? productCopy.anadiendo : productCopy.anadir}
        </Button>

        <BookmarkButton slug={product.id} titulo={product.titulo} variant="labeled" />
      </div>
    </div>
  )
}

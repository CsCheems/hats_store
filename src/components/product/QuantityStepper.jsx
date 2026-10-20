import { Minus, Plus } from 'lucide-react'
import { productCopy } from '../../data/shop'

const PASO =
  'grid h-[48px] w-[48px] cursor-pointer place-items-center text-paper transition-colors hover:bg-hover hover:text-on-hover disabled:cursor-not-allowed disabled:text-sand disabled:hover:bg-transparent disabled:hover:text-sand'

/**
 * El selector de cantidad: menos, el número y más. Los botones se bloquean en los
 * extremos (1 y `max`) en vez de dejar pulsar y recortar en silencio.
 *
 * El número es un <output> y no un campo: la cantidad se cambia con los botones,
 * y así no hay que decidir qué hacer con «abc» o con «-3» escritos a mano. El
 * servidor la recorta además a las existencias, por si el stock cambió.
 */
export function QuantityStepper({ value, max, onChange, disabled = false }) {
  return (
    <div role="group" aria-label={productCopy.cantidad} className="inline-flex items-stretch border border-edge">
      <button
        type="button"
        aria-label={productCopy.menos}
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        className={PASO}
      >
        <Minus size={16} strokeWidth={1.5} />
      </button>

      <output
        aria-live="polite"
        className="grid min-w-[52px] place-items-center border-x border-rail font-display text-[20px] font-semibold text-paper tabular-nums"
      >
        {value}
      </output>

      <button
        type="button"
        aria-label={productCopy.mas}
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        className={PASO}
      >
        <Plus size={16} strokeWidth={1.5} />
      </button>
    </div>
  )
}

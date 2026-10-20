// Las utilidades `disabled:` ganan por especificidad a las planas de cada
// variante, así que el estado deshabilitado se define una sola vez aquí.
const BASE =
  'inline-flex items-center justify-center gap-[10px] border text-[13px] font-semibold tracking-[.16em] uppercase transition-colors cursor-pointer disabled:cursor-not-allowed disabled:border-rail disabled:bg-transparent disabled:text-sand'

const VARIANTS = {
  // CTA principal: oro macizo con tinta; al pasar por encima se invierte al
  // color del texto de la página.
  solid: 'border-oro bg-oro text-tinta hover:border-paper hover:bg-paper hover:text-ink',
  // Secundario: el contorno, que se llena al pasar por encima.
  outline: 'border-paper text-paper hover:bg-paper hover:text-ink',
  // Botón discreto de tarjeta o de formulario: contorno suave.
  quiet: 'border-edge text-paper hover:border-paper',
  // Lo destructivo y sin vuelta atrás —cancelar un pedido—: el rojo del tema, en
  // contorno para la puerta y macizo para confirmar. Se invierte al pasar por
  // encima, como el resto.
  danger: 'border-danger text-danger hover:bg-danger hover:text-ink',
  'danger-solid': 'border-danger bg-danger text-ink hover:bg-ink hover:text-danger',
}

/**
 * Botón de la tienda: radio 0, borde de 1px, mayúsculas con tracking amplio.
 * Renderiza <a> cuando recibe `href`.
 *
 * Los colores salen de las variables del tema, no de valores fijos: el mismo
 * botón funciona en el modo claro y en el oscuro sin una línea de más. El oro de
 * `solid` es la excepción: es la marca y no cambia con el modo.
 */
export function Button({ as, variant = 'solid', className = '', children, ...rest }) {
  const Tag = as ?? (rest.href ? 'a' : 'button')
  const type = Tag === 'button' ? { type: 'button' } : {}

  return (
    <Tag className={`${BASE} ${VARIANTS[variant]} ${className}`} {...type} {...rest}>
      {children}
    </Tag>
  )
}

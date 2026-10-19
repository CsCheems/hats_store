const GROSOR = {
  // Línea de contorno firme: el modal, los filtros, los estados del catálogo.
  strong: 'surface',
  // Línea suave de divisor: los desplegables y los avisos.
  thin: 'surface-thin',
}

/**
 * La superficie de todo lo que flota o se enmarca en la tienda —desplegables,
 * modal, avisos, filtros—: el fondo de la página, una línea de 1px y una sombra
 * de 1px (ver `surface` en index.css). Sigue las variables del modo, así que es
 * crema en el modo claro y tinta en el oscuro.
 *
 * Mantiene el nombre y la firma de cuando era el marco blueprint con marcas de
 * registro —`as`, `className`, `ref` y el resto de props pasan tal cual—: así
 * ninguno de sus usos cambió de forma con cada diseño. `weight` elige la línea.
 */
export function Frame({ as: Tag = 'div', weight = 'thin', className = '', children, ...rest }) {
  return (
    <Tag className={`${GROSOR[weight]} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

/**
 * La superficie del panel: blanca, borde de un gris, radio de 6 y una sombra de
 * 1px. Es al panel lo que Frame es a la tienda, y existe por la misma razón —que
 * el borde y el radio se decidan en un archivo y no en veinte—, pero NO es su
 * hermana: aquí no hay marcas de registro ni esquinas vivas, porque esto es otro
 * sistema de diseño. Si algún día alguien importa Frame en esta carpeta, es que
 * se cruzó la frontera.
 *
 * Sin padding propio: una tarjeta de cifra y una que envuelve una tabla lo
 * quieren distinto, y una tabla lo quiere en las celdas.
 */
export function AdminCard({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag
      className={`rounded-admin border border-admin-line bg-admin-card shadow-admin ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

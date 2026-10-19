import { Link } from 'react-router-dom'

// El botón del panel. Radio `admin` pedido a mano —el reset de la base deja los
// botones en 0—, y el anillo de foco en azul: el dorado de :focus-visible es el
// de la tienda, y aquí sería una fuga del otro sistema.
const BASE =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-admin border whitespace-nowrap transition-colors focus-visible:outline-admin-blue disabled:cursor-not-allowed disabled:opacity-55'

// Mapa de variantes, como AdminBadge: un tono nuevo se añade aquí.
const VARIANTS = {
  // La acción principal de la vista: una por pantalla.
  primary: 'border-admin-blue bg-admin-blue text-admin-bright hover:bg-admin-blue/90',
  // Todo lo demás. Es el mismo trazo que el «Reintentar» de AdminState.
  secondary: 'border-admin-line bg-admin-card text-admin-ink hover:border-admin-blue hover:text-admin-blue',
  // Lo que saca algo de la vista (archivar, quitar). Ámbar y no rojo: el panel
  // no tiene rojo, y archivar se deshace.
  warn: 'border-admin-warn/40 bg-admin-card text-admin-warn hover:bg-admin-warn/10',
}

const SIZES = {
  md: 'px-[14px] py-[8px] text-[13px]',
  sm: 'px-[10px] py-[5px] text-[12px]',
}

/**
 * Renderiza un Link del router cuando recibe `to`: navegar sin recargar y
 * seguir siendo un enlace de verdad —se abre en otra pestaña, se copia—, que un
 * botón con navigate() no es.
 */
export function AdminButton({ to, variant = 'secondary', size = 'md', className = '', children, ...rest }) {
  const clases = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={clases} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={clases} {...rest}>
      {children}
    </button>
  )
}

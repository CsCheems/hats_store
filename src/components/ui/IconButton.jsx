const TONES = {
  // Controles del navbar y del modal: sin borde, el icono toma el acento.
  dark: 'border-transparent text-paper hover:text-gold',
  // Variante de contorno fijo, para controles que deben verse como botón.
  gold: 'border-edge text-paper hover:border-paper',
  paper: 'border-edge text-paper hover:border-paper',
}

const SIZES = {
  sm: 'h-[40px] w-[40px]',
  md: 'h-[42px] w-[42px]',
  lg: 'h-[46px] w-[46px]',
}

/** Control cuadrado con un icono centrado. Radio 0. */
export function IconButton({ tone = 'dark', size = 'sm', className = '', children, ...rest }) {
  return (
    <button
      type="button"
      className={`grid shrink-0 cursor-pointer place-items-center border transition-colors ${TONES[tone]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

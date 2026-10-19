/**
 * Iconos de redes. Lucide v1 ya no incluye marcas comerciales, así que estos
 * tres se dibujan aquí con las mismas formas geométricas del prototipo —que
 * tampoco son logotipos, sino siluetas— manteniendo el trazo 1.5 del resto.
 */
function Glyph({ size = 16, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export function InstagramGlyph(props) {
  return (
    <Glyph {...props}>
      <rect x="3" y="3" width="18" height="18" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17 7h.01" />
    </Glyph>
  )
}

export function YoutubeGlyph(props) {
  return (
    <Glyph {...props}>
      <rect x="2" y="5" width="20" height="14" />
      <path d="m10 9 5 3-5 3z" />
    </Glyph>
  )
}

export function WhatsappGlyph(props) {
  return (
    <Glyph {...props}>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5Z" />
    </Glyph>
  )
}

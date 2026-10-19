import { catalogPath } from './catalog'

// Sin separadores de puntos: la barra los une con una raya.
export const announcements = ['Envío a todo México', 'Palma, lona y fieltro']

/**
 * El navbar. Cada entrada con `children` es un desplegable; la de `to` es un
 * enlace suelto.
 *
 * LOS HIJOS LLEVAN SOLO EL DELTA. El componente fusiona `{ ...item.params,
 * ...child.params }`, así que «Fieltro ▸ 6X» sale de combinar la categoría del
 * padre con el grado del hijo, y la categoría no se escribe seis veces.
 *
 * Las cuatro entradas cubren las cuatro categorías de la semilla. Una categoría
 * creada después desde el panel sale sola en los filtros del catálogo, pero no
 * aquí: en qué menú va es una decisión editorial, no un dato, y hay que añadirla
 * a mano a este arreglo.
 *
 * Ya no hay menú de marcas: la tienda es de una sola.
 */
export const navLinks = [
  { key: 'inicio', label: 'Inicio', to: '/' },
  { key: 'palma', label: 'Palma', to: catalogPath({ categoria: 'palma' }) },
  { key: 'lona', label: 'Lona', to: catalogPath({ categoria: 'lona' }) },
  {
    key: 'fieltro',
    label: 'Fieltro',
    params: { categoria: 'fieltro' },
    children: [
      { label: '2X', params: { fieltro: '2x' } },
      { label: '4X', params: { fieltro: '4x' } },
      { label: '6X', params: { fieltro: '6x' } },
      { label: '10X', params: { fieltro: '10x' } },
      { label: '100X', params: { fieltro: '100x' } },
      { label: '1000X', params: { fieltro: '1000x' } },
      { label: '5000X', params: { fieltro: '5000x' } },
    ],
  },
  { key: 'infantil', label: 'Infantil', to: catalogPath({ categoria: 'infantil' }) },
]

// Solo texto, sin iconos: la fila del footer se dibuja con una regla.
export const promises = [
  { title: 'Envío a todo México', note: 'Caja rígida que cuida la copa' },
  { title: 'Material seleccionado', note: 'Palma, lona y fieltro' },
  { title: 'Cambio por talla', note: 'Si no te asienta, lo ajustamos' },
]

export const footerColumns = [
  {
    title: 'Sombreros',
    links: [
      { label: 'Palma', to: catalogPath({ categoria: 'palma' }) },
      { label: 'Lona', to: catalogPath({ categoria: 'lona' }) },
      { label: 'Fieltro', to: catalogPath({ categoria: 'fieltro' }) },
      { label: 'Infantil', to: catalogPath({ categoria: 'infantil' }) },
      { label: 'Todo el catálogo', to: catalogPath() },
    ],
  },
  {
    title: 'Ayuda',
    links: [
      { label: 'Guía de tallas', href: '#' },
      { label: 'Envíos y entregas', href: '#' },
      { label: 'Cambios y devoluciones', href: '#' },
      { label: 'Cuidado del sombrero', href: '#' },
      { label: 'Rastrear pedido', href: '#' },
    ],
  },
  {
    title: 'La marca',
    links: [
      { label: 'Nicol Hats International', href: '#' },
      { label: 'Mayoreo', href: '#' },
      { label: 'Contacto', href: '#' },
    ],
  },
]

export const paymentMethods = ['Visa', 'Mastercard', 'Amex', 'Oxxo']

// Los tres se dibujan en components/ui/SocialIcons: lucide v1 ya no trae
// marcas comerciales.
export const socialLinks = [
  { label: 'Instagram', icon: 'instagram', href: '#' },
  { label: 'YouTube', icon: 'youtube', href: '#' },
  { label: 'WhatsApp', icon: 'whatsapp', href: '#' },
]

import { catalogPath } from './catalog'

/**
 * El hero de la portada: copy y el MEDIO.
 *
 * `media` es lo único que cambia si el cliente pide video, y es una decisión de
 * este archivo, no de un componente:
 *
 *   type: 'image'  → una foto estática (hoy, con `src: null`, el hueco de bandas)
 *   type: 'video'  → un MP4 en bucle, sin audio, con `poster` como cuadro fijo
 *
 * HeroMedia hace el resto: el mismo encuadre, el mismo parallax y el mismo
 * respeto por `prefers-reduced-motion` para los dos. Foto vertical 4:5, mín.
 * 1080×1350; video MP4 con la misma proporción.
 */
export const hero = {
  kicker: 'Hecho a mano',
  title: 'Sombreros que se ganan el sol.',
  body: 'Palma, lona y fieltro. Copa alta, ala firme y el cintillo negro de siempre.',
  action: { label: 'Ver catálogo', to: catalogPath() },
  secondary: { label: 'Cómo se hace', href: '#proceso' },

  media: {
    type: 'image',
    src: null,
    poster: null,
    alt: 'Foto del hero: Palma «Laredo»',
  },
}

// Las cuatro entradas bajo el hero. Los rótulos y las cuentas de verdad están en
// la base; esto es copy editorial, y por eso vive aquí.
export const materiales = [
  { id: 'palma', nombre: 'Palma' },
  { id: 'lona', nombre: 'Lona' },
  { id: 'fieltro', nombre: 'Fieltro' },
  { id: 'infantil', nombre: 'Infantil' },
]

export const homeCopy = {
  materiales: { aria: 'Materiales' },
  proceso: {
    id: 'proceso',
    kicker: 'El proceso',
    title: 'Cuatro pasos para un sombrero que dura.',
    // Copy de relleno hasta que la marca confirme cómo trabaja de verdad.
    pasos: [
      { n: '01', titulo: 'Palma seleccionada', texto: 'Se elige la fibra por grosor y color antes de tejer.' },
      { n: '02', titulo: 'Copa', texto: 'Se forma y se prensa a la altura de cada modelo.' },
      { n: '03', titulo: 'Ala', texto: 'Se asienta firme para que no se venza con el sol.' },
      { n: '04', titulo: 'Cintillo', texto: 'El cintillo negro, cosido a mano, cierra la pieza.' },
    ],
  },
  destacados: { title: 'Los de siempre', todo: 'Ver todos' },
  marca: {
    kicker: 'La marca',
    title: 'Una sola marca. Un solo oficio.',
    // Texto de relleno hasta que la marca entregue el suyo.
    body: '[TEXTO DE LA MARCA] Aquí va la historia de Nicol Hats International.',
    action: { label: 'Conoce la marca', href: '#' },
  },
}

// Recetas visuales del paso de envío. Van en un .js aparte, como fieldStyles.js,
// porque un archivo que exporta componentes y constantes a la vez deja sin fast
// refresh a los dos.

// La casilla cuadrada y llena del catálogo (FilterGroup), también para los radios
// de las direcciones: en esta casa lo marcado es un cuadrado macizo, no un punto.
export const CASILLA =
  'h-[16px] w-[16px] shrink-0 cursor-pointer appearance-none border border-paper bg-transparent transition-colors checked:bg-paper disabled:cursor-not-allowed disabled:border-rail'

// Una dirección elegible: una fila con contorno de 1px que, al marcarse, se afirma
// con una segunda línea hacia dentro (sin cambiar de tamaño, así nada salta).
export const OPCION =
  'flex cursor-pointer items-start gap-4 border border-edge px-4 py-4 transition-colors hover:border-paper has-checked:border-gold has-checked:shadow-[inset_0_0_0_1px_var(--color-gold)] has-disabled:cursor-not-allowed'

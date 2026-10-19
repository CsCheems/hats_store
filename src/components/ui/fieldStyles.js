// Receta visual de los controles de formulario. La comparten el input de Field y
// el disparador de Select, que tienen que ser indistinguibles en reposo: una
// lista es un campo más del formulario, no un botón.
//
// Vive en un .js aparte y no dentro de Field.jsx porque un archivo que exporta
// componentes y constantes a la vez deja sin fast refresh a los dos.
//
// Los colores son variables del tema: el mismo campo funciona en el modo claro y
// en el oscuro. Línea de 1px, fondo `field`.
export const INPUT =
  'h-[48px] w-full min-w-0 border px-[14px] text-[16px] text-paper transition-colors placeholder:text-sand disabled:cursor-not-allowed disabled:text-sand'

export const TONES = {
  // Reposo: línea firme; se afirma al pasar por encima.
  idle: 'border-edge bg-field hover:border-paper',
  // Error: ámbar, no el acento —el acento ya es el teja y se confundiría con él—.
  error: 'border-rust bg-field',
  // Solo lectura: sin hover —un campo que no se puede escribir no debe iluminarse
  // al pasar el ratón, porque eso es una promesa— y el fondo plano, para que se
  // lea como dato y no como control esperando escritura.
  readonly: 'border-rail bg-transparent',
}

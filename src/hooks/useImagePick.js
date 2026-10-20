import { useCallback, useEffect, useRef, useState } from 'react'
import { imagePickerCopy } from '../data/admin'
import { MAX_IMAGENES, recomendada, revisarImagen } from '../utils/imageRules'

// Las URLs temporales de las miniaturas se sueltan por funciones y no tocando
// `ref.current` en la limpieza del efecto: ahí la regla de hooks sospecha de un
// ref que "habrá cambiado", y aquí lo que importa es justo el último valor.
function soltar(url) {
  URL.revokeObjectURL(url)
}

function soltarTodas(ref) {
  ref.current.forEach(soltar)
  ref.current = new Set()
}

/**
 * Las imágenes que se eligen en el alta de un artículo (hasta 8), todavía sin
 * subir.
 *
 * `imagenes` es una lista de `{ file, url }` en el orden en que se subirán; la
 * primera será la principal. `url` es una dirección temporal para pintar la
 * miniatura y la vista previa de la tarjeta. Cada archivo se revisa con las
 * mismas reglas que la galería (utils/imageRules.js): el que no vale se descarta
 * y su motivo va a `errores`, y los demás se quedan. `avisos` son las
 * advertencias de proporción, que no bloquean.
 *
 * Las URLs temporales se sueltan al quitar una imagen y al salir de la página.
 */
export function useImagePick() {
  const [imagenes, setImagenes] = useState([])
  const [errores, setErrores] = useState([])
  const [avisos, setAvisos] = useState([])
  const urlsRef = useRef(new Set())

  useEffect(() => () => soltarTodas(urlsRef), [])

  // Se revisan una a una y en orden (la revisión lee el archivo y es asíncrona),
  // contando las que ya había: pasar de 8 descarta las que sobran, con su aviso.
  const elegir = useCallback(
    async (files) => {
      const nuevas = []
      const problemas = []
      const advertencias = []
      let hueco = MAX_IMAGENES - imagenes.length

      for (const file of files) {
        if (hueco <= 0) {
          problemas.push(imagePickerCopy.llena)
          break
        }

        const { error, medidas } = await revisarImagen(file)

        if (error) {
          problemas.push(error)
          continue
        }

        const url = URL.createObjectURL(file)
        urlsRef.current.add(url)
        nuevas.push({ file, url })
        hueco -= 1

        if (medidas && !recomendada(medidas)) {
          advertencias.push(`«${file.name}»: ${imagePickerCopy.avisoProporcion(medidas.width, medidas.height)}`)
        }
      }

      setImagenes((actuales) => [...actuales, ...nuevas])
      setErrores(problemas)
      setAvisos(advertencias)
    },
    [imagenes.length],
  )

  const quitar = useCallback((indice) => {
    setImagenes((actuales) => {
      const [quitada] = actuales.slice(indice, indice + 1)
      if (quitada) {
        soltar(quitada.url)
        urlsRef.current.delete(quitada.url)
      }
      return actuales.filter((_, n) => n !== indice)
    })
    setErrores([])
  }, [])

  // La elegida pasa al primer lugar, que es el de la principal; las demás
  // conservan su orden.
  const hacerPrincipal = useCallback((indice) => {
    setImagenes((actuales) => [actuales[indice], ...actuales.filter((_, n) => n !== indice)])
  }, [])

  return { imagenes, errores, avisos, elegir, quitar, hacerPrincipal }
}

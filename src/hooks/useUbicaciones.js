import { useCallback, useMemo } from 'react'
import { getUbicaciones } from '../services/ubicaciones'
import { useApiResource } from './useApiResource'

// Para formularios sin desplegables de ubicación —el login—: una referencia
// estable que no sale a la red.
const sinUbicaciones = () => Promise.resolve(null)

/**
 * Las opciones de los campos `type: 'select'` de un formulario: países y
 * estados, sacados del catálogo de la base de datos.
 *
 * Recibe los campos del formulario para dos cosas: saber si hace falta pedir la
 * lista (el login no la necesita) y saber qué campos dependen de cuál. Un campo
 * con `dependsOn: 'pais'` toma sus opciones del país elegido y se vacía cuando el
 * país cambia — si no, podría quedar «Jalisco» elegido bajo un país que no lo
 * tiene.
 *
 * `propsFor(field, values, handleChange)` devuelve lo que hay que pasarle a
 * Field además de lo de siempre:
 *   - mientras carga, `{ loading: true }`;
 *   - con la lista, `{ options }`;
 *   - si la lista no llegó, nada: Field vuelve a ser un campo de texto y el
 *     servidor sigue entendiendo nombres escritos a mano. Un alta no puede
 *     quedarse bloqueada porque falló un catálogo.
 */
export function useUbicaciones(fields) {
  const needsList = fields.some((field) => field.type === 'select')
  const { status, data } = useApiResource(needsList ? getUbicaciones : sinUbicaciones)

  // Qué campos hay que vaciar cuando cambia otro: { pais: ['estado'] }.
  const dependents = useMemo(() => {
    const map = {}
    for (const field of fields) {
      if (field.dependsOn) (map[field.dependsOn] ??= []).push(field.name)
    }
    return map
  }, [fields])

  const propsFor = useCallback(
    (field, values, handleChange) => {
      const clears = dependents[field.name]

      const onChange = clears
        ? (name, value) => {
            handleChange(name, value)
            for (const dependent of clears) handleChange(dependent, '')
          }
        : handleChange

      if (field.type !== 'select') return { onChange }
      if (status === 'loading') return { loading: true, onChange }
      if (status === 'error' || !data) return { onChange }

      const options =
        field.options === 'paises'
          ? data.paises.map((pais) => pais.nombre)
          : (data.paises.find((pais) => pais.nombre === values[field.dependsOn])?.estados ?? [])

      return { options, onChange }
    },
    [status, data, dependents],
  )

  return { propsFor }
}

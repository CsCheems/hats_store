import { useEffect, useState } from 'react'
import { campoBusqueda, catalogCopy, filterGroups } from '../../data/catalog'
import { Field } from '../ui/Field'
import { FilterGroup, FilterToggle } from './FilterGroup'
import { PriceRange } from './PriceRange'

const RETARDO_BUSQUEDA = 250

/**
 * La columna de filtros: sin marco, sobre la banda de fondo alterno, con los
 * grupos separados por una línea de 2px. El campo de búsqueda es el `Field` de
 * siempre, que sigue las variables del modo.
 *
 * LA COLUMNA SE PINTA ENTERA Y NO TIENE SCROLL PROPIO. Tuvo `max-height` y
 * `overflow-y: auto`, y los dos se fueron: un `max-height` en porcentaje se
 * resuelve contra una altura que aquí era `auto`, así que no llegaba a
 * funcionar, y aun arreglado dos scrolls anidados sobre el mismo gesto de rueda
 * son peor que una lista corta. La regla que queda: esta columna mide lo que mide
 * su contenido.
 */
export function CatalogFilters({ facetas, filtros, acciones }) {
  // El buscador escribe en la URL con retardo, así que necesita su propio estado
  // mientras tanto. `visto` recuerda qué decía la URL la última vez que se miró:
  // cuando cambia por fuera —navbar, botón atrás, «limpiar filtros»— el input se
  // pone al día.
  //
  // El ajuste va en el render y no en un efecto, que es el patrón que React
  // documenta para esto y además lo que exige react-hooks/set-state-in-effect.
  const [texto, setTexto] = useState(filtros.q)
  const [visto, setVisto] = useState(filtros.q)

  if (filtros.q !== visto) {
    setVisto(filtros.q)
    setTexto(filtros.q)
  }

  useEffect(() => {
    if (texto === visto) return

    const id = setTimeout(() => acciones.buscar(texto), RETARDO_BUSQUEDA)

    return () => clearTimeout(id)
  }, [texto, visto, acciones])

  return (
    <div className="flex flex-col gap-9">
      <Field field={campoBusqueda} value={texto} onChange={(_, valor) => setTexto(valor)} />

      <PriceRange
        bounds={facetas.precio}
        value={{ min: filtros.min, max: filtros.max }}
        onChange={acciones.precio}
      />

      {/* Los grupos salen de una declaración: añadir uno es una línea en
          data/catalog.js y este componente no cambia. */}
      {filterGroups.map((grupo) => (
        <FilterGroup
          key={grupo.param}
          title={grupo.title}
          options={facetas[grupo.facet]}
          selected={filtros[grupo.param]}
          onToggle={(valor) => acciones.alternar(grupo.param, valor)}
        />
      ))}

      <FilterToggle
        label={catalogCopy.disponibles}
        count={facetas.disponibles}
        checked={filtros.disponibles}
        onChange={acciones.disponibilidad}
      />
    </div>
  )
}

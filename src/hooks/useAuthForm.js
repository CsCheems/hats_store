import { useCallback } from 'react'
import { authFields } from '../data/auth'
import { validate } from '../utils/validation'
import { useForm } from './useForm'

// Vacío, salvo lo que el campo declara como valor de partida (el país).
const emptyValues = (view) =>
  Object.fromEntries(authFields[view].map((f) => [f.name, f.defaultValue ?? '']))

/**
 * El formulario del modal de acceso: useForm con los valores vacíos de la vista
 * y sus reglas. Cambiar de vista vuelve a montar el formulario (AuthModal le da
 * `key`), así que `view` no cambia durante la vida de un mismo estado.
 */
export function useAuthForm({ view, onSubmit, onInvalid }) {
  const validateView = useCallback((values) => validate(view, values), [view])

  return useForm({
    initialValues: () => emptyValues(view),
    validate: validateView,
    onSubmit,
    onInvalid,
  })
}

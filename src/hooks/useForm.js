import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Estado de un formulario: valores, errores y envío en curso. Lo usan el modal
 * de acceso (a través de useAuthForm) y la edición del perfil.
 *
 * Se valida al enviar, no al escribir —marcar en rojo un campo que todavía se
 * está tecleando por primera vez es hostil—, pero un campo que ya falló sí se
 * limpia en cuanto se corrige.
 *
 * - `initialValues`: objeto o función que lo devuelve. Solo se lee al montar,
 *   como cualquier estado inicial; para volver a sembrarlo, se vuelve a montar.
 * - `validate(values)`: devuelve `{ campo: 'mensaje' }`, en el orden de la
 *   pantalla — la primera clave es el campo que recibe el foco.
 * - `onSubmit(values)`: puede lanzar un `ApiError`; si trae `field`, el mensaje
 *   se coloca bajo ese campo y el foco va ahí.
 */
export function useForm({ initialValues, validate, onSubmit, onInvalid }) {
  const formRef = useRef(null)

  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [pending, setPending] = useState(false)

  const focusField = useCallback((name) => {
    formRef.current?.querySelector(`[name="${name}"]`)?.focus()
  }, [])

  // El campo que tiene que recibir el foco cuando termine el envío. No se puede
  // enfocar en el mismo catch: mientras `pending` sigue en true los campos están
  // `disabled`, y un control deshabilitado no acepta el foco — la llamada se
  // pierde en silencio y el foco se queda en el <body>. Se apunta aquí y se
  // aplica después del render que los vuelve a habilitar.
  const focusAfterSubmit = useRef(null)

  useEffect(() => {
    if (pending || !focusAfterSubmit.current) return

    focusField(focusAfterSubmit.current)
    focusAfterSubmit.current = null
  }, [pending, focusField])

  const handleChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))

    setErrors((prev) => {
      if (!(name in prev)) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }, [])

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()
      if (pending) return

      const found = validate(values)
      const firstInvalid = Object.keys(found)[0]

      if (firstInvalid) {
        setErrors(found)
        focusField(firstInvalid)
        onInvalid?.()
        return
      }

      setPending(true)

      try {
        await onSubmit(values)
      } catch (error) {
        if (error.field) {
          setErrors({ [error.field]: error.message })
          focusAfterSubmit.current = error.field
        }
      } finally {
        setPending(false)
      }
    },
    [validate, values, pending, onSubmit, onInvalid, focusField],
  )

  return { formRef, values, errors, pending, handleChange, handleSubmit, focusField }
}

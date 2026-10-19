import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthModal } from '../components/auth/AuthModal'
import {
  login,
  logout as endSession,
  me,
  register,
  updateProfile as saveProfile,
} from '../services/auth'
import { AuthContext } from './AuthContext'

const CLOSED = { open: false, view: 'login', session: 0 }

/**
 * Sesión de la persona usuaria y estado del modal de acceso.
 *
 * `session` sube en cada apertura y sirve de `key` del modal: sin ella el
 * fundido conservaría la vista de la vez anterior y abrir «entrar» después de
 * haber estado en «crear cuenta» mostraría el alta.
 *
 * De aquí colgará también la compra como invitado: el correo del ticket es lo
 * único obligatorio, así que quien no tiene cuenta seguirá teniendo sesión
 * nula y aun así podrá pagar.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [modal, setModal] = useState(CLOSED)

  // 'checking' hasta que el servidor conteste quién es. Se expone en el contexto
  // porque el navbar no puede pintar «entrar» mientras no se sepa: sería afirmar
  // que no hay sesión antes de saberlo.
  const [status, setStatus] = useState('checking')

  // Al montar se le pregunta al servidor si ya hay sesión. La cookie es
  // httpOnly: el navegador la manda sola pero JS no puede leerla, así que esta
  // llamada es la única forma de enterarse. Es lo que hace que recargar la
  // página deje de cerrar la sesión.
  useEffect(() => {
    let vigente = true

    me()
      .then((session) => {
        if (vigente) setUser(session)
      })
      // Sin toast, ni siquiera si falla la red. Un 401 significa «no hay
      // sesión», que es una respuesta y no un fallo; y con el servidor apagado,
      // avisar de un error que nadie provocó —la página acaba de cargar— sería
      // ruido. Lo notará, con su mensaje, en cuanto intente entrar.
      .catch(() => {})
      .finally(() => {
        if (vigente) setStatus('ready')
      })

    return () => {
      vigente = false
    }
  }, [])

  const openAuth = useCallback((view = 'login') => {
    setModal((prev) => ({ open: true, view, session: prev.session + 1 }))
  }, [])

  const closeAuth = useCallback(() => {
    setModal((prev) => ({ ...prev, open: false }))
  }, [])

  const signIn = useCallback(async (values) => {
    const session = await login(values)
    setUser(session)
    return session
  }, [])

  const signUp = useCallback(async (values) => {
    const session = await register(values)
    setUser(session)
    return session
  }, [])

  // La respuesta es el usuario ya actualizado: ponerlo en el contexto es lo que
  // hace que la cabecera del perfil y el menú de cuenta cambien sin otra
  // petición.
  const updateProfile = useCallback(async (values) => {
    const updated = await saveProfile(values)
    setUser(updated)
    return updated
  }, [])

  /**
   * Cerrar sesión son dos cosas: invalidarla en el servidor y olvidarla aquí.
   *
   * Lo segundo ocurre PASE LO QUE PASE con lo primero —de ahí el `finally`—:
   * dejar a alguien mirando una sesión que cree abierta porque la API no
   * respondió es peor que cerrarla de este lado. Pero el error se relanza, para
   * que quien lo pidió pueda decir la verdad: aquí sí, en el servidor no.
   */
  const logout = useCallback(async () => {
    try {
      await endSession()
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      status,
      open: modal.open,
      view: modal.view,
      openAuth,
      closeAuth,
      signIn,
      signUp,
      updateProfile,
      logout,
    }),
    [user, status, modal.open, modal.view, openAuth, closeAuth, signIn, signUp, updateProfile, logout],
  )

  return (
    <AuthContext value={value}>
      {children}
      <AuthModal key={modal.session} />
    </AuthContext>
  )
}

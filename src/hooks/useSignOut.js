import { useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { authToasts } from '../data/auth'

/**
 * Cerrar sesión y decirlo. Lo comparten el menú de cuenta del navbar y la cuenta
 * del menú móvil, que son dos pantallas del mismo gesto.
 *
 * `antes` corre de inmediato —cerrar el panel, devolver el foco—, antes de
 * esperar al servidor.
 */
export function useSignOut(antes) {
  const { logout } = useAuth()
  const { pushToast } = useToast()

  return useCallback(async () => {
    antes?.()

    try {
      await logout()
      pushToast(authToasts.logout)
    } catch {
      // La sesión ya está cerrada de este lado —el provider lo hace pase lo que
      // pase—, pero el servidor no se enteró y conviene decirlo.
      pushToast(authToasts.logoutLocalOnly)
    }
  }, [antes, logout, pushToast])
}

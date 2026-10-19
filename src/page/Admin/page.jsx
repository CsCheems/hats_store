import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminShell } from '../../components/admin/AdminShell'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { adminToasts } from '../../data/admin'

/**
 * La ruta padre de /admin: decide quién pasa y no pinta contenido — de eso se
 * encargan las rutas hijas dentro del Outlet de AdminShell.
 *
 * Quien no administra NO VE NADA de aquí: se le manda a la portada y el aviso es
 * lo único que queda para decir por qué.
 *
 * Es lo contrario de lo que hace /perfil, y la asimetría es la correcta: aquella
 * página es tuya y solo te falta entrar, así que la invitación te deja donde
 * querías estar y se rellena sola al entrar. Esta no es tuya. No hay nada que
 * rellenar, así que quedarse mirando una negativa no lleva a ninguna parte.
 *
 * ESTA GUARDIA ES COMODIDAD, NO SEGURIDAD, y conviene que quede escrito justo
 * aquí. Cualquiera puede tocar el estado desde las herramientas del navegador y
 * saltarse el rebote; lo que verá entonces es un 403 en cada tarjeta, porque
 * quien decide de verdad es requireAdmin en el servidor, en cada petición. Ese
 * reparto es el correcto —el cliente evita un viaje inútil, el servidor
 * protege— pero solo mientras nadie confunda cuál de los dos manda.
 */
export default function Admin() {
  const { user, status } = useAuth()
  const { pushToast } = useToast()
  const navigate = useNavigate()

  // `status === 'ready'` va DENTRO de la condición, no fuera. Mientras el
  // arranque de AuthProvider pregunta al servidor quién eres no hay `user`, y
  // rebotar en ese primer render echaría de /admin a la propia administradora
  // cada vez que recargara la página.
  const permitido = status === 'ready' && user?.rol === 'admin'
  const rechazado = status === 'ready' && user?.rol !== 'admin'

  // Booleano y no el usuario entero: así la dependencia del efecto solo cambia
  // cuando cambia la respuesta, no cada vez que llega otro objeto igual.
  const conSesion = Boolean(user)

  // El pestillo. StrictMode invoca cada efecto dos veces en desarrollo y
  // pushToast no deduplica —cada llamada apila un aviso nuevo—, así que sin esto
  // salen dos idénticos. Deshacerlo en el cleanup, que sería la salida limpia de
  // StrictMode, aquí no vale: ese cleanup corre también al desmontar después de
  // navegar, y borraría justo el aviso que queríamos dejar. El ref sobrevive a
  // la doble invocación y muere con el componente, que es la vida que le toca.
  const avisado = useRef(false)

  // Si alguna vez se llegó a entrar, un rechazo posterior no es alguien a quien
  // se le cierra la puerta: es alguien que estaba dentro y acaba de cerrar
  // sesión. Ahí hay que rebotar igual, pero SIN aviso — cerrar sesión ya pone el
  // suyo, y añadirle un «zona restringida» encima acusa de colarse a quien acaba
  // de irse por su propio pie.
  const estuvoDentro = useRef(false)

  useEffect(() => {
    if (permitido) estuvoDentro.current = true
  }, [permitido])

  useEffect(() => {
    if (!rechazado || avisado.current) return

    avisado.current = true

    // El aviso y la navegación, aquí, seguidos y en el orden en que se leen. Con
    // <Navigate /> quedarían en dos efectos distintos —el del hijo corre antes
    // que el del padre— y habría que confiar en ese orden.
    if (!estuvoDentro.current) {
      pushToast(conSesion ? adminToasts.cliente : adminToasts.anonimo)
    }

    // `replace` y no un empujón al historial: sin él /admin se queda dentro, la
    // flecha «atrás» vuelve, la guardia rebota otra vez y no hay forma de
    // retroceder.
    navigate('/', { replace: true })
  }, [rechazado, conSesion, navigate, pushToast])

  if (permitido) return <AdminShell />

  // Lo mismo para los dos casos que quedan —«todavía preguntando» y «ya me
  // voy»— y es nada. Sin `bg-` propio: el color es el del `body`, así que esto
  // no pinta nada encima, solo ocupa el alto para que no se vea el fondo
  // cortado mientras dura.
  return <div className="min-h-screen" />
}

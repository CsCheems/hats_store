import { useCallback, useEffect, useRef, useState } from 'react'
import { AnnouncementBar } from '../../components/layout/AnnouncementBar'
import { Footer } from '../../components/layout/Footer'
import { Navbar } from '../../components/layout/Navbar'
import { ProfileForm } from '../../components/profile/ProfileForm'
import { ProfileIdentity } from '../../components/profile/ProfileIdentity'
import { SignInInvite } from '../../components/profile/SignInInvite'
import { useAuth } from '../../context/AuthContext'

/**
 * Página de cuenta. La misma cáscara que la portada —anuncio, navbar, footer—;
 * lo único que decide es qué va dentro de `main`.
 *
 * Mientras `status` es 'checking' no se pinta nada de dentro: el arranque de
 * AuthProvider todavía está preguntando al servidor quién es esta persona, y
 * enseñar la invitación a entrar antes de saberlo afirmaría que no hay sesión
 * para desdecirse un instante después. La altura mínima se reserva igual, para
 * que el footer no suba y vuelva a bajar cuando llegue la respuesta.
 *
 * `editing` vive aquí y no en el formulario porque lo comparten dos hermanos: el
 * botón de la cabecera lo enciende y el formulario lo apaga.
 */
export default function Profile() {
  const { user, status } = useAuth()
  const [editing, setEditing] = useState(false)

  const startEditing = useCallback(() => setEditing(true), [])
  const stopEditing = useCallback(() => setEditing(false), [])

  // Al salir de la edición —guardando o cancelando— el foco vuelve al botón que
  // la abrió, que acaba de reaparecer. Sin esto se quedaría en el <body>, sobre
  // un botón de «Cancelar» que ya no existe. El latch evita robarle el foco a
  // nadie en la primera carga.
  const editButtonRef = useRef(null)
  const wasEditing = useRef(false)

  useEffect(() => {
    if (wasEditing.current && !editing) editButtonRef.current?.focus()
    wasEditing.current = editing
  }, [editing])

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />

      <main className="min-h-[60vh]">
        {status === 'ready' &&
          (user ? (
            <>
              <ProfileIdentity
                user={user}
                editing={editing}
                onEdit={startEditing}
                editRef={editButtonRef}
              />
              <ProfileForm user={user} editing={editing} onDone={stopEditing} />
            </>
          ) : (
            <SignInInvite />
          ))}
      </main>

      <Footer />
    </div>
  )
}

import { LogIn } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'
import { Frame } from '../ui/Frame'

/**
 * Lo que ve quien abre una página que es de su cuenta —Guardados, la bolsa— sin
 * haber entrado. Mismo criterio que SignInInvite en /perfil: no se redirige, para
 * que un enlace guardado no parezca roto, y el modal de acceso se abre desde
 * aquí; al entrar, la página se llena sola.
 */
export function SignInGate({ kicker, title, body }) {
  const { openAuth } = useAuth()

  return (
    <Frame
      weight="strong"
      className="mx-auto max-w-[520px] px-[clamp(22px,4vw,38px)] py-[clamp(30px,4vw,44px)] text-center"
    >
      <span className="block text-[13px] font-semibold tracking-kicker text-gold uppercase">{kicker}</span>
      <h2 className="mt-3 font-display text-h3 font-extrabold text-paper">{title}</h2>
      <p className="mx-auto mt-4 max-w-[38ch] text-[18px] leading-[1.5] text-sand">{body}</p>

      <Button onClick={() => openAuth('login')} className="mt-7 px-[26px] py-[13px]">
        <LogIn size={16} strokeWidth={1.5} />
        Entrar
      </Button>
    </Frame>
  )
}

import { useAuth } from '../../context/AuthContext'
import { authHeader, authViews } from '../../data/auth'
import { useFadeSwitch } from '../../hooks/useFadeSwitch'
import { Modal } from '../ui/Modal'
import { AuthForm } from './AuthForm'

const TITLE_ID = 'auth-modal-title'

// Aire lateral del panel, el mismo en cabecera, pestañas y cuerpo.
const PAD = 'px-[clamp(20px,4vw,34px)]'

const TAB =
  'flex-1 cursor-pointer border-b-2 py-[13px] text-[14px] font-semibold tracking-label uppercase transition-colors'

const TAB_STATE = {
  // Vista activa: regla inferior de tinta y texto pleno.
  on: 'border-paper text-paper',
  // Vista inactiva: regla tenue y texto secundario; se afirma al pasar.
  off: 'border-rail/30 text-sand hover:border-paper hover:text-paper',
}

/**
 * Modal único de acceso. Las pestañas se quedan fijas arriba y todo lo de
 * debajo —rótulo, título y formulario— cruza en fundido, con la altura del
 * panel animándose a la vez: entrar son dos campos y crear cuenta son once, y
 * sin eso el salto sería de varios cientos de píxeles.
 */
export function AuthModal() {
  const { open, view, closeAuth } = useAuth()
  const { boxRef, contentRef, shown, switchTo } = useFadeSwitch(view)

  return (
    <Modal open={open} onClose={closeAuth} labelledBy={TITLE_ID} className="max-w-[560px]">
      <div className={`shrink-0 pt-[clamp(22px,3vw,28px)] pr-[62px] ${PAD}`}>
        <span className="block text-[13px] font-semibold tracking-kicker text-gold uppercase">
          {authHeader}
        </span>
      </div>

      <div role="tablist" className={`mt-[18px] flex shrink-0 ${PAD}`}>
        {Object.entries(authViews).map(([name, copy]) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={name === shown}
            onClick={() => switchTo(name)}
            className={`${TAB} ${name === shown ? TAB_STATE.on : TAB_STATE.off}`}
          >
            {copy.tab}
          </button>
        ))}
      </div>

      {/* El scroll va aquí y no en el marco: el marco recortaría su borde
          doble. */}
      <div className={`min-h-0 flex-1 overflow-y-auto pt-[26px] pb-[clamp(24px,3vw,32px)] ${PAD}`}>
        <div ref={boxRef}>
          <div ref={contentRef}>
            {/* La `key` reinicia valores y errores al cambiar de vista: lo
                escrito en el login no debe reaparecer en el alta. */}
            <AuthForm key={shown} view={shown} titleId={TITLE_ID} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

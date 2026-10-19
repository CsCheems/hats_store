import { paymentMethods, socialLinks } from '../../data/site'
import { InstagramGlyph, WhatsappGlyph, YoutubeGlyph } from '../ui/SocialIcons'

const ICONS = {
  instagram: InstagramGlyph,
  youtube: YoutubeGlyph,
  whatsapp: WhatsappGlyph,
}

/** Barra legal: copyright, medios de pago y redes. */
export function LegalBar() {
  return (
    <div className="border-t border-rail">
      <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-5 px-gutter py-[22px]">
        <span className="text-[14px] text-sand">© 2026 Nicol Hats International. Sitio de muestra.</span>

        {/* Los medios de pago van separados por hueco, no por puntos. */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] font-semibold tracking-wide text-sand uppercase">
          {paymentMethods.map((method) => (
            <span key={method}>{method}</span>
          ))}
        </div>

        <div className="flex gap-[10px]">
          {socialLinks.map((social) => {
            const Icon = ICONS[social.icon]
            return (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="grid h-[38px] w-[38px] place-items-center text-paper transition-colors hover:text-gold"
              >
                <Icon size={17} />
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'

const LINK = 'text-[16px] text-sand transition-colors hover:text-paper hover:underline'

/** Columna de enlaces del footer (Sombreros, Ayuda, La marca). */
export function FooterLinkColumn({ title, links }) {
  return (
    <div>
      <h4 className="mb-[16px] text-[12px] font-semibold tracking-[.24em] text-gold uppercase">
        {title}
      </h4>
      <div className="flex flex-col gap-[10px]">
        {links.map((link) =>
          // Las del catálogo navegan con el router; el resto sigue siendo un
          // ancla mientras esas páginas no existan.
          link.to ? (
            <Link key={link.label} to={link.to} className={LINK}>
              {link.label}
            </Link>
          ) : (
            <a key={link.label} href={link.href} className={LINK}>
              {link.label}
            </a>
          ),
        )}
      </div>
    </div>
  )
}

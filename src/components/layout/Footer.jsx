import { footerColumns } from '../../data/site'
import { Logo } from '../ui/Logo'
import { FooterLinkColumn } from './FooterLinkColumn'
import { LegalBar } from './LegalBar'
import { Newsletter } from './Newsletter'
import { PromiseRow } from './PromiseRow'

/** Footer: promesas, cuerpo principal y barra legal. */
export function Footer() {
  return (
    <footer className="border-t border-rail">
      <PromiseRow />

      <div className="mx-auto grid max-w-shell grid-cols-1 gap-[clamp(28px,3vw,52px)] px-gutter py-[clamp(40px,4.6vw,64px)] sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,.9fr))]">
        <div>
          <Logo variant="stacked" className="text-paper" />
          <p className="mt-5 max-w-[34ch] text-[16px] leading-[1.55] text-sand">
            Sombreros de palma, lona y fieltro, hechos para el sol de todo el día. Envíos a todo
            México.
          </p>
          <Newsletter />
        </div>

        {footerColumns.map((column) => (
          <FooterLinkColumn key={column.title} title={column.title} links={column.links} />
        ))}
      </div>

      <LegalBar />
    </footer>
  )
}

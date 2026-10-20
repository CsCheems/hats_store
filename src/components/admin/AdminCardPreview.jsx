import { productFormCopy } from '../../data/admin'
import { CatalogCard } from '../catalog/CatalogCard'
import { AdminCard } from './AdminCard'

/**
 * La vista previa de la tarjeta del catálogo, a la derecha del formulario.
 *
 * ES LA ÚNICA VENTANA DEL PANEL A LA TIENDA, y es deliberada: pinta la
 * CatalogCard de verdad en vez de una copia, porque una copia dejaría de parecerse
 * a la tarjeta el día que alguien cambie una. Por eso importa de components/catalog
 * y usa tokens de la tienda (`bg-ink`) dentro de su recuadro. Nada más del panel
 * hace esto, y fuera de este archivo la frontera sigue sin excepciones.
 *
 * `tema-claro` fija los colores del modo claro dentro del recuadro: el panel no
 * participa del tema de la tienda, y una tarjeta de letras claras sobre el blanco
 * del panel sería ilegible si quien edita dejó la tienda en oscuro.
 *
 * Recibe el producto con la forma que espera la tarjeta ({ foto, titulo, precio,
 * disponible }); armarlo con lo que se está escribiendo es cosa de la página.
 *
 * El recuadro es `inert`: la tarjeta es de verdad y lleva enlaces a la ficha y el
 * marcador de favoritos, pero el artículo del formulario no tiene todavía (o no
 * tiene) un slug al que ir, y un clic llevaría a /producto/undefined. `inert`
 * quita de golpe los clics, el foco y el hover sin tocar la tarjeta, que sigue
 * siendo la misma que ve la tienda.
 */
export function AdminCardPreview({ product, categoria, borrador = false }) {
  return (
    <AdminCard as="aside" aria-label={productFormCopy.vistaPrevia} className="p-[clamp(16px,2.4vw,24px)]">
      <h2 className="text-[15px] text-admin-ink">{productFormCopy.vistaPrevia}</h2>
      <p className="mt-1 text-[12px] text-admin-muted">{productFormCopy.vistaPreviaNota}</p>

      <div inert className="tema-claro mt-4 rounded-admin border border-admin-line bg-ink p-4">
        <CatalogCard product={product} categoria={categoria} />
      </div>

      {borrador && <p className="mt-3 text-[12px] leading-[1.45] text-admin-warn">{productFormCopy.vistaPreviaBorrador}</p>}
    </AdminCard>
  )
}

import { ImagePlus, TriangleAlert } from 'lucide-react'
import { useId, useRef } from 'react'
import { imagePickerCopy } from '../../data/admin'
import { MAX_IMAGENES, TIPOS } from '../../utils/imageRules'
import { AdminButton } from './AdminButton'

/**
 * El campo de imágenes del alta de un artículo: elegir hasta 8, ver las
 * miniaturas, cambiar cuál es la principal y quitar. No sube nada; las imágenes se
 * suben al crear (page/Admin/Producto). Presentacional: quien lo usa trae el
 * estado de useImagePick.
 *
 * Cada miniatura usa el mismo encuadre que la tarjeta —4:5 con object-cover—, así
 * que lo que se recorta aquí es lo que se recortará allí.
 */
export function AdminImagePicker({ imagenes, errores, avisos, disabled = false, onPick, onRemove, onMakeMain }) {
  const id = useId()
  const inputRef = useRef(null)
  const llena = imagenes.length >= MAX_IMAGENES

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-3">
        <AdminButton disabled={disabled || llena} onClick={() => inputRef.current?.click()}>
          <ImagePlus size={15} strokeWidth={1.5} />
          {imagenes.length ? imagePickerCopy.agregar : imagePickerCopy.elegir}
        </AdminButton>

        <span className="text-[13px] text-admin-muted">
          {imagenes.length ? imagePickerCopy.contador(imagenes.length) : imagePickerCopy.ninguna}
        </span>

        {/* Oculto: el botón es el control visible. Se vacía después de cada
            selección para que elegir otra vez el mismo archivo vuelva a disparar
            `change`. */}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={TIPOS.join(',')}
          multiple
          hidden
          aria-describedby={`${id}-ayuda`}
          onChange={(event) => {
            const files = [...event.target.files]
            event.target.value = ''
            if (files.length) onPick(files)
          }}
        />
      </div>

      {imagenes.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {imagenes.map((imagen, index) => (
            <li key={imagen.url} className="min-w-0">
              <div className="relative">
                <img
                  src={imagen.url}
                  alt={imagePickerCopy.alt(index + 1)}
                  className="aspect-[4/5] w-full rounded-admin border border-admin-line bg-admin-canvas object-cover"
                />
                {index === 0 && (
                  <span className="absolute top-2 left-2 rounded-admin border border-admin-blue/35 bg-admin-sky px-[7px] py-[2px] text-[11px] text-admin-blue">
                    {imagePickerCopy.principal}
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-[6px]">
                {index > 0 && (
                  <AdminButton size="sm" disabled={disabled} onClick={() => onMakeMain(index)}>
                    {imagePickerCopy.hacerPrincipal}
                  </AdminButton>
                )}
                <AdminButton size="sm" variant="warn" disabled={disabled} onClick={() => onRemove(index)}>
                  {imagePickerCopy.quitar}
                </AdminButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p id={`${id}-ayuda`} className="mt-3 text-[12px] leading-[1.45] text-admin-muted">
        {imagePickerCopy.ayuda}
      </p>

      {avisos.map((aviso) => (
        <p key={aviso} className="mt-[6px] text-[12px] leading-[1.45] text-admin-muted">
          {aviso}
        </p>
      ))}

      {errores.map((error) => (
        <p key={error} className="mt-[6px] flex items-start gap-[6px] text-[12px] leading-[1.45] text-admin-warn">
          <TriangleAlert size={13} strokeWidth={1.5} className="mt-[2px] shrink-0" />
          {error}
        </p>
      ))}
    </div>
  )
}

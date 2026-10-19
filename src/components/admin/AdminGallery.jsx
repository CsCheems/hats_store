import { ImagePlus } from 'lucide-react'
import { useRef, useState } from 'react'
import { adminConfirm, galleryCopy } from '../../data/admin'
import { removeProductImage, setPrincipalImage, uploadProductImage } from '../../services/admin'
import { AdminButton } from './AdminButton'
import { AdminCard } from './AdminCard'
import { AdminDialog } from './AdminDialog'
import { AdminNotice } from './AdminNotice'

// Los mismos topes que el servidor y que el bucket (db/scripts/10). Aquí solo
// sirven para no subir 5 MB que se van a rechazar: quien decide es el servidor.
const TIPOS = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 5 * 1024 * 1024
const MAX_IMAGENES = 8

// La recomendación de CLAUDE.md para producto: vertical 4:5, 1000 × 1250 o más.
const recomendada = ({ width, height }) =>
  width >= 1000 && height >= 1250 && Math.abs(width / height - 0.8) <= 0.02

// Las medidas reales del archivo, sin subirlo. Si el navegador no sabe leerlo
// devuelve null y simplemente no se avisa: el servidor dirá lo suyo.
async function medir(file) {
  try {
    const bitmap = await createImageBitmap(file)
    const medidas = { width: bitmap.width, height: bitmap.height }
    bitmap.close()
    return medidas
  } catch {
    return null
  }
}

/**
 * La galería de un artículo: subir, elegir la principal y quitar.
 *
 * No guarda la galería en un estado propio: la lee de `product`, y cada
 * operación devuelve el artículo actualizado que se le pasa a `onChange`. Así la
 * galería que se ve es siempre la que la base confirmó, no una suposición
 * optimista que haya que deshacer si algo falla.
 *
 * Las subidas van DE UNA EN UNA, en el orden en que se eligieron: el orden de la
 * galería es el orden de llegada, y cinco subidas en paralelo lo sortearían.
 */
export function AdminGallery({ product, onChange }) {
  const inputRef = useRef(null)

  const [subiendo, setSubiendo] = useState(null)
  const [ocupada, setOcupada] = useState(null)
  const [avisos, setAvisos] = useState([])
  const [aQuitar, setAQuitar] = useState(null)

  const imagenes = product.imagenes
  const llena = imagenes.length >= MAX_IMAGENES
  const trabajando = Boolean(subiendo || ocupada)

  const avisar = (tone, texto) => setAvisos((lista) => [...lista, { id: `${Date.now()}-${lista.length}`, tone, texto }])

  const subir = async (files) => {
    setAvisos([])
    let restantes = MAX_IMAGENES - imagenes.length

    for (const file of files) {
      if (restantes <= 0) {
        avisar('warn', galleryCopy.llena)
        break
      }
      if (!TIPOS.includes(file.type)) {
        avisar('warn', galleryCopy.errorTipo(file.name))
        continue
      }
      if (file.size > MAX_BYTES) {
        avisar('warn', galleryCopy.errorPeso(file.name))
        continue
      }

      const medidas = await medir(file)
      setSubiendo(file.name)

      try {
        const actualizado = await uploadProductImage(product.id, file)
        onChange(actualizado)
        restantes = MAX_IMAGENES - actualizado.imagenes.length

        if (medidas && !recomendada(medidas)) {
          avisar('warn', galleryCopy.avisoMedidas(file.name, medidas.width, medidas.height))
        }
      } catch (error) {
        avisar('warn', `${file.name}: ${error.message}`)
      }
    }

    setSubiendo(null)
  }

  const operar = async (imagenId, peticion) => {
    setOcupada(imagenId)
    try {
      onChange(await peticion())
      return true
    } catch (error) {
      avisar('warn', error.message)
      return false
    } finally {
      setOcupada(null)
    }
  }

  const hacerPrincipal = (imagen) => operar(imagen.id, () => setPrincipalImage(product.id, imagen.id))

  const quitar = async () => {
    await operar(aQuitar.id, () => removeProductImage(product.id, aQuitar.id))
    setAQuitar(null)
  }

  return (
    <AdminCard as="section" aria-labelledby="galeria-titulo" className="p-[clamp(16px,2.4vw,24px)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="galeria-titulo" className="text-[15px] text-admin-ink">
            {galleryCopy.titulo}
          </h2>
          <p className="mt-1 text-[13px] text-admin-muted">{galleryCopy.intro}</p>
          <p className="mt-1 text-[12px] text-admin-muted">{galleryCopy.recomendacion}</p>
        </div>

        <AdminButton
          variant="primary"
          disabled={llena || trabajando}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus size={15} strokeWidth={1.5} />
          {subiendo ? galleryCopy.subiendo(subiendo) : galleryCopy.subir}
        </AdminButton>

        {/* Oculto: el botón de arriba es el control visible. Se vacía después de
            cada selección para que elegir otra vez el mismo archivo vuelva a
            disparar `change`. */}
        <input
          ref={inputRef}
          type="file"
          accept={TIPOS.join(',')}
          multiple
          hidden
          onChange={(event) => {
            const files = [...event.target.files]
            event.target.value = ''
            if (files.length) subir(files)
          }}
        />
      </div>

      {avisos.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {avisos.map((aviso) => (
            <AdminNotice
              key={aviso.id}
              tone={aviso.tone}
              onClose={() => setAvisos((lista) => lista.filter((item) => item.id !== aviso.id))}
            >
              {aviso.texto}
            </AdminNotice>
          ))}
        </div>
      )}

      {imagenes.length === 0 ? (
        <p className="mt-4 rounded-admin border border-dashed border-admin-line px-4 py-8 text-center text-[13px] text-admin-muted">
          {galleryCopy.vacia}
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {imagenes.map((imagen, index) => (
            <li key={imagen.id} className="min-w-0">
              <div className="relative">
                <img
                  src={imagen.url}
                  alt={galleryCopy.alt(product.titulo, index + 1)}
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-admin border border-admin-line bg-admin-canvas object-cover"
                />
                {index === 0 && (
                  <span className="absolute top-2 left-2 rounded-admin border border-admin-blue/35 bg-admin-sky px-[7px] py-[2px] text-[11px] text-admin-blue">
                    {galleryCopy.principal}
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-[6px]">
                {index > 0 && (
                  <AdminButton size="sm" disabled={trabajando} onClick={() => hacerPrincipal(imagen)}>
                    {galleryCopy.hacerPrincipal}
                  </AdminButton>
                )}
                <AdminButton size="sm" variant="warn" disabled={trabajando} onClick={() => setAQuitar(imagen)}>
                  {galleryCopy.quitar}
                </AdminButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AdminDialog
        open={Boolean(aQuitar)}
        title={adminConfirm.quitarImagen.titulo}
        confirmLabel={adminConfirm.quitarImagen.confirmar}
        pendingLabel={adminConfirm.quitarImagen.pendiente}
        pending={Boolean(aQuitar) && ocupada === aQuitar?.id}
        onConfirm={quitar}
        onCancel={() => setAQuitar(null)}
      >
        {aQuitar && (
          <div className="flex items-start gap-3">
            <img
              src={aQuitar.url}
              alt=""
              className="aspect-[4/5] w-[64px] shrink-0 rounded-admin border border-admin-line object-cover"
            />
            <p>{adminConfirm.quitarImagen.cuerpo}</p>
          </div>
        )}
      </AdminDialog>
    </AdminCard>
  )
}

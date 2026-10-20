// Copy y estructura del panel de administración, con la misma regla que
// data/auth.js o data/site.js: las cadenas viven aquí y el JSX las recorre.
//
// Los rótulos de las categorías NO están en este archivo. Vienen del servidor
// junto con su cuenta —GET /admin/categories— porque son datos del catálogo, no
// copy de la interfaz: una categoría nueva tiene que aparecer en el menú sin
// tocar el frontend, que es justo la diferencia entre las dos cosas.

// Rótulo fijo de la barra superior. El equivalente del `authHeader` del modal.
export const adminHeader = 'Panel de administración'

// El menú del usuario, arriba a la izquierda. «Cerrar sesión» no está aquí, y
// por lo mismo que en accountMenu: es una acción, no un enlace.
export const adminUserMenu = [{ label: 'Volver al sitio', icon: 'site', to: '/' }]

// Las entradas fijas del menú lateral. Debajo de ellas el componente pinta las
// categorías que trae la API, cada una con su inventario.
//
// El rótulo de ese grupo es «Por categoría» y no «Categorías»: «Categorías» ya
// es la entrada fija que las administra, y dos rótulos iguales uno encima del
// otro no dicen cuál es cuál.
export const adminSidebar = {
  fijos: [
    { label: 'Resumen', icon: 'home', to: '/admin' },
    // `prefijo`: la entrada sigue encendida en las páginas que cuelgan de ella
    // (el detalle de un pedido), no solo en la suya.
    { label: 'Pedidos', icon: 'orders', to: '/admin/pedidos', prefijo: true },
    { label: 'Todo el inventario', icon: 'boxes', to: '/admin/productos' },
    { label: 'Archivados', icon: 'archive', to: '/admin/archivados' },
    // Sin entrada de «Marcas»: la tienda es de una sola. Las rutas y las páginas
    // /admin/marcas siguen existiendo y funcionan si algún día vende dos; basta
    // con devolver aquí la línea { label: 'Marcas', icon: 'tag', to: '/admin/marcas' }.
    { label: 'Categorías', icon: 'shapes', to: '/admin/categorias' },
  ],
  categorias: 'Por categoría',
  base: '/admin/productos',
}

/**
 * Las cuatro tarjetas del resumen.
 *
 * `key` es la clave dentro de `metricas` que manda el servidor, y `formato`
 * nombra un formateador de utils/format.js. Añadir una quinta métrica es añadir
 * su clave en admin.service.js y una línea aquí — el componente no cambia.
 */
export const statCards = [
  { key: 'productos', label: 'Productos', hint: 'en el inventario', icon: 'products', formato: 'entero' },
  { key: 'pedidos', label: 'Pedidos', hint: 'en el periodo', icon: 'orders', formato: 'entero' },
  { key: 'ventas', label: 'Ventas', hint: 'artículos vendidos', icon: 'sales', formato: 'entero' },
  { key: 'ingresos', label: 'Ingresos', hint: 'sin pedidos cancelados', icon: 'income', formato: 'moneda' },
]

// Las dos tablas del panel se declaran igual y las pinta el mismo componente.
// `tipo` le dice cómo formatear la celda; `align: 'right'` es para las cifras,
// que se comparan en columna y por eso se alinean por la derecha.
export const productColumns = [
  // La miniatura de la principal, o una raya: de un vistazo se ve qué artículos
  // siguen sin foto.
  { key: 'foto', label: 'Foto', tipo: 'imagen' },
  { key: 'sku', label: 'SKU', tipo: 'codigo' },
  { key: 'titulo', label: 'Artículo', tipo: 'texto' },
  { key: 'precio', label: 'Precio', tipo: 'moneda', align: 'right' },
  { key: 'stock', label: 'Stock', tipo: 'stock', align: 'right' },
  { key: 'estado', label: 'Estado', tipo: 'estado' },
  { key: 'enPortada', label: 'Portada', tipo: 'portada' },
  { key: 'actualizado', label: 'Actualizado', tipo: 'fecha', align: 'right' },
]

// `lista` pinta los rótulos de un array de `{ id, label }`; `booleano`, «Sí» o
// una raya.
export const brandColumns = [
  { key: 'label', label: 'Marca', tipo: 'texto' },
  { key: 'categorias', label: 'Categorías', tipo: 'lista' },
  { key: 'count', label: 'Artículos', tipo: 'entero', align: 'right' },
  { key: 'enTienda', label: 'En la tienda', tipo: 'booleano' },
]

export const categoryColumns = [
  { key: 'label', label: 'Categoría', tipo: 'texto' },
  { key: 'prefijo', label: 'Prefijo', tipo: 'codigo' },
  { key: 'llevaGenero', label: 'Género', tipo: 'booleano' },
  { key: 'admiteFieltro', label: 'Fieltro', tipo: 'booleano' },
  { key: 'count', label: 'Artículos', tipo: 'entero', align: 'right' },
]

export const pedidoColumns = [
  { key: 'folio', label: 'Folio', tipo: 'codigo' },
  { key: 'cliente', label: 'Cliente', tipo: 'texto' },
  { key: 'fecha', label: 'Fecha', tipo: 'fecha' },
  { key: 'articulos', label: 'Artículos', tipo: 'entero', align: 'right' },
  { key: 'total', label: 'Total', tipo: 'moneda', align: 'right' },
  { key: 'estado', label: 'Estado', tipo: 'estado' },
]

// Los filtros de la lista de pedidos. `key` es el valor de `?estado=` en la
// dirección; «todos» no escribe nada.
export const orderFilters = [
  { key: 'todos', label: 'Todos' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'enviado', label: 'Enviados' },
  { key: 'entregado', label: 'Entregados' },
  { key: 'cancelado', label: 'Cancelados' },
]

// Rótulo y tono de cada estado. Los de producto y los de pedido comparten mapa
// porque comparten la insignia que los pinta; los tonos viven en el componente.
export const estados = {
  activo: { label: 'Activo', tono: 'good' },
  borrador: { label: 'Borrador', tono: 'muted' },
  agotado: { label: 'Agotado', tono: 'warn' },
  pendiente: { label: 'Pendiente', tono: 'warn' },
  enviado: { label: 'Enviado', tono: 'info' },
  entregado: { label: 'Entregado', tono: 'good' },
  cancelado: { label: 'Cancelado', tono: 'muted' },
}

export const adminCopy = {
  resumenTitulo: 'Resumen',
  pedidosTitulo: 'Últimos pedidos',
  pedidosVacio: 'Todavía no hay pedidos en el periodo.',
  pedidosTodos: 'Ver todos los pedidos',
  pedidosListaTitulo: 'Pedidos',
  pedidosListaIntro: 'Los pedidos pagados de la tienda, del más reciente al más antiguo.',
  pedidosListaVacio: 'Todavía no hay pedidos pagados.',
  pedidosFiltroVacio: (label) => `No hay pedidos en «${label}».`,
  pedidosFiltros: 'Filtrar por estado',
  pedidosCuenta: (n) => `${n} ${n === 1 ? 'pedido' : 'pedidos'}`,
  ver: 'Ver',
  stockTitulo: 'Se está acabando',
  stockIntro: (limite) => `Publicados con ${limite} piezas o menos, de menos a más.`,
  stockVacio: 'Nada por debajo del umbral: todo el inventario tiene existencias.',
  stockPiezas: (n) => `${n} ${n === 1 ? 'pieza' : 'piezas'}`,
  inventarioTitulo: 'Todo el inventario',
  inventarioCuenta: (n) => `${n} ${n === 1 ? 'artículo' : 'artículos'}`,
  si: 'Sí',
  variacionPie: 'respecto al periodo anterior',
  sinFoto: 'Sin foto',
  acciones: 'Acciones',
  nuevo: 'Nuevo artículo',
  editar: 'Editar',
  archivar: 'Archivar',
  restaurar: 'Restaurar',
  archivadosTitulo: 'Archivados',
  archivadosIntro: 'Fuera de la tienda y del inventario. Restaurar los devuelve tal como estaban.',
  archivadosVacio: 'No hay artículos archivados.',
  borrar: 'Borrar',
  marcasTitulo: 'Marcas',
  marcasIntro:
    'Una marca sale en el menú de la tienda y en la portada cuando tiene un artículo publicado. Solo se borran las que no tienen artículos, contando los archivados.',
  marcasVacio: 'Todavía no hay marcas.',
  nuevaMarca: 'Nueva marca',
  categoriasTitulo: 'Categorías',
  categoriasIntro:
    'Las nuevas van al final del menú lateral y del catálogo. Solo se borran las que no tienen artículos, contando los archivados.',
  categoriasVacio: 'Todavía no hay categorías.',
  nuevaCategoria: 'Nueva categoría',
}

// Diálogos de confirmación. Archivar y quitar una imagen se confirman; lo demás
// no, porque se deshace con otro clic.
export const adminConfirm = {
  archivar: {
    titulo: '¿Archivar este artículo?',
    cuerpo: (titulo) =>
      `«${titulo}» saldrá de la tienda y del inventario. Sus datos e imágenes se conservan y puedes restaurarlo desde Archivados.`,
    confirmar: 'Archivar',
    pendiente: 'Archivando…',
  },
  quitarImagen: {
    titulo: '¿Quitar esta imagen?',
    cuerpo: 'Se borra de la galería y del almacenamiento. No se puede deshacer.',
    confirmar: 'Quitar',
    pendiente: 'Quitando…',
  },
  borrarMarca: {
    titulo: '¿Borrar esta marca?',
    cuerpo: (nombre) => `«${nombre}» deja de existir y sale de las categorías que trabajaba. No se puede deshacer.`,
    confirmar: 'Borrar',
    pendiente: 'Borrando…',
  },
  borrarCategoria: {
    titulo: '¿Borrar esta categoría?',
    cuerpo: (nombre) =>
      `«${nombre}» deja de existir y las marcas dejan de trabajarla. No se puede deshacer.`,
    confirmar: 'Borrar',
    pendiente: 'Borrando…',
  },
  pedidoEnviado: {
    titulo: '¿Marcar como enviado?',
    cuerpo: (folio) => `${folio} pasa a «Enviado». Ya no se podrá cancelar.`,
    confirmar: 'Marcar como enviado',
    pendiente: 'Guardando…',
  },
  pedidoEntregado: {
    titulo: '¿Marcar como entregado?',
    cuerpo: (folio) => `${folio} pasa a «Entregado». Es el último paso y no se puede deshacer.`,
    confirmar: 'Marcar como entregado',
    pendiente: 'Guardando…',
  },
  pedidoCancelado: {
    titulo: '¿Cancelar este pedido?',
    cuerpo: (folio) =>
      `${folio} queda cancelado, las piezas vuelven al inventario y se pide a la pasarela devolver el cobro. No se puede deshacer.`,
    confirmar: 'Cancelar pedido',
    pendiente: 'Cancelando…',
  },
  cancelar: 'Cancelar',
}

// Avisos en línea del panel. Toast es de la tienda y no cruza la frontera, así
// que el panel dice lo que pasó en la propia página, arriba de lo que cambió.
export const adminNotices = {
  creado: 'Artículo creado. Ya puedes subir sus imágenes.',
  creadoConImagenes: (n) =>
    n === 1 ? 'Artículo creado con su imagen. Aquí puedes agregar más.' : `Artículo creado con sus ${n} imágenes.`,
  // El artículo ya existe cuando falla la subida: no se deshace, se dice y se
  // deja la galería a mano para reintentar.
  creadoSinImagen: (fallidas, motivo) =>
    `Artículo creado, pero ${fallidas === 1 ? 'una imagen no se subió' : `${fallidas} imágenes no se subieron`}: ${motivo} Súbelas desde la galería.`,
  guardado: (titulo) => `Guardamos los cambios de «${titulo}».`,
  archivado: (titulo) => `«${titulo}» quedó archivado.`,
  restaurado: (titulo) => `«${titulo}» volvió al inventario.`,
  archivadoAviso: 'Este artículo está archivado: no aparece en la tienda ni en el inventario.',
  marcaCreada: (nombre) => `Marca «${nombre}» creada. Ya se puede elegir al dar de alta artículos.`,
  marcaGuardada: (nombre) => `Guardamos los cambios de «${nombre}».`,
  marcaBorrada: (nombre) => `«${nombre}» quedó borrada.`,
  categoriaCreada: (nombre) =>
    `Categoría «${nombre}» creada. Asígnala a sus marcas en Marcas para poder dar de alta artículos en ella.`,
  categoriaGuardada: (nombre) => `Guardamos los cambios de «${nombre}».`,
  categoriaBorrada: (nombre) => `«${nombre}» quedó borrada.`,
  pedidoActualizado: (folio, estado) => `El pedido ${folio} quedó como «${estados[estado]?.label ?? estado}».`,
}

// ─── Detalle de un pedido ──────────────────────────────────────────────────

export const orderDetailCopy = {
  volver: 'Volver a pedidos',
  titulo: (folio) => `Pedido ${folio}`,
  pagadoEl: (fecha) => `Pagado el ${fecha}`,
  articulos: 'Artículos',
  cantidad: (n) => `× ${n}`,
  cliente: 'Cliente',
  correo: 'Correo',
  envio: 'Envío',
  telefono: 'Teléfono',
  referencias: 'Referencias',
  pago: 'Pago',
  tarjeta: (ultimos4) => `Tarjeta terminada en ${ultimos4}`,
  referenciaCobro: 'Referencia del cobro',
  desglose: 'Desglose',
  piezas: (n) => `${n} ${n === 1 ? 'pieza' : 'piezas'}`,
  envioCosto: 'Envío',
  gratis: 'Gratis',
  base: 'Subtotal sin IVA',
  iva: (tasa) => `IVA ${Math.round(tasa * 100)}%`,
  total: 'Total',
  ivaIncluido: 'IVA incluido',
  sinAcciones: 'Este pedido ya no admite cambios de estado.',
  // Qué botones tiene un pedido según su estado: las únicas transiciones que la
  // base acepta (db/scripts/16). El primero es la acción principal.
  acciones: {
    pendiente: [
      { estado: 'enviado', label: 'Marcar como enviado', variante: 'primary', confirma: 'pedidoEnviado' },
      { estado: 'cancelado', label: 'Cancelar pedido', variante: 'warn', confirma: 'pedidoCancelado' },
    ],
    enviado: [
      { estado: 'entregado', label: 'Marcar como entregado', variante: 'primary', confirma: 'pedidoEntregado' },
    ],
    entregado: [],
    cancelado: [],
  },
}

// ─── Formulario de artículo ────────────────────────────────────────────────

export const productFormCopy = {
  nuevoTitulo: 'Nuevo artículo',
  nuevoIntro: 'Las imágenes se suben después de crearlo.',
  editarTitulo: 'Editar artículo',
  crear: 'Crear artículo',
  creando: 'Creando…',
  guardar: 'Guardar cambios',
  guardando: 'Guardando…',
  cancelar: 'Cancelar',
  volver: 'Volver al inventario',
  sku: 'SKU',
  secciones: {
    datos: 'Datos',
    clasificacion: 'Clasificación',
    venta: 'Precio y existencias',
    publicacion: 'Publicación',
    imagen: 'Imagen',
  },
  vistaPrevia: 'Vista previa',
  vistaPreviaNota: 'Así se ve la tarjeta en el catálogo de la tienda.',
  vistaPreviaBorrador: 'Sin publicar: este artículo no saldrá en la tienda.',
  vistaPreviaTitulo: 'Título del artículo',
  vistaPreviaCategoria: 'Categoría',
}

// El campo de imagen del alta. La galería de la edición reúsa las mismas reglas
// (utils/imageRules.js), pero aquí la imagen solo se elige: se sube al crear.
export const imagePickerCopy = {
  ayuda:
    'Opcional. Hasta 8 imágenes JPG, PNG o WebP de hasta 10 MB cada una, entre 800 × 800 y 5000 × 5000 píxeles. La primera es la principal y se puede cambiar antes de crear el artículo.',
  elegir: 'Elegir imágenes',
  agregar: 'Agregar más',
  quitar: 'Quitar',
  principal: 'Principal',
  hacerPrincipal: 'Hacer principal',
  ninguna: 'Ninguna imagen elegida',
  contador: (n) => `${n} de 8`,
  alt: (n) => `Imagen elegida ${n}`,
  llena: 'Ya elegiste las 8 imágenes que admite un artículo; las que sobraron se descartaron.',
  avisoProporcion: (ancho, alto) =>
    `Mide ${ancho} × ${alto}. Se verá recortada en la tarjeta; lo ideal es una vertical 4:5 de al menos 1000 × 1250.`,
}

/**
 * Los campos del artículo, en el orden del formulario Y del esquema del servidor
 * (productSchema en backend/validation/admin.schema.js): el primer error que se
 * enfoca tiene que ser el primero que se ve.
 *
 * `options` nombra de qué catálogo salen las opciones de un select; `dependsOn`
 * dice qué campo las filtra; `visibleIf` qué propiedad de la categoría elegida
 * hace que el campo exista. Añadir un campo es añadirlo aquí y en el esquema.
 */
export const productFields = [
  { name: 'titulo', label: 'Título', type: 'text', seccion: 'datos', maxLength: 120 },
  { name: 'descripcion', label: 'Descripción', type: 'textarea', seccion: 'datos', maxLength: 600 },
  {
    name: 'categoria',
    label: 'Categoría',
    type: 'select',
    options: 'categorias',
    placeholder: 'Elige una categoría',
    seccion: 'clasificacion',
  },
  // Sin campo de marca: la tienda es de una sola y el servidor pone la única que
  // hay (productSchema la acepta opcional). Con una segunda marca habría que
  // devolver aquí el select de `options: 'marcas'`, `dependsOn: 'categoria'`, y
  // `marca` a `newProductValues`, `toProductValues` y `toProductBody`.
  {
    name: 'genero',
    label: 'Género',
    type: 'select',
    options: 'generos',
    visibleIf: 'llevaGenero',
    placeholder: 'Elige el género',
    seccion: 'clasificacion',
  },
  {
    name: 'fieltro',
    label: 'Fieltro',
    type: 'select',
    options: 'fieltros',
    visibleIf: 'admiteFieltro',
    // Opcional: la palma y la lana no se miden en X.
    placeholder: 'Sin fieltro',
    optional: true,
    seccion: 'clasificacion',
  },
  {
    name: 'precio',
    label: 'Precio (MXN)',
    type: 'text',
    inputMode: 'decimal',
    placeholder: '4290',
    seccion: 'venta',
  },
  { name: 'stock', label: 'Piezas en existencia', type: 'text', inputMode: 'numeric', placeholder: '0', seccion: 'venta' },
  {
    name: 'publicado',
    label: 'Publicado en la tienda',
    hint: 'Sin publicar es un borrador: no se ve en la tienda.',
    type: 'checkbox',
    seccion: 'publicacion',
  },
  {
    name: 'enPortada',
    label: 'Destacado en portada',
    hint: 'La portada todavía lee su propia selección; esto la marca para cuando lea de aquí.',
    type: 'checkbox',
    seccion: 'publicacion',
  },
]

/**
 * Mensajes de validación del artículo. Copia LITERAL de los de
 * backend/validation/rules.js: el mismo error dice lo mismo venga de donde
 * venga. El cliente comprueba los de formato; «esta marca no trabaja esa
 * categoría» y compañía no hacen falta aquí porque los selectores solo ofrecen
 * lo que vale, y si algo se cuela, el servidor responde con el suyo.
 */
export const productMessages = {
  required: 'Este campo es obligatorio',
  tituloLargo: 'El título admite hasta 120 caracteres',
  descripcionLarga: 'La descripción admite hasta 600 caracteres',
  precio: 'Escribe un precio mayor que cero, con hasta dos decimales',
  stock: 'Escribe un número entero de piezas, de cero en adelante',
  generoFalta: 'Esta categoría necesita género',
}

// El valor inicial de un artículo nuevo: publicado por omisión, porque lo
// normal es dar de alta algo que se va a vender. El borrador es la excepción.
export const newProductValues = {
  titulo: '',
  descripcion: '',
  categoria: '',
  genero: '',
  fieltro: '',
  precio: '',
  stock: '',
  publicado: true,
  enPortada: false,
}

// Del artículo que manda la API a los valores del formulario: precio y stock
// vuelven a texto —es lo que edita un input—, y género y fieltro de null a
// cadena vacía, que es la opción «sin elegir» de sus selects.
export function toProductValues(producto) {
  return {
    titulo: producto.titulo,
    descripcion: producto.descripcion,
    categoria: producto.categoria,
    genero: producto.genero ?? '',
    fieltro: producto.fieltro ?? '',
    // 2850.5 se edita como «2850.50»: así se escribe un precio.
    precio: Number.isInteger(producto.precio) ? String(producto.precio) : producto.precio.toFixed(2),
    stock: String(producto.stock),
    publicado: producto.publicado,
    enPortada: producto.enPortada,
  }
}

// ─── Formularios de marca y categoría ──────────────────────────────────────

export const catalogFormCopy = {
  marca: {
    nuevoTitulo: 'Nueva marca',
    editarTitulo: 'Editar marca',
    crear: 'Crear marca',
    volver: 'Volver a marcas',
    lista: '/admin/marcas',
  },
  categoria: {
    nuevoTitulo: 'Nueva categoría',
    editarTitulo: 'Editar categoría',
    crear: 'Crear categoría',
    volver: 'Volver a categorías',
    lista: '/admin/categorias',
    secciones: {
      datos: 'Datos',
      atributos: 'Qué piden sus artículos',
    },
  },
  creando: 'Creando…',
  guardar: 'Guardar cambios',
  guardando: 'Guardando…',
  cancelar: 'Cancelar',
  conArticulos: 'con artículos',
  enTiendaSi: 'Sale en el menú de la tienda y en la portada.',
  enTiendaNo: 'Todavía no sale en la tienda: aparece cuando tenga un artículo publicado.',
  marcasDe: (nombres) => `La trabajan: ${nombres}.`,
  sinMarcas: 'Ninguna marca la trabaja todavía: asígnala desde Marcas para poder dar de alta artículos en ella.',
}

/**
 * Los campos de una marca, en el orden de brandSchema
 * (backend/validation/admin.schema.js).
 *
 * `checkboxes` es un grupo de casillas cuyo valor es la lista de ids marcados.
 */
export const brandFields = [
  { name: 'nombre', label: 'Nombre', type: 'text', maxLength: 40, placeholder: 'Ferrería del Norte' },
  {
    name: 'categorias',
    label: 'Categorías que trabaja',
    type: 'checkboxes',
    hint: 'Al dar de alta un artículo, la marca solo se ofrece en estas categorías.',
  },
]

/**
 * Los campos de una categoría, en el orden de categorySchema.
 *
 * `fijo` nombra la bandera del servidor que bloquea el campo —la categoría ya
 * tiene artículos— y `hintFijo` es lo que se dice entonces en lugar del `hint`.
 */
export const categoryFields = [
  { name: 'nombre', label: 'Nombre', type: 'text', maxLength: 40, placeholder: 'Chalecos', seccion: 'datos' },
  {
    name: 'prefijo',
    label: 'Prefijo del SKU',
    type: 'text',
    maxLength: 3,
    placeholder: 'CHA',
    seccion: 'datos',
    hint: 'Tres letras: RDO-CHA-001. Queda fijo en cuanto la categoría tenga artículos.',
    fijo: 'prefijoFijo',
    hintFijo: 'Ya está en el SKU de sus artículos y no se puede cambiar.',
  },
  {
    name: 'llevaGenero',
    label: 'Lleva género',
    type: 'checkbox',
    seccion: 'atributos',
    hint: 'Cada artículo tendrá que elegir Dama, Caballero o Unisex. Se decide antes del primer artículo.',
    fijo: 'generoFijo',
    hintFijo: 'La categoría ya tiene artículos: el género no se puede activar ni quitar.',
  },
  {
    name: 'admiteFieltro',
    label: 'Admite fieltro',
    type: 'checkbox',
    seccion: 'atributos',
    hint: 'Cada artículo podrá indicar su X de fieltro, de 2X a 5000X, si la tiene.',
    fijo: 'fieltroFijo',
    hintFijo: 'Hay artículos con fieltro en esta categoría: no se puede quitar.',
  },
]

// Copia LITERAL de los mensajes de formato de backend/validation/rules.js. Los
// que dependen de lo que ya hay —nombre repetido, prefijo ocupado— los manda el
// servidor.
export const catalogMessages = {
  required: 'Este campo es obligatorio',
  nombreLargo: 'El nombre admite hasta 40 caracteres',
  prefijo: 'Escribe tres letras sin acentos ni ñ, como BOT',
  categorias: 'Elige al menos una categoría',
}

export const newBrandValues = { nombre: '', categorias: [] }

export const toBrandValues = (marca) => ({ nombre: marca.label, categorias: marca.categorias })

export const newCategoryValues = { nombre: '', prefijo: '', llevaGenero: false, admiteFieltro: false }

export const toCategoryValues = (categoria) => ({
  nombre: categoria.label,
  prefijo: categoria.prefijo,
  llevaGenero: categoria.llevaGenero,
  admiteFieltro: categoria.admiteFieltro,
})

// ─── Galería ───────────────────────────────────────────────────────────────

export const galleryCopy = {
  titulo: 'Imágenes',
  intro: 'La primera es la principal: la que sale en la tarjeta del catálogo. Hasta 8.',
  recomendacion:
    'JPG, PNG o WebP de hasta 10 MB, entre 800 × 800 y 5000 × 5000 píxeles. Se ajustan solas al marco de la tarjeta recortando los bordes. Recomendado: vertical 4:5, de 1000 × 1250 o más.',
  subir: 'Subir imágenes',
  subiendo: (nombre) => `Subiendo ${nombre}…`,
  vacia: 'Este artículo todavía no tiene imágenes.',
  llena: 'La galería está completa. Quita una imagen para subir otra.',
  principal: 'Principal',
  hacerPrincipal: 'Hacer principal',
  quitar: 'Quitar',
  alt: (titulo, n) => `${titulo}, imagen ${n}`,
  // Comprobaciones antes de subir. Tipo, peso y tamaño mínimo y máximo bloquean
  // —el servidor los rechazaría igual—; la proporción recomendada solo avisa.
  errorTipo: (nombre) => `«${nombre}» no es JPG, PNG ni WebP.`,
  errorPeso: (nombre) => `«${nombre}» pesa más de 10 MB.`,
  errorChica: (nombre, ancho, alto) =>
    `«${nombre}» mide ${ancho} × ${alto}. Tiene que medir al menos 800 × 800 píxeles.`,
  errorGrande: (nombre, ancho, alto) =>
    `«${nombre}» mide ${ancho} × ${alto}. No puede pasar de 5000 × 5000 píxeles.`,
  avisoMedidas: (nombre, ancho, alto) =>
    `«${nombre}» mide ${ancho} × ${alto}. Se subió, pero en la tarjeta se verá mejor una vertical 4:5 de al menos 1000 × 1250.`,
}

// Los tres estados que necesita cualquier vista que pida datos. El de error
// recibe el ApiError y enseña su `message`, que ya viene escrito para leerse
// —http.js se encarga— tanto si es un 403 como si es la red caída.
export const adminStates = {
  loading: 'Cargando…',
  errorTitulo: 'No pudimos cargar esto',
  reintentar: 'Reintentar',
  vacio: 'No hay artículos en esta categoría.',
}

/**
 * Los dos avisos de /admin.
 *
 * Ya no son pantallas: quien no administra no ve nada de /admin, se le manda a
 * la portada y el aviso es lo único que queda para decir por qué. Sobrevive al
 * cambio de ruta sin que haya que hacer nada — ToastProvider envuelve a
 * AuthProvider, que envuelve a las rutas, así que la pila no se desmonta al
 * navegar.
 *
 * Son dos y no uno porque no dicen lo mismo. A quien no tiene sesión le falta un
 * paso que puede dar; a quien la tiene y no le toca, no. Un texto que valiera
 * para los dos casos tendría que ser tan vago que no serviría para ninguno.
 *
 * `tone: 'error'` porque es uno de los dos únicos que declara Toast.jsx, y de
 * los dos es el que corresponde: no ha salido bien lo que se intentaba.
 */
export const adminToasts = {
  anonimo: {
    tone: 'error',
    title: 'Zona restringida',
    body: 'Entra con una cuenta del equipo para ver el panel.',
  },
  cliente: {
    tone: 'error',
    title: 'Esta zona es del equipo',
    body: 'Tu cuenta no tiene permisos de administración. Si crees que debería tenerlos, habla con quien lleva la tienda.',
  },
}

// Cerrar sesión no tiene aviso propio aquí: sale de data/auth.js tal cual, porque
// cerrar sesión es lo mismo se haga desde donde se haga, y dos textos para una
// misma acción es como acaban diciendo cosas distintas.

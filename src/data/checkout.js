// Copy y campos de la compra: el envío, el pago y la confirmación del pedido. Todo
// el texto vive aquí y no en el JSX, como en el resto de data/.

import { authViews } from './auth'

// ─── Campos ────────────────────────────────────────────────────────────────

// Quién recibe. Se siembran con los datos de la cuenta, pero se pueden cambiar:
// un sombrero también se regala.
export const contactFields = [
  {
    name: 'destinatario',
    label: 'Quién recibe',
    type: 'text',
    placeholder: 'Nombre y apellido',
    autoComplete: 'name',
  },
  {
    name: 'telefono',
    label: 'Teléfono de contacto',
    type: 'tel',
    placeholder: '10 dígitos',
    autoComplete: 'tel-national',
    inputMode: 'tel',
  },
]

// País, estado, código postal, colonia, calle y número SON los del alta, derivados
// de ahí y no copiados: una dirección es la misma cosa se pida donde se pida, y lo
// que se cambie en el alta —un campo más, una etiqueta— llega aquí solo.
export const addressFields = authViews.register.sections.find(
  (section) => section.title === 'Dirección de envío',
).fields

// Opcional: lo único que se puede dejar vacío. Va aparte de la dirección porque
// vale igual para una guardada que para una nueva.
export const referenciasField = {
  name: 'referencias',
  label: 'Referencias de entrega (opcional)',
  type: 'text',
  placeholder: 'Entre calles, color del portón…',
  autoComplete: 'off',
  optional: true,
}

// El valor del grupo de direcciones cuando se escribe una nueva.
export const OTRA = 'nueva'

export const cardFields = [
  {
    name: 'tarjetaNombre',
    label: 'Nombre en la tarjeta',
    type: 'text',
    placeholder: 'Como aparece en la tarjeta',
    autoComplete: 'cc-name',
  },
  {
    name: 'tarjetaNumero',
    label: 'Número de tarjeta',
    type: 'text',
    placeholder: '0000 0000 0000 0000',
    autoComplete: 'cc-number',
    inputMode: 'numeric',
  },
  {
    name: 'tarjetaVence',
    label: 'Vence',
    type: 'text',
    placeholder: 'MM/AA',
    autoComplete: 'cc-exp',
    inputMode: 'numeric',
    half: true,
  },
  {
    name: 'tarjetaCvc',
    label: 'Código de seguridad',
    type: 'text',
    placeholder: '3 o 4 dígitos',
    autoComplete: 'cc-csc',
    inputMode: 'numeric',
    half: true,
  },
]

// Copia LITERAL de los de backend/validation/rules.js (los dos primeros): el mismo
// error dice lo mismo venga de donde venga. Los de la tarjeta no tienen copia en
// el servidor, que nunca ve el número: solo los comprueba este formulario.
export const checkoutMessages = {
  destinatarioLargo: 'El nombre admite hasta 120 caracteres',
  referenciasLargas: 'Las referencias admiten hasta 200 caracteres',
  tarjetaNumero: 'Escribe un número de tarjeta válido',
  tarjetaVence: 'Escribe la fecha como MM/AA',
  tarjetaVencida: 'La tarjeta está vencida',
  tarjetaCvc: 'El código tiene 3 o 4 dígitos',
}

// ─── Copy ──────────────────────────────────────────────────────────────────

export const checkoutCopy = {
  kicker: 'Tu compra',
  title: 'Finalizar compra',

  pasos: [
    { key: 'envio', label: 'Envío' },
    { key: 'pago', label: 'Pago' },
  ],
  pasosAria: 'Pasos de la compra',

  invitacionKicker: 'Compra',
  invitacionTitulo: 'Entra para comprar',
  invitacionCuerpo: 'Tu bolsa y tus direcciones viven en tu cuenta, así que el pago sale en dos pasos.',

  vacioTitulo: 'Tu bolsa está vacía',
  vacioCuerpo: 'Añade un sombrero para poder pagar.',
  verCatalogo: 'Ver el catálogo',

  problemaTitulo: 'Revisa tu bolsa antes de pagar',
  problemaCuerpo: 'Hay artículos de los que ya no quedan tantas piezas como pediste.',
  volverBolsa: 'Volver a la bolsa',

  cargando: 'Cargando…',
  errorTitulo: 'No pudimos cargar esto',
  reintentar: 'Reintentar',

  // Paso 1
  envioTitulo: 'Adónde lo enviamos',
  envioIntro: 'Confirma la dirección de envío o escribe una distinta.',
  contacto: 'Contacto',
  direccion: 'Dirección',
  guardadas: 'Direcciones guardadas',
  predeterminada: 'Predeterminada',
  otraDireccion: 'Enviar a otra dirección',
  otraNota: 'Escribe la dirección de entrega.',
  guardar: 'Guardar esta dirección en mi cuenta',
  continuar: 'Continuar al pago',

  // Paso 2
  pagoTitulo: 'Pago',
  pagoIntro: 'Pagas con tarjeta. El total ya incluye el IVA.',
  enviarA: 'Enviar a',
  cambiar: 'Cambiar',
  tarjeta: 'Tarjeta',
  pagar: (total) => `Pagar ${total}`,
  pagando: 'Procesando el pago…',
  volverEnvio: 'Volver al envío',
  pagoNotaDemo:
    'Demo: no se hace ningún cargo. Usa 4242 4242 4242 4242 (aprobada), 4000 0000 0000 0002 (rechazada por el banco) o 4000 0000 0000 9995 (sin fondos), con cualquier fecha futura y cualquier código.',
  pagoSeguro: 'Tu número de tarjeta no se guarda ni pasa por nuestro servidor.',

  seguirComprando: 'Seguir comprando',
}

// El desglose, que usan el paso de pago y la confirmación.
export const summaryCopy = {
  resumen: 'Resumen',
  tuPedido: 'Tu pedido',
  articulos: (n) => (n === 1 ? '1 artículo' : `${n} artículos`),
  envio: 'Envío',
  gratis: 'Gratis',
  base: 'Subtotal sin IVA',
  iva: (tasa) => `IVA ${Math.round(tasa * 100)}%`,
  total: 'Total',
  ivaIncluido: 'IVA incluido',
  faltaGratis: (monto) => `Te faltan ${monto} para el envío gratis.`,
  cantidad: (n) => `Cantidad: ${n}`,
}

// ─── Confirmación ──────────────────────────────────────────────────────────

export const orderCopy = {
  kicker: 'Pedido recibido',
  title: (nombre) => `Gracias, ${nombre}`,
  folio: 'Folio',
  fecha: 'Fecha',
  estado: 'Estado',
  estados: {
    por_pagar: 'Por pagar',
    pendiente: 'Pago aprobado, preparamos tu envío',
    enviado: 'En camino',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
  },
  envio: 'Se envía a',
  telefono: 'Teléfono',
  pago: 'Pago',
  tarjeta: (ultimos4) => `Tarjeta terminada en ${ultimos4}`,
  articulos: 'Artículos',
  cantidad: (n) => `Cantidad: ${n}`,
  misPedidos: 'Mis pedidos',
  seguirComprando: 'Seguir comprando',
  // Cancelar: solo mientras el pedido no se haya enviado.
  cancelar: 'Cancelar pedido',
  cancelarPregunta: '¿Cancelar este pedido?',
  cancelarCuerpo: 'Las piezas vuelven a la tienda y te devolvemos el pago. No se puede deshacer.',
  cancelarConfirmar: 'Sí, cancelar',
  cancelarConservar: 'No, conservarlo',
  cancelando: 'Cancelando…',
  noSeCancela: 'Este pedido ya salió de la tienda, así que ya no se puede cancelar.',
  invitacionKicker: 'Pedido',
  invitacionTitulo: 'Entra para ver tu pedido',
  invitacionCuerpo: 'Los pedidos están en tu cuenta.',
  noExisteTitulo: 'No encontramos este pedido',
  noExisteCuerpo: 'Puede que el enlace esté mal escrito o que el pedido sea de otra cuenta.',
  cargando: 'Cargando…',
  errorTitulo: 'No pudimos cargar esto',
  reintentar: 'Reintentar',
}

// ─── Mis pedidos ───────────────────────────────────────────────────────────

export const ordersCopy = {
  kicker: 'Tu cuenta',
  title: 'Mis pedidos',
  intro: 'Lo que has comprado, del más reciente al más antiguo.',
  cuenta: (n) => (n === 1 ? '1 pedido' : `${n} pedidos`),
  piezas: (n) => (n === 1 ? '1 pieza' : `${n} piezas`),
  folio: 'Folio',
  ver: 'Ver pedido',
  vacioTitulo: 'Todavía no has comprado nada',
  vacioCuerpo: 'Cuando pagues un pedido lo verás aquí, con su estado.',
  verCatalogo: 'Ver el catálogo',
  invitacionKicker: 'Pedidos',
  invitacionTitulo: 'Entra para ver tus pedidos',
  invitacionCuerpo: 'Tus pedidos viven en tu cuenta, así que los ves desde cualquier dispositivo.',
  cargando: 'Cargando…',
  errorTitulo: 'No pudimos cargar esto',
  reintentar: 'Reintentar',
}

// ─── Avisos (toasts) ───────────────────────────────────────────────────────

export const checkoutToasts = {
  invalid: {
    tone: 'error',
    title: 'Revisa el formulario',
    body: 'Faltan datos o hay algo mal escrito.',
  },
  pagado: (folio) => ({
    tone: 'success',
    title: 'Pago aprobado',
    body: `Tu pedido ${folio} está en marcha.`,
  }),
  failure: {
    tone: 'error',
    title: 'No pudimos completar el pago',
  },
  cancelado: (folio) => ({
    tone: 'success',
    title: 'Pedido cancelado',
    body: `${folio} quedó cancelado y te devolvemos el pago.`,
  }),
  cancelFailure: {
    tone: 'error',
    title: 'No pudimos cancelar',
  },
}

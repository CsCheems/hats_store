// Copy y estructura del modal de acceso. Los campos se declaran aquí como
// datos —igual que `promises` o `footerColumns`— y AuthForm los recorre para
// dibujar la grilla. Añadir o quitar un campo es editar este archivo, nunca el
// JSX.
//
// `half: true` ocupa media fila en la grilla de dos columnas; sin él el campo
// va a lo ancho.

export const authViews = {
  login: {
    tab: 'Entrar',
    kicker: '01 — Tu cuenta',
    title: 'Pasa a la casa',
    intro: 'Entra para ver tus pedidos, tus tallas y lo que dejaste apartado.',
    submit: 'Entrar',
    pending: 'Entrando…',
    sections: [
      {
        fields: [
          {
            name: 'email',
            label: 'Correo',
            type: 'email',
            placeholder: 'tu@correo.com',
            autoComplete: 'email',
          },
          {
            name: 'password',
            label: 'Contraseña',
            type: 'password',
            placeholder: '••••••••',
            autoComplete: 'current-password',
          },
        ],
      },
    ],
    // La compra como invitado ya está en el plan de la tienda: el correo es
    // requisito porque el ticket llega por ahí.
    note: 'También puedes comprar sin cuenta. Solo necesitamos tu correo para enviarte el ticket.',
  },

  register: {
    tab: 'Crear cuenta',
    kicker: '02 — Alta',
    title: 'Abre tu cuenta',
    intro: 'Guardamos tu dirección para que la próxima compra salga en dos clics.',
    submit: 'Crear cuenta',
    pending: 'Creando cuenta…',
    sections: [
      {
        title: 'Datos personales',
        fields: [
          {
            name: 'nombre',
            label: 'Nombre',
            type: 'text',
            placeholder: 'Rosa',
            autoComplete: 'given-name',
            half: true,
          },
          {
            name: 'apellido',
            label: 'Apellido',
            type: 'text',
            placeholder: 'Íñiguez',
            autoComplete: 'family-name',
            half: true,
          },
          {
            name: 'telefono',
            label: 'Teléfono',
            type: 'tel',
            placeholder: '10 dígitos',
            autoComplete: 'tel-national',
            inputMode: 'tel',
          },
        ],
      },
      {
        title: 'Dirección de envío',
        fields: [
          // País y estado se eligen de una lista (el catálogo de la base de
          // datos, vía useUbicaciones). `options` dice de qué lista sale cada
          // uno, `dependsOn` que los estados son los del país elegido, y
          // `defaultValue` que el país ya viene puesto: hoy solo se envía a
          // México. El `autoComplete` se queda para cuando la lista no carga y el
          // campo vuelve a ser de texto.
          {
            name: 'pais',
            label: 'País',
            type: 'select',
            options: 'paises',
            defaultValue: 'México',
            placeholder: 'Elige tu país',
            autoComplete: 'country-name',
            half: true,
          },
          {
            name: 'estado',
            label: 'Estado',
            type: 'select',
            options: 'estados',
            dependsOn: 'pais',
            placeholder: 'Elige tu estado',
            autoComplete: 'address-level1',
            half: true,
          },
          {
            name: 'codigoPostal',
            label: 'Código postal',
            type: 'text',
            placeholder: '5 dígitos',
            autoComplete: 'postal-code',
            inputMode: 'numeric',
            half: true,
          },
          {
            name: 'colonia',
            label: 'Colonia',
            type: 'text',
            placeholder: 'Centro',
            autoComplete: 'address-level3',
            half: true,
          },
          {
            name: 'calle',
            label: 'Calle',
            type: 'text',
            placeholder: 'Padre Mier',
            autoComplete: 'address-line1',
            half: true,
          },
          {
            name: 'numero',
            label: 'Número',
            type: 'text',
            placeholder: '148',
            autoComplete: 'address-line2',
            half: true,
          },
        ],
      },
      {
        title: 'Acceso',
        fields: [
          {
            name: 'email',
            label: 'Correo',
            type: 'email',
            placeholder: 'tu@correo.com',
            autoComplete: 'email',
          },
          {
            name: 'password',
            label: 'Contraseña',
            type: 'password',
            placeholder: 'Mínimo 8 caracteres',
            autoComplete: 'new-password',
            half: true,
          },
          {
            name: 'confirmPassword',
            label: 'Confirmar contraseña',
            type: 'password',
            placeholder: 'Repite la contraseña',
            autoComplete: 'new-password',
            half: true,
          },
        ],
      },
    ],
    note: 'Al crear la cuenta aceptas nuestros términos y el aviso de privacidad.',
  },
}

// Opciones del menú de cuenta. Los iconos se resuelven con un mapa `ICONS` en
// AccountMenu, igual que en PromiseRow y LegalBar.
//
// `to` es una ruta del sitio y navega con el router, sin recargar; `href` es un
// ancla de las de siempre, para las páginas que todavía no existen. AccountMenu
// elige el elemento según cuál de los dos venga.
//
// `soloAdmin` esconde la entrada de quien no administra. Es comodidad, no
// seguridad: quien quiera puede escribir /admin en la barra, y quien lo pare es
// el servidor. Se oculta porque enseñarle a una clienta una puerta que le van a
// cerrar no es informarla de nada.
//
// «Cerrar sesión» no está aquí a propósito: es una acción, no un enlace.
export const accountMenu = [
  { label: 'Mis pedidos', icon: 'orders', href: '#' },
  { label: 'Guardados', icon: 'saved', href: '#' },
  { label: 'Mis datos', icon: 'profile', to: '/perfil' },
  { label: 'Panel de administrador', icon: 'admin', to: '/admin', soloAdmin: true },
]

// Rótulo fijo del modal. No cambia con la vista: es lo único que se queda
// quieto mientras el resto hace el fundido.
export const authHeader = 'Nicol Hats — Acceso'

// Lista plana de campos por vista, derivada de las secciones —mismo patrón que
// `productPages` en products.js. La usan la validación y el estado inicial del
// formulario, que no necesitan saber de secciones.
export const authFields = Object.fromEntries(
  Object.entries(authViews).map(([view, config]) => [
    view,
    config.sections.flatMap((section) => section.fields),
  ]),
)

// Mensajes de validación de cliente. Los consume utils/validation.js.
export const validationMessages = {
  required: 'Este campo es obligatorio',
  email: 'Escribe un correo válido',
  telefono: 'El teléfono debe tener 10 dígitos',
  codigoPostal: 'El código postal debe tener 5 dígitos',
  passwordShort: 'La contraseña necesita al menos 8 caracteres',
  passwordMismatch: 'Las contraseñas no coinciden',
}

// Textos de los toasts. `body` puede ser función cuando depende del usuario.
export const authToasts = {
  invalid: {
    tone: 'error',
    title: 'Revisa el formulario',
    body: 'Faltan datos o hay algo mal escrito.',
  },
  loginSuccess: {
    tone: 'success',
    title: 'Sesión iniciada',
    body: (user) => `Qué gusto verte de vuelta, ${user.nombre}.`,
  },
  registerSuccess: {
    tone: 'success',
    title: 'Cuenta creada',
    // Sin marca de género: no sabemos el de quien se registra.
    body: (user) => `Te damos la bienvenida a la casa, ${user.nombre}.`,
  },
  logout: {
    tone: 'success',
    title: 'Sesión cerrada',
    body: 'Aquí te esperamos.',
  },
  // Cerrar sesión son dos cosas: olvidarla aquí e invalidarla en el servidor. Si
  // lo segundo falla, decirlo — en una computadora compartida la diferencia
  // importa, y un «sesión cerrada» a secas sería mentira.
  logoutLocalOnly: {
    tone: 'error',
    title: 'Sesión cerrada aquí',
    body: 'No pudimos avisar al servidor. Si no es tu computadora, vuelve a cerrarla más tarde.',
  },
  failure: {
    tone: 'error',
    title: 'No pudimos continuar',
  },
}

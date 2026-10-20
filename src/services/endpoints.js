// Mapa único de rutas de la API. Ningún componente ni servicio escribe una URL
// a mano: si el backend renombra algo, se cambia aquí y en ningún otro sitio.
//
// Las rutas con parámetro son funciones, para que la interpolación viva también
// en este archivo.

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    // GET lee la sesión; PUT guarda la edición del perfil.
    me: '/auth/me',
  },
  products: {
    list: '/products',
    // Los slugs solo llevan [a-z0-9-], pero la ruta la compone este archivo y no
    // debería depender de lo que la base decida admitir.
    detail: (id) => `/products/${encodeURIComponent(id)}`,
    // Leer las reseñas es público; escribirlas (`resenas`) pide sesión.
    reviews: (id) => `/products/${encodeURIComponent(id)}/resenas`,
  },
  // Lo de cada persona. Todo pide sesión: sin ella el servidor responde 401.
  favoritos: '/favoritos',
  favorito: (id) => `/favoritos/${encodeURIComponent(id)}`,
  carrito: '/carrito',
  carritoItem: (id) => `/carrito/${encodeURIComponent(id)}`,
  resenas: {
    one: (id) => `/resenas/${encodeURIComponent(id)}`,
    mine: (id) => `/resenas/${encodeURIComponent(id)}/mia`,
  },
  // La compra. `resumen` es lo que se pagaría hoy por la bolsa, con IVA; POST a
  // `crear` paga; `uno` lee un pedido propio por su folio. Las direcciones
  // guardadas son las que se ofrecen en el paso de envío.
  pedidos: {
    resumen: '/pedidos/resumen',
    // GET lista los míos; POST paga.
    lista: '/pedidos',
    crear: '/pedidos',
    uno: (folio) => `/pedidos/${encodeURIComponent(folio)}`,
    cancelar: (folio) => `/pedidos/${encodeURIComponent(folio)}/cancelar`,
  },
  direcciones: '/direcciones',
  // Países y estados para los desplegables del alta y del perfil. Sin sesión.
  ubicaciones: '/ubicaciones',
  // Todo lo de aquí va detrás de requireAuth + requireAdmin en el servidor: sin
  // sesión da 401 y con sesión de cliente da 403.
  admin: {
    summary: '/admin/summary',
    // Los pedidos pagados. El folio («NHT-00012») es el identificador en la URL.
    orders: '/admin/orders',
    order: (folio) => `/admin/orders/${encodeURIComponent(folio)}`,
    orderState: (folio) => `/admin/orders/${encodeURIComponent(folio)}/estado`,
    categories: '/admin/categories',
    catalogos: '/admin/catalogos',
    products: '/admin/products',
    // El slug va codificado aunque hoy solo lleve [a-z0-9-]: la ruta la compone
    // este archivo, y no debería depender de lo que la base decida admitir.
    product: (id) => `/admin/products/${encodeURIComponent(id)}`,
    restore: (id) => `/admin/products/${encodeURIComponent(id)}/restaurar`,
    images: (id) => `/admin/products/${encodeURIComponent(id)}/imagenes`,
    image: (id, imagenId) => `/admin/products/${encodeURIComponent(id)}/imagenes/${imagenId}`,
    principal: (id, imagenId) =>
      `/admin/products/${encodeURIComponent(id)}/imagenes/${imagenId}/principal`,
    category: (id) => `/admin/categories/${encodeURIComponent(id)}`,
    brands: '/admin/brands',
    brand: (id) => `/admin/brands/${encodeURIComponent(id)}`,
  },
}

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { CartProvider } from './context/CartProvider'
import { FavoritesProvider } from './context/FavoritesProvider'
import { ThemeProvider } from './context/ThemeProvider'
import { ToastProvider } from './context/ToastProvider'
import AdminArchivados from './page/Admin/Archivados/page'
import AdminCategoria from './page/Admin/Categoria/page'
import AdminCategorias from './page/Admin/Categorias/page'
import AdminMarca from './page/Admin/Marca/page'
import AdminMarcas from './page/Admin/Marcas/page'
import Admin from './page/Admin/page'
import AdminProducto from './page/Admin/Producto/page'
import AdminProductos from './page/Admin/Productos/page'
import AdminResumen from './page/Admin/Resumen/page'
import Cart from './page/Cart/page'
import Catalog from './page/Catalog/page'
import Home from './page/Home/page'
import Product from './page/Product/page'
import Profile from './page/Profile/page'
import Saved from './page/Saved/page'

// Cinco providers, de fuera adentro: el modo claro/oscuro, los avisos, la sesión,
// los favoritos y la bolsa. El modo va fuera de todo porque no depende de nada y
// los avisos y el modal de acceso se dibujan con sus variables. Los avisos van
// por fuera de la sesión: el modal de acceso los usa, y también los favoritos y
// la bolsa. Los dos últimos van DENTRO de la sesión porque lo que guardan es de
// quien la tiene, y se recargan cuando cambia.
//
// Envuelven a las rutas y no al revés: el modal de acceso vive dentro de
// AuthProvider, así que se puede abrir desde cualquier página y sobrevive a la
// navegación entre ellas.
export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
        <FavoritesProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/producto/:slug" element={<Product />} />
            <Route path="/guardados" element={<Saved />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/perfil" element={<Profile />} />

            {/* /admin es una ruta CON HIJAS: la de arriba decide quién pasa y
                pone la cáscara del panel, y las de dentro son lo que cambia. Así
                la guardia se escribe una sola vez, y una sección nueva del panel
                nace protegida por estar donde está — igual que en el servidor,
                donde los dos filtros cuelgan del router y no de cada ruta. */}
            <Route path="/admin" element={<Admin />}>
              <Route index element={<AdminResumen />} />
              <Route path="productos" element={<AdminProductos />} />
              {/* «nuevo» es un segmento fijo y el router lo prefiere sobre
                  `:categoria`, así que no hay que ordenar nada. Una categoría
                  que se llamara «nuevo» quedaría tapada: no puede existir, lo
                  impiden el servidor y un check de la base. */}
              <Route path="productos/nuevo" element={<AdminProducto />} />
              <Route path="productos/:categoria" element={<AdminProductos />} />
              <Route path="articulos/:id" element={<AdminProducto />} />
              <Route path="archivados" element={<AdminArchivados />} />
              {/* La edición cuelga de `:id/editar` y no de `:id`: así «nueva»
                  no tapa a ninguna marca ni categoría que se llame así. */}
              <Route path="marcas" element={<AdminMarcas />} />
              <Route path="marcas/nueva" element={<AdminMarca />} />
              <Route path="marcas/:id/editar" element={<AdminMarca />} />
              <Route path="categorias" element={<AdminCategorias />} />
              <Route path="categorias/nueva" element={<AdminCategoria />} />
              <Route path="categorias/:id/editar" element={<AdminCategoria />} />
            </Route>
          </Routes>
        </CartProvider>
        </FavoritesProvider>
        </AuthProvider>
      </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

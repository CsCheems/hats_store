import { useCallback, useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContext'

const CLAVE = 'nha-tema'

// El script de index.html ya fijó `data-theme` antes del primer pintado; aquí
// solo se lee lo que dejó, así que React y el documento nunca discrepan.
const modoInicial = () =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'

/**
 * El modo de la tienda: claro por defecto y oscuro a elección.
 *
 * Cambiar de modo es escribir `data-theme` en <html>; las variables de
 * index.css hacen el resto, así que ningún componente conoce el modo. El estado
 * existe solo para que el botón sepa qué icono y qué rótulo dar.
 *
 * Se recuerda en localStorage. Puede lanzar (ventana privada, datos bloqueados),
 * de modo que cada acceso va en try/catch y, si falla, el modo dura lo que dura
 * la pestaña: la tienda se ve igual de bien, solo no se acuerda.
 *
 * El panel de administración no participa: tiene sus propios tokens `admin-*`.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(modoInicial)

  const toggleTheme = useCallback(() => {
    setTheme((actual) => {
      const siguiente = actual === 'dark' ? 'light' : 'dark'

      document.documentElement.dataset.theme = siguiente
      try {
        localStorage.setItem(CLAVE, siguiente)
      } catch {
        // Sin almacenamiento: el modo vale para esta pestaña y nada más.
      }

      return siguiente
    })
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext value={value}>{children}</ThemeContext>
}

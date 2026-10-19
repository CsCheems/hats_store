import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { IconButton } from './IconButton'

/**
 * El botón sol/luna del navbar. Muestra el modo AL QUE se pasa, no el actual: el
 * sol dice «ir a claro», la luna «ir a oscuro». `aria-pressed` sería ambiguo con
 * un icono que cambia, así que el estado va en el rótulo.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const oscuro = theme === 'dark'

  return (
    <IconButton
      aria-label={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      onClick={toggleTheme}
    >
      {oscuro ? <Sun size={17} strokeWidth={1.5} /> : <Moon size={17} strokeWidth={1.5} />}
    </IconButton>
  )
}

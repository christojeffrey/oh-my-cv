import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { darkModeAtom } from '@/atoms'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ToggleDark() {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom) as [string, (value: string) => void]

  const modes = [
    { value: 'light', icon: Sun },
    { value: 'dark', icon: Moon },
    { value: 'system', icon: Monitor }
  ]

  const currentIndex = modes.findIndex(m => m.value === darkMode)
  const nextMode = modes[(currentIndex + 1) % modes.length]

  // Effect to apply theme
  useEffect(() => {
    const root = document.documentElement
    const applyTheme = () => {
      if (darkMode === 'dark') {
        root.classList.add('dark')
      } else if (darkMode === 'light') {
        root.classList.remove('dark')
      } else {
        // System
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('dark', systemDark)
      }
    }

    applyTheme()

    // Listen for system changes if in system mode
    if (darkMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => applyTheme()
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [darkMode])

  const switchMode = () => {
    setDarkMode(nextMode.value)
  }

  // The icon should represent the current state or the action?
  // User prefers to see the CURRENT mode icon.
  const CurrentIcon = modes[currentIndex].icon

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchMode}
      className="w-9 h-9 p-0"
      title={`Current mode: ${darkMode}. Click to switch to ${nextMode.value}`}
    >
      <CurrentIcon className="w-4 h-4" />
    </Button>
  )
}
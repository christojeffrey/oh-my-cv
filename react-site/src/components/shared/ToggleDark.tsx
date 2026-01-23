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

  const switchMode = () => {
    setDarkMode(nextMode.value)
    // Apply to document
    const root = document.documentElement
    if (nextMode.value === 'dark') {
      root.classList.add('dark')
    } else if (nextMode.value === 'light') {
      root.classList.remove('dark')
    } else {
      // system
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', systemDark)
    }
  }

  const CurrentIcon = nextMode.icon

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchMode}
      className="w-9 h-9 p-0"
    >
      <CurrentIcon className="w-4 h-4" />
    </Button>
  )
}
import { Link } from '@tanstack/react-router'
import { BrandName } from './BrandName'
import { Logo } from './Logo'
import { ToggleDark } from './ToggleDark'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Github } from 'lucide-react'

export function Header() {
  // Simple language switch - for now just English
  // const currentLang = 'en' // Not used yet
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'zh', name: '中文' }
  ]

  return (
    <header className="flex items-center justify-between px-4 py-2">
      <Link to="/" className="flex items-center gap-2">
        <Logo />
        <BrandName />
      </Link>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-1">
          <span className="w-4 h-4">📋</span>
          <span className="hidden sm:inline">My Resumes</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <span className="w-4 h-4">🌐</span>
              <span className="hidden sm:inline">EN</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {languages.map((lang) => (
              <DropdownMenuItem key={lang.code}>
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ToggleDark />

        <Button variant="ghost" size="sm" asChild>
          <a href="https://github.com/Renovamen/oh-my-cv" target="_blank" rel="noopener noreferrer">
            <Github className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </header>
  )
}
import { useNavigate } from '@tanstack/react-router'
import { storageService } from '@/services/storage'
import { Plus } from 'lucide-react'

export function NewResume() {
  const navigate = useNavigate()

  const newAndSwitch = async () => {
    const data = await storageService.createResume()
    if (data) {
      navigate({ to: `/editor/${data.id}` })
    }
  }

  return (
    <div className="w-56 h-80">
      <button
        className="resume-card group w-[210px] h-[299px] flex items-center justify-center bg-secondary hover:bg-background focus:ring-2 focus:ring-ring focus:outline-none"
        aria-label="Create new resume"
        onClick={newAndSwitch}
      >
        <Plus className="w-20 h-20 text-muted-foreground group-hover:text-primary" />
      </button>
    </div>
  )
}
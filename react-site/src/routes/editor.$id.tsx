import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { cvDataAtom } from '@/atoms'
import { storageService } from '@/services/storage'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { Preview } from '@/components/editor/Preview'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

export const Route = createFileRoute('/editor/$id')({
  component: Editor,
})

function Editor() {
  const { id } = Route.useParams()
  const [cvData, setCvData] = useAtom(cvDataAtom)
  const [isLoading, setIsLoading] = useState(true)

  useState(() => {
    const loadResume = async () => {
      const resume = await storageService.getResume(id)
      if (resume) {
        setCvData(resume.data)
      } else {
        // Initialize with default
        setCvData({
          personal: { name: '', email: '', phone: '' },
          sections: {},
          markdown: '# Your Resume\n\nStart writing...',
          css: '/* Custom CSS */'
        })
      }
      setIsLoading(false)
    }
    loadResume()
  }, [id, setCvData])

  const saveResume = async () => {
    await storageService.updateResume(id, { data: cvData })
    alert('Resume saved!')
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="h-screen flex">
      <div className="w-1/2 border-r">
        <CodeEditor />
      </div>
      <div className="w-1/2 flex flex-col">
        <div className="p-2 border-b">
          <Button onClick={saveResume} className="gap-2">
            <Save className="w-4 h-4" />
            Save Resume
          </Button>
        </div>
        <div className="flex-1">
          <Preview />
        </div>
      </div>
    </div>
  )
}
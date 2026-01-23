import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { cvDataAtom } from '@/atoms'
import { storageService } from '@/services/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/editor/$id')({
  component: Editor,
})

function Editor() {
  const { id } = Route.useParams()
  const [cvData, setCvData] = useAtom(cvDataAtom)
  const [localData, setLocalData] = useState(cvData)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadResume = async () => {
      const resume = await storageService.getResume(id)
      if (resume) {
        setLocalData(resume.data)
        setCvData(resume.data)
      }
      setIsLoading(false)
    }
    loadResume()
  }, [id, setCvData])

  const updatePersonal = (field: string, value: string) => {
    const updated = {
      ...localData,
      personal: { ...localData.personal, [field]: value }
    }
    setLocalData(updated)
    setCvData(updated)
  }

  const saveResume = async () => {
    await storageService.updateResume(id, { data: localData })
    alert('Resume saved!')
  }

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Editor</h1>
        <Button onClick={saveResume}>Save Resume</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={localData.personal.name}
                onChange={(e) => updatePersonal('name', e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={localData.personal.email}
                onChange={(e) => updatePersonal('email', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <Input
                value={localData.personal.phone}
                onChange={(e) => updatePersonal('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">{localData.personal.name || 'Your Name'}</h2>
              <p className="text-muted-foreground">{localData.personal.email}</p>
              <p className="text-muted-foreground">{localData.personal.phone}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
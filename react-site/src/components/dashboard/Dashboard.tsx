import { useEffect, useState } from 'react'
import { storageService } from '@/services/storage'
import type { CVData } from '@/services/storage'
import { NewResume } from './NewResume'
import { FileActions } from './FileActions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'

export function Dashboard() {
  const [resumes, setResumes] = useState<CVData[]>([])
  const navigate = useNavigate()

  const loadResumes = async () => {
    const data = await storageService.listResumes()
    setResumes(data)
  }

  useEffect(() => {
    loadResumes()
  }, [])

  const handleUpdate = () => {
    loadResumes()
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <FileActions onUpdate={handleUpdate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NewResume />

        {resumes.map((resume) => (
          <Card key={resume.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{resume.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Created: {new Date(resume.createdAt).toLocaleDateString()}
              </p>
              <Button
                onClick={() => navigate({ to: `/editor/${resume.id}` })}
                className="w-full"
              >
                Edit Resume
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
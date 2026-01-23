import { createFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { cvDataAtom } from '@/atoms'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  const [cvData, setCvData] = useAtom(cvDataAtom)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Welcome to Oh My CV!</h2>
          <p className="text-muted-foreground">Manage your CVs here.</p>
        </div>
        <Button onClick={() => setCvData({ ...cvData, personal: { ...cvData.personal, name: 'Test' } })}>
          Update Name
        </Button>
        <p>Current name: {cvData.personal.name}</p>
      </div>
    </div>
  )
}
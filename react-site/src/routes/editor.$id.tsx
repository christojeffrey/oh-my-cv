import { createFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { cvDataAtom } from '@/atoms'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/editor/$id')({
  component: Editor,
})

function Editor() {
  const { id } = Route.useParams()
  const [cvData, setCvData] = useAtom(cvDataAtom)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editor for CV {id}</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={cvData.personal.name}
            onChange={(e) => setCvData({
              ...cvData,
              personal: { ...cvData.personal, name: e.target.value }
            })}
            className="w-full p-2 border rounded"
          />
        </div>
        <Button onClick={() => console.log('Save CV')}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}
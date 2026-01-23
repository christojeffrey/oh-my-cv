import { useState } from 'react'
import { storageService } from '@/services/storage'
import { Button } from '@/components/ui/button'
import { Save, Upload } from 'lucide-react'

interface FileActionsProps {
  onUpdate: () => void
}

export function FileActions({ onUpdate }: FileActionsProps) {
  const [isImporting, setIsImporting] = useState(false)

  const exportToJSON = () => {
    storageService.exportToJSON()
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const content = await file.text()
      await storageService.importFromJson(content)
      onUpdate()
    } catch (error) {
      console.error('Import failed:', error)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button onClick={exportToJSON}>
        <Save className="w-4 h-4 mr-1" />
        Save As
      </Button>
      <Button
        variant="outline"
        className="bg-neutral-800 hover:bg-neutral-800/90 focus:ring-neutral-800/40 dark:bg-secondary dark:hover:bg-background dark:focus:ring-secondary/40"
        disabled={isImporting}
      >
        <label className="cursor-pointer flex items-center">
          <Upload className="w-4 h-4 mr-1" />
          {isImporting ? 'Importing...' : 'Import'}
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </Button>
    </div>
  )
}
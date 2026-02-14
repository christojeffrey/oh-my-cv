import { useAtom } from 'jotai'
import { cvDataAtom } from '@/atoms'
import { storageService } from '@/services/storage'
import { toast } from '@/services/toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Save, FileText, Download, Upload } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ToolbarFile() {
  const [cvData, setCvData] = useAtom(cvDataAtom)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [importDialogOpen, setImportDialogOpen] = useState(false)

  useEffect(() => {
    setNewName(cvData.resumeName)
  }, [cvData.resumeName])

  const save = async () => {
    if (!cvData.resumeId) return

    await storageService.updateResume(
      cvData.resumeId,
      {
        name: cvData.resumeName,
        markdown: cvData.markdown,
        css: cvData.css,
        styles: cvData.styles
      }
    )
    toast.save()
  }

  const rename = async () => {
    if (!cvData.resumeId || !newName.trim()) return

    setCvData(prev => ({ ...prev, resumeName: newName.trim() }))

    await storageService.updateResume(
      cvData.resumeId,
      { name: newName.trim() },
      false
    )

    setRenameDialogOpen(false)
  }

  const exportPDF = () => {
    const title = document.title
    document.title = cvData.resumeName.trim().replace(/\s+/g, '_')
    window.print()
    document.title = title
  }

  const exportMd = () => {
    const blob = new Blob([cvData.markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${cvData.resumeName.trim().replace(/\s+/g, '_')}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setCvData(prev => ({ ...prev, markdown: content }))
    }
    reader.readAsText(file)
    setImportDialogOpen(false)
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium mb-2">File</div>
      <Button
        onClick={save}
        className="w-full justify-start gap-2"
        variant="ghost"
      >
        <Save className="w-4 h-4" />
        Save
        <span className="ml-auto text-xs text-muted-foreground tracking-widest">⌘ S</span>
      </Button>

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start gap-2" variant="ghost">
            <FileText className="w-4 h-4" />
            Rename
            <span className="ml-auto text-xs text-muted-foreground tracking-widest">↵</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Resume</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && rename()}
              placeholder="Enter new name"
            />
            <Button onClick={rename} className="w-full">
              Rename
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        onClick={exportPDF}
        className="w-full justify-start gap-2"
        variant="ghost"
      >
        <Download className="w-4 h-4" />
        Export PDF
      </Button>

      <Button
        onClick={exportMd}
        className="w-full justify-start gap-2"
        variant="ghost"
      >
        <FileText className="w-4 h-4" />
        Export Markdown
      </Button>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start gap-2" variant="ghost">
            <Upload className="w-4 h-4" />
            Import Markdown
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import a Markdown file</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".md"
                  onChange={handleImportFile}
                  className="hidden"
                />
                <div className="text-muted-foreground">
                  Click to choose a file
                </div>
              </label>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { useAtom } from 'jotai'
import { cvDataAtom } from '@/atoms'
import { storageService } from '@/services/storage'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

export function ToolbarParagraphSpace() {
  const [cvData, setCvData] = useAtom(cvDataAtom)

  const updateParagraphSpace = async (value: number) => {
    if (!cvData.resumeId) return

    const newStyles = { ...cvData.styles, paragraphSpace: value }
    setCvData(prev => ({ ...prev, styles: newStyles }))

    await storageService.updateResume(
      cvData.resumeId,
      { styles: newStyles },
      false
    )
  }

  return (
    <div className="space-y-2">
      <Label>Paragraph Spacing</Label>
      <Slider
        value={[cvData.styles.paragraphSpace]}
        onValueChange={([value]) => updateParagraphSpace(value)}
        min={0}
        max={20}
        step={1}
        className="mt-2"
      />
      <span className="text-sm text-muted-foreground">{cvData.styles.paragraphSpace}px</span>
    </div>
  )
}

import { useAtom } from 'jotai'
import { cvDataAtom } from '@/atoms'
import { storageService } from '@/services/storage'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

export function ToolbarLineHeight() {
  const [cvData, setCvData] = useAtom(cvDataAtom)

  const updateLineHeight = async (value: number) => {
    if (!cvData.resumeId) return

    const newStyles = { ...cvData.styles, lineHeight: value }
    setCvData(prev => ({ ...prev, styles: newStyles }))

    await storageService.updateResume(
      cvData.resumeId,
      { styles: newStyles },
      false
    )
  }

  return (
    <div className="space-y-2">
      <Label>Line Spacing</Label>
      <Slider
        value={[cvData.styles.lineHeight]}
        onValueChange={([value]) => updateLineHeight(value)}
        min={1}
        max={2}
        step={0.1}
        className="mt-2"
      />
      <span className="text-sm text-muted-foreground">{cvData.styles.lineHeight}</span>
    </div>
  )
}

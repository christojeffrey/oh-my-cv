import { useAtom } from 'jotai'
import { cvDataAtom } from '@/atoms'
import { storageService } from '@/services/storage'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

export function ToolbarMargins() {
  const [cvData, setCvData] = useAtom(cvDataAtom)

  const updateMarginV = async (value: number) => {
    if (!cvData.resumeId) return

    const newStyles = { ...cvData.styles, marginV: value }
    setCvData(prev => ({ ...prev, styles: newStyles }))

    await storageService.updateResume(
      cvData.resumeId,
      { styles: newStyles },
      false
    )
  }

  const updateMarginH = async (value: number) => {
    if (!cvData.resumeId) return

    const newStyles = { ...cvData.styles, marginH: value }
    setCvData(prev => ({ ...prev, styles: newStyles }))

    await storageService.updateResume(
      cvData.resumeId,
      { styles: newStyles },
      false
    )
  }

  return (
    <div className="space-y-4">
      <Label>Margins</Label>
      <div className="space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground">Top & Bottom</Label>
          <Slider
            value={[cvData.styles.marginV]}
            onValueChange={([value]) => updateMarginV(value)}
            min={0}
            max={100}
            step={5}
            className="mt-2"
          />
          <span className="text-sm text-muted-foreground">{cvData.styles.marginV}px</span>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Left & Right</Label>
          <Slider
            value={[cvData.styles.marginH]}
            onValueChange={([value]) => updateMarginH(value)}
            min={0}
            max={100}
            step={5}
            className="mt-2"
          />
          <span className="text-sm text-muted-foreground">{cvData.styles.marginH}px</span>
        </div>
      </div>
    </div>
  )
}

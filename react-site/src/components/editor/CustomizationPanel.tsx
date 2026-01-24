
import { useAtom } from 'jotai'
import { resumeStyleAtom } from '@/atoms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

export function CustomizationPanel() {
  const [style, setStyle] = useAtom(resumeStyleAtom)

  const updateStyle = (key: string, value: any) => {
    setStyle(prev => ({ ...prev, [key]: value }))
  }

  const updateFontCJK = (field: string, value: string) => {
    setStyle(prev => ({
      ...prev,
      fontCJK: { ...prev.fontCJK, [field]: value }
    }))
  }

  const updateFontEN = (field: string, value: string) => {
    setStyle(prev => ({
      ...prev,
      fontEN: { ...prev.fontEN, [field]: value }
    }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Layout & Spacing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marginV">Vertical Margin (px)</Label>
              <Slider
                id="marginV"
                min={0}
                max={100}
                step={5}
                value={[style.marginV || 50]}
                onValueChange={([value]) => updateStyle('marginV', value)}
                className="mt-2"
              />
              <span className="text-sm text-muted-foreground">{style.marginV || 50}px</span>
            </div>
            <div>
              <Label htmlFor="marginH">Horizontal Margin (px)</Label>
              <Slider
                id="marginH"
                min={0}
                max={100}
                step={5}
                value={[style.marginH || 45]}
                onValueChange={([value]) => updateStyle('marginH', value)}
                className="mt-2"
              />
              <span className="text-sm text-muted-foreground">{style.marginH || 45}px</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lineHeight">Line Height</Label>
              <Slider
                id="lineHeight"
                min={1}
                max={2}
                step={0.1}
                value={[style.lineHeight || 1.3]}
                onValueChange={([value]) => updateStyle('lineHeight', value)}
                className="mt-2"
              />
              <span className="text-sm text-muted-foreground">{style.lineHeight || 1.3}</span>
            </div>
            <div>
              <Label htmlFor="paragraphSpace">Paragraph Spacing (px)</Label>
              <Slider
                id="paragraphSpace"
                min={0}
                max={20}
                step={1}
                value={[style.paragraphSpace || 5]}
                onValueChange={([value]) => updateStyle('paragraphSpace', value)}
                className="mt-2"
              />
              <span className="text-sm text-muted-foreground">{style.paragraphSpace || 5}px</span>
            </div>
          </div>

          <div>
            <Label htmlFor="fontSize">Font Size (px)</Label>
              <Slider
                id="fontSize"
                min={10}
                max={20}
                step={1}
                value={[style.fontSize || 15]}
                onValueChange={([value]) => updateStyle('fontSize', value)}
                className="mt-2"
              />
              <span className="text-sm text-muted-foreground">{style.fontSize || 15}px</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="themeColor">Theme Color</Label>
            <Input
              id="themeColor"
              type="color"
              value={style.themeColor || '#377bb5'}
              onChange={(e) => updateStyle('themeColor', e.target.value)}
              className="mt-2 w-20 h-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fonts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>CJK Font</Label>
            <Input
              placeholder="Font name"
              value={style.fontCJK?.name || ''}
              onChange={(e) => updateFontCJK('name', e.target.value)}
              className="mt-1"
            />
              <Input
                placeholder="Font family"
                value={style.fontCJK?.fontFamily || ''}
                onChange={(e) => updateFontCJK('fontFamily', e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>English Font</Label>
            <Input
              placeholder="Font name"
              value={style.fontEN?.name || ''}
              onChange={(e) => updateFontEN('name', e.target.value)}
              className="mt-1"
            />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paper</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="paper">Paper Size</Label>
          <Select value={style.paper || 'A4'} onValueChange={(value) => updateStyle('paper', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A4">A4</SelectItem>
              <SelectItem value="letter">Letter</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  )
}
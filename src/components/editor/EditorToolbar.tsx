import { ToolbarFile } from './toolbar/ToolbarFile'
import { ToolbarPaper } from './toolbar/ToolbarPaper'
import { ToolbarThemeColor } from './toolbar/ToolbarThemeColor'
import { ToolbarFontFamily } from './toolbar/ToolbarFontFamily'
import { ToolbarFontSize } from './toolbar/ToolbarFontSize'
import { ToolbarMargins } from './toolbar/ToolbarMargins'
import { ToolbarParagraphSpace } from './toolbar/ToolbarParagraphSpace'
import { ToolbarLineHeight } from './toolbar/ToolbarLineHeight'
import { ToolbarCorrectCase } from './toolbar/ToolbarCorrectCase'
import { Separator } from '@/components/ui/separator'

export function EditorToolbar() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <ToolbarFile />
      <Separator />
      <ToolbarPaper />
      <Separator />
      <ToolbarThemeColor />
      <Separator />
      <ToolbarFontFamily />
      <Separator />
      <ToolbarFontSize />
      <Separator />
      <ToolbarMargins />
      <Separator />
      <ToolbarParagraphSpace />
      <Separator />
      <ToolbarLineHeight />
      <Separator />
      <ToolbarCorrectCase />
    </div>
  )
}

import { Separator } from "@/components/ui/separator";
import { ToolbarCorrectCase } from "./toolbar/ToolbarCorrectCase";
import { ToolbarFile } from "./toolbar/ToolbarFile";
import { ToolbarFontFamily } from "./toolbar/ToolbarFontFamily";
import { ToolbarFontSize } from "./toolbar/ToolbarFontSize";
import { ToolbarLineHeight } from "./toolbar/ToolbarLineHeight";
import { ToolbarMargins } from "./toolbar/ToolbarMargins";
import { ToolbarPaper } from "./toolbar/ToolbarPaper";
import { ToolbarParagraphSpace } from "./toolbar/ToolbarParagraphSpace";
import { ToolbarThemeColor } from "./toolbar/ToolbarThemeColor";

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
  );
}

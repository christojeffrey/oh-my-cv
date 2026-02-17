import {
  FileText,
  Palette,
  Upload,
} from "lucide-react";
import { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface EditorSidebarProps {
  isOpen: boolean;
}

export function EditorSidebar({ isOpen }: Readonly<EditorSidebarProps>) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  const TOOLS = [
      { id: "file", icon: Upload, component: ToolbarFile },
      { id: "paper", icon: FileText,  component: ToolbarPaper },
      { id: "theme", icon: Palette,  component: ToolbarThemeColor },
      {
        id: "fonts",
        component: ToolbarFontFamily,
      },
      { id: "size",  component: ToolbarFontSize },
      {
        id: "margins",
        component: ToolbarMargins,
      },
      {
        id: "spacing",
        component: ToolbarParagraphSpace,
      },
      {
        id: "lineHeight",
        component: ToolbarLineHeight,
      },
      {
        id: "case",
        component: ToolbarCorrectCase,
      },
    ];

  return (
    <div className={`flex h-full transition-all duration-300 ${isOpen ? "w-72" : "w-0"}`}>
      {isOpen && (
        <>
          <div ref={toolbarRef} className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {TOOLS.map((tool, index) => (
                  <div key={tool.id}>
                    <div id={`toolbar-section-${tool.id}`} className="mb-4">
                      <tool.component />
                    </div>
                    {index < TOOLS.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
}

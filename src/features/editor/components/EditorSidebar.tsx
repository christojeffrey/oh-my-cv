import { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ToolbarCorrectCase } from "./toolbar/ToolbarCorrectCase";
import { ToolbarFontFamily } from "./toolbar/ToolbarFontFamily";
import { ToolbarFontSize } from "./toolbar/ToolbarFontSize";
import { ToolbarLineHeight } from "./toolbar/ToolbarLineHeight";
import { ToolbarMargins } from "./toolbar/ToolbarMargins";
import { ToolbarPaper } from "./toolbar/ToolbarPaper";
import { ToolbarParagraphSpace } from "./toolbar/ToolbarParagraphSpace";
import { ToolbarThemeColor } from "./toolbar/ToolbarThemeColor";

interface EditorSidebarProps {
  isOpen: boolean;
  embedded?: boolean;
}

export function EditorSidebar({ isOpen, embedded = false }: Readonly<EditorSidebarProps>) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  const TOOLS = [
      { id: "paper", component: ToolbarPaper },
      { id: "theme", component: ToolbarThemeColor },
      { id: "fonts", component: ToolbarFontFamily },
      { id: "size", component: ToolbarFontSize },
      { id: "margins", component: ToolbarMargins },
      { id: "spacing", component: ToolbarParagraphSpace },
      { id: "lineHeight", component: ToolbarLineHeight },
      { id: "case", component: ToolbarCorrectCase },
    ];

  // Embedded version (for dialog) - just content
  if (embedded) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {TOOLS.map((tool, index) => (
          <div key={tool.id}>
            <div id={`toolbar-section-${tool.id}`} className="mb-2">
              <tool.component />
            </div>
            {index < TOOLS.length - 1 && <Separator className="bg-border/40" />}
          </div>
        ))}
      </div>
    );
  }

  // Standard sidebar version
  return (
    <div className={`flex h-full transition-all duration-300 ease-out ${isOpen ? "w-64 sm:w-72" : "w-0"}`}>
      {isOpen && (
        <>
          <div ref={toolbarRef} className="flex-1 overflow-hidden border-l border-border/40 bg-background">
            <ScrollArea className="h-full">
              <div className="p-4 sm:p-5 space-y-4 sm:space-y-6">
                {TOOLS.map((tool, index) => (
                  <div key={tool.id}>
                    <div id={`toolbar-section-${tool.id}`} className="mb-2">
                      <tool.component />
                    </div>
                    {index < TOOLS.length - 1 && <Separator className="bg-border/40" />}
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

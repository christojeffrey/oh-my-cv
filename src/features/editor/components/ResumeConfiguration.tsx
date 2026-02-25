import { useRef } from "react";
import { useAtom } from "jotai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { isSettingsOpenAtom } from "@/features/editor/stores/ui-state";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { ToolbarCorrectCase } from "./toolbar/ToolbarCorrectCase";
import { ToolbarFontFamily } from "./toolbar/ToolbarFontFamily";
import { ToolbarFontSize } from "./toolbar/ToolbarFontSize";
import { ToolbarLineHeight } from "./toolbar/ToolbarLineHeight";
import { ToolbarMargins } from "./toolbar/ToolbarMargins";
import { ToolbarPaper } from "./toolbar/ToolbarPaper";
import { ToolbarParagraphSpace } from "./toolbar/ToolbarParagraphSpace";
import { ToolbarThemeColor } from "./toolbar/ToolbarThemeColor";

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

function ConfigurationContent() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-5">
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

export function ResumeConfiguration() {
  const [isOpen, setIsOpen] = useAtom(isSettingsOpenAtom);
  const isMobile = useIsMobile();
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Mobile modal
  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm p-0 gap-0">
          <div className="px-6 py-4 border-b"><DialogTitle>Settings</DialogTitle></div>
          <div className="p-0 max-h-[70vh] overflow-y-auto">
            <ConfigurationContent />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Desktop sidebar
  return (
    <div
      className={`flex h-full ${isOpen ? "w-64 sm:w-72" : "w-0"} shrink-0`}
    >
      {isOpen && (
        <div
          ref={toolbarRef}
          className="flex-1 overflow-hidden border-l border-border/40 bg-background"
        >
          <ScrollArea className="h-full">
            <ConfigurationContent />
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

// Alias for backwards compatibility
export { ResumeConfiguration as EditorSidebar };

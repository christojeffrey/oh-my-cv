import {
  AlignHorizontalSpaceAround,
  ArrowUpDown,
  CheckCircle,
  FileText,
  Palette,
  Type,
  TypeOutline,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
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

export function EditorSidebar({ isOpen }: EditorSidebarProps) {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const TOOLS = [
    { id: "file", icon: Upload, label: t("toolbar.file.title"), component: ToolbarFile },
    { id: "paper", icon: FileText, label: t("toolbar.paper_size"), component: ToolbarPaper },
    { id: "theme", icon: Palette, label: t("toolbar.theme_color"), component: ToolbarThemeColor },
    {
      id: "fonts",
      icon: Type,
      label: t("toolbar.font_family.title"),
      component: ToolbarFontFamily,
    },
    { id: "size", icon: TypeOutline, label: t("toolbar.font_size"), component: ToolbarFontSize },
    {
      id: "margins",
      icon: AlignHorizontalSpaceAround,
      label: t("toolbar.margins.title"),
      component: ToolbarMargins,
    },
    {
      id: "spacing",
      icon: ArrowUpDown,
      label: t("toolbar.paragraph_spacing"),
      component: ToolbarParagraphSpace,
    },
    {
      id: "lineHeight",
      icon: ArrowUpDown,
      label: t("toolbar.line_height"),
      component: ToolbarLineHeight,
    },
    {
      id: "case",
      icon: CheckCircle,
      label: t("toolbar.correct_case.title"),
      component: ToolbarCorrectCase,
    },
  ];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(`toolbar-section-${id}`);
    if (section && toolbarRef.current) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  return (
    <div className={`flex h-full transition-all duration-300 ${isOpen ? "w-72" : "w-0"}`}>
      {/* Icon sidebar (always visible when sidebar is open) */}
      {isOpen && (
        <div className="w-10 border-r bg-muted flex flex-col items-center py-4 gap-2">
          {TOOLS.map((tool) => (
            <Button
              key={tool.id}
              variant="ghost"
              size="icon"
              onClick={() => scrollToSection(tool.id)}
              className={`relative ${activeSection === tool.id ? "bg-accent" : ""}`}
              title={tool.label}
            >
              <tool.icon className="w-5 h-5" />
              {activeSection === tool.id && (
                <div className="absolute right-0 w-0.5 h-6 bg-primary" />
              )}
            </Button>
          ))}
        </div>
      )}

      {/* Main toolbar content */}
      {isOpen && (
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
      )}
    </div>
  );
}

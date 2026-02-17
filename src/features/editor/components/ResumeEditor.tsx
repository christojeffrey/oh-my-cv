import { Eye, Settings, Check, X, XCircle, Code2, FileCode, Download } from "lucide-react";
import { useEffect, useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CodeEditor, EditorSidebar, Preview, ResizeHandle, useEditorData } from "@/features/editor";
import { useAutoSave } from "@/features/editor/hooks/use-auto-save";
import { useAtom } from "jotai";
import { resumeAtom } from "@/features/editor/stores/cv-data";

interface ResumeEditorProps {
  readonly id?: string;
}

export function ResumeEditor({ id }: ResumeEditorProps) {
  const { cvData, isLoading } = useEditorData(id);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"markdown" | "css">("markdown");
  const saveStatus = useAutoSave();
  const [resume, setResume] = useAtom(resumeAtom);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(resume.resumeName || "");

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsToolbarOpen(false);
        setIsPreviewOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setTempName(resume.resumeName || "");
  }, [resume.resumeName]);

  const handleNameSave = () => {
    if (tempName.trim()) {
      setResume((prev) => ({ ...prev, resumeName: tempName.trim() }));
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(resume.resumeName || "");
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  const handleExportPDF = () => {
    globalThis.dispatchEvent(new CustomEvent("resume:print"));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-border border-t-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!cvData.loaded || (!cvData.resumeId && id)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Resume not found</h2>
          <p className="text-sm text-muted-foreground">The resume you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full">
        {/* Editor Header Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border/40 bg-background gap-2 sm:gap-0">
          {/* Left: Name + Status */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-2 w-full max-w-md">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleNameSave}
                  className="flex-1 min-w-0 h-9 px-3 text-sm font-medium bg-background border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-sm flex-shrink-0"
                  onClick={handleNameSave}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-sm flex-shrink-0"
                  onClick={handleNameCancel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-base font-medium text-foreground hover:text-foreground/80 transition-colors truncate px-2 py-1 rounded-sm hover:bg-accent/50 text-left"
                  title="Click to edit name"
                >
                  {resume.resumeName || "Untitled Resume"}
                </button>

                {/* Save Status */}
                <div
                  className={`
                    text-xs font-medium px-2 py-0.5 rounded-sm border select-none pointer-events-none transition-all duration-200 flex-shrink-0
                    ${saveStatus === "saved"
                      ? "bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/30"
                      : saveStatus === "saving"
                      ? "bg-amber-50/80 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/30"
                      : "bg-muted/40 text-muted-foreground border-border/40"
                    }
                  `}
                >
                  {saveStatus === "saved" && "Saved"}
                  {saveStatus === "saving" && "Saving..."}
                  {saveStatus === "unsaved" && "Unsaved"}
                </div>
              </div>
            )}
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Export PDF Button */}
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 gap-2 rounded-sm transition-all duration-200"
              onClick={handleExportPDF}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>

            {/* Editor Mode Toggle - Only visible when editing */}
            <div className="flex items-center border border-border/40 rounded-sm overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 sm:px-3 text-xs gap-1.5 rounded-none border-0 transition-all duration-200 ${editorMode === "markdown" ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setEditorMode("markdown")}
              >
                <FileCode className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Markdown</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 sm:px-3 text-xs gap-1.5 rounded-none border-0 transition-all duration-200 ${editorMode === "css" ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setEditorMode("css")}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">CSS</span>
              </Button>
            </div>

            {/* Preview Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`
                h-9 px-3 gap-2 rounded-sm transition-all duration-200
                ${isPreviewOpen || mobilePreviewOpen
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
              onClick={() => {
                if (isMobile) {
                  setMobilePreviewOpen(true);
                } else {
                  setIsPreviewOpen(!isPreviewOpen);
                }
              }}
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
            </Button>

            {/* Settings Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`
                h-9 px-3 gap-2 rounded-sm transition-all duration-200
                ${isToolbarOpen || mobileSettingsOpen
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
              onClick={() => {
                if (isMobile) {
                  setMobileSettingsOpen(true);
                } else {
                  setIsToolbarOpen(!isToolbarOpen);
                }
              }}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Code Editor - Always visible */}
          <div className={`${isPreviewOpen ? 'flex-1' : 'flex-auto w-full'} border-r border-border/40 flex flex-col relative min-w-0`}>
            {!isMobile && <ResizeHandle direction="horizontal" />}
            <CodeEditor mode={editorMode} />
          </div>

          {/* Desktop Preview Sidebar - Visible when open */}
          {!isMobile && isPreviewOpen && (
            <div className="flex-1 flex-col flex-1 min-w-0">
              <Preview />
            </div>
          )}

          {/* Desktop Settings Sidebar */}
          {!isMobile && <EditorSidebar isOpen={isToolbarOpen} />}
        </div>

        {/* Mobile Preview Dialog */}
        {isMobile && (
          <Dialog open={mobilePreviewOpen} onOpenChange={setMobilePreviewOpen}>
            <DialogContent className="w-full h-full max-w-none rounded-none border-0 p-0 gap-0 [&>button]:hidden">
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-full bg-background/90 backdrop-elevated border border-border/60 shadow-elevated"
                  onClick={() => setMobilePreviewOpen(false)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
              <Preview fullscreen={true} />
            </DialogContent>
          </Dialog>
        )}

        {/* Mobile Settings Dialog */}
        {isMobile && (
          <Dialog open={mobileSettingsOpen} onOpenChange={setMobileSettingsOpen}>
            <DialogContent className="w-full max-w-sm rounded-sm border border-border/60 shadow-elevated p-0 gap-0">
              <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/40">
                <DialogTitle className="text-lg font-medium">Settings</DialogTitle>
              </DialogHeader>
              <div className="px-6 py-4 max-h-[60vh] overflow-auto">
                <EditorSidebar isOpen={true} embedded={true} />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Hidden Print Preview - Always mounted for export functionality, never visible */}
      <div style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }} aria-hidden="true">
        <Preview />
      </div>
    </ErrorBoundary>
  );
}

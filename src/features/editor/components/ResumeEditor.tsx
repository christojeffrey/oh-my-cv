import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { 
  Eye, Settings, FileCode, Download, Code2, BookCopy, 
  Trash2, Loader2, MoreVertical, Check, X 
} from "lucide-react";

// Components
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Features & Stores
import { CodeEditor, EditorSidebar, Preview, ResizeHandle, useEditorData } from "@/features/editor";
import { useAutoSave } from "@/features/editor/hooks/use-auto-save";
import { resumeAtom } from "@/features/editor/stores/cv-data";
import { copyLLMGuideToClipboard } from "@/constants/llm-guide";
import { useResumes } from "@/features/dashboard";

// --- Sub-Components ---

/**
 * Handles the logic for responsive checks.
 */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

/**
 * The Top Bar. Handles Renaming, Status, and Action Buttons.
 */
function EditorHeader({ 
  resumeName, 
  onRename, 
  saveStatus, 
  editorMode, 
  setEditorMode, 
  onPreview, 
  onSettings,
  onExport,
  onCopyGuide,
  onDelete,
  isPreviewOpen,
  isSettingsOpen,
  guideCopied
}: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(resumeName || "");

  useEffect(() => setTempName(resumeName || ""), [resumeName]);

  const saveName = () => {
    if (tempName.trim()) onRename(tempName.trim());
    setIsEditing(false);
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-background h-14">
      {/* Left: Name & Status */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {isEditing ? (
          <div className="flex items-center gap-1 max-w-[200px]">
            <input
              className="flex-1 h-9 px-3 text-sm bg-background border rounded-sm focus:outline-none focus:ring-1 focus:ring-ring"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === 'Enter' && saveName()}
              autoFocus
            />
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={saveName}><Check className="w-4 h-4" /></Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsEditing(false)}><X className="w-4 h-4" /></Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={() => setIsEditing(true)} 
              className="font-medium hover:bg-accent/50 px-2 py-1 rounded truncate max-w-[150px] sm:max-w-md text-left"
            >
              {resumeName || "Untitled Resume"}
            </button>
            <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border ${
              saveStatus === "saved" ? "bg-emerald-500/10 text-emerald-600 border-emerald-200" :
              saveStatus === "saving" ? "bg-amber-500/10 text-amber-600 border-amber-200" :
              "bg-muted text-muted-foreground"
            }`}>
              {saveStatus === "saved" ? "Saved" : saveStatus === "saving" ? "Saving" : "Unsaved"}
            </span>
          </div>
        )}
      </div>

      {/* Right: Toolbar */}
      <div className="flex items-center gap-1">
        {/* Mode Toggle */}
        <div className="flex bg-muted/30 rounded-sm p-0.5 border border-border/40">
          <Button 
            variant="ghost" size="sm" 
            className={`h-7 px-2 text-xs ${editorMode === "markdown" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            onClick={() => setEditorMode("markdown")}
          >
            <FileCode className="w-3.5 h-3.5 mr-1" /> <span className="hidden sm:inline">MD</span>
          </Button>
          <Button 
            variant="ghost" size="sm" 
            className={`h-7 px-2 text-xs ${editorMode === "css" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            onClick={() => setEditorMode("css")}
          >
            <Code2 className="w-3.5 h-3.5 mr-1" /> <span className="hidden sm:inline">CSS</span>
          </Button>
        </div>

        <div className="h-4 w-px bg-border/40 mx-2" />

        <Button 
          variant={isPreviewOpen ? "secondary" : "ghost"} size="sm" className="h-8 w-8 sm:w-auto px-0 sm:px-3"
          onClick={onPreview} title="Preview"
        >
          <Eye className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Preview</span>
        </Button>
        
        <Button 
          variant={isSettingsOpen ? "secondary" : "ghost"} size="sm" className="h-8 w-8 sm:w-auto px-0 sm:px-3"
          onClick={onSettings} title="Settings"
        >
          <Settings className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Settings</span>
        </Button>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-1">
           <Button variant="ghost" size="sm" className="h-8" onClick={onCopyGuide}>
            {guideCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <BookCopy className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-8" onClick={onExport}><Download className="w-4 h-4" /></Button>
          <div className="h-4 w-px bg-border/40 mx-1" />
          <Button variant="ghost" size="sm" className="h-8 text-destructive hover:bg-destructive/10" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className="md:hidden ml-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onCopyGuide}>
                <BookCopy className="w-4 h-4 mr-2" /> Copy LLM Guide
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExport}>
                <Download className="w-4 h-4 mr-2" /> Export PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" /> Delete Resume
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

// --- Main Component ---

export function ResumeEditor({ id }: { readonly id?: string }) {
  const navigate = useNavigate();
  const { deleteResume } = useResumes();
  const { cvData, isLoading } = useEditorData(id);
  const saveStatus = useAutoSave();
  const [resume, setResume] = useAtom(resumeAtom);
  
  // UI State
  const isMobile = useIsMobile();
  const [editorMode, setEditorMode] = useState<"markdown" | "css">("markdown");
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [guideCopied, setGuideCopied] = useState(false);

  // Sync mobile state
  useEffect(() => {
    if (isMobile) { setShowPreview(false); setShowSettings(false); }
  }, [isMobile]);

  // Actions
  const handleRename = (name: string) => setResume(prev => ({ ...prev, resumeName: name }));
  
  const handleExport = () => globalThis.dispatchEvent(new CustomEvent("resume:print"));
  
  const handleCopyGuide = async () => {
    if (await copyLLMGuideToClipboard()) {
      setGuideCopied(true);
      setTimeout(() => setGuideCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteResume(id);
      setShowDeleteDialog(false);
      navigate({ to: "/" });
    } catch (e) {
      console.error(e);
      setIsDeleting(false);
    }
  };

  // Loading / Error States
  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!cvData.loaded || (!cvData.resumeId && id)) return <div className="h-screen flex items-center justify-center">Resume not found</div>;

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full bg-background">
        <EditorHeader 
          resumeName={resume.resumeName}
          onRename={handleRename}
          saveStatus={saveStatus}
          editorMode={editorMode}
          setEditorMode={setEditorMode}
          isPreviewOpen={showPreview}
          isSettingsOpen={showSettings}
          guideCopied={guideCopied}
          onPreview={() => setShowPreview(p => !p)}
          onSettings={() => setShowSettings(p => !p)}
          onExport={handleExport}
          onCopyGuide={handleCopyGuide}
          onDelete={() => setShowDeleteDialog(true)}
        />

        <div className="flex flex-1 overflow-hidden relative">
          {/* Code Editor */}
          <div className={`h-full flex flex-col relative border-r border-border/40 ${showPreview && !isMobile ? 'w-1/2' : 'w-full'}`}>
            {!isMobile && <ResizeHandle direction="horizontal" />}
            <CodeEditor mode={editorMode} />
          </div>

          {/* Desktop Preview */}
          {!isMobile && showPreview && (
            <div className="w-1/2 h-full">
              <Preview />
            </div>
          )}

          {/* Settings Sidebar (Desktop Overlay or Side) */}
          {!isMobile && <EditorSidebar isOpen={showSettings} />}
        </div>

        {/* Mobile Modals */}
        {isMobile && (
          <>
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogContent className="w-full h-full max-w-none p-0 border-0 bg-background">
                <Button 
                  size="icon" variant="ghost" className="absolute top-2 right-2 z-50 bg-background/50 backdrop-blur" 
                  onClick={() => setShowPreview(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
                <Preview fullscreen />
              </DialogContent>
            </Dialog>

            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogContent className="max-w-sm p-0 gap-0">
                 <div className="px-6 py-4 border-b"><DialogTitle>Settings</DialogTitle></div>
                 <div className="p-0 max-h-[70vh] overflow-y-auto"><EditorSidebar isOpen={true} embedded /></div>
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* Delete Confirmation */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Resume?</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? <Loader2 className="animate-spin w-4 h-4" /> : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Hidden Print Preview (Preserved for Export Logic) */}
        <div className="fixed -left-[9999px] invisible" aria-hidden="true"><Preview /></div>
      </div>
    </ErrorBoundary>
  );
}

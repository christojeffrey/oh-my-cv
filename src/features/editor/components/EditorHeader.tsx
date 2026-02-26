import { useAtom } from "jotai";
import {
  BookCopy,
  Check,
  Code2,
  Download,
  Eye,
  FileCode,
  Lock,
  MoreVertical,
  Settings,
  Trash2,
  Unlock,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { editModeAtom } from "@/atoms";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { copyLLMGuideToClipboard } from "@/constants/llm-guide";
import { useAutoSave } from "@/features/editor/hooks/use-auto-save";
import {
  editorModeAtom,
  isDeleteDialogOpenAtom,
  isPreviewOpenAtom,
  isSettingsOpenAtom,
} from "@/features/editor/stores/ui-state";
import { printResume } from "../services/print-service";
import { resumeAtom } from "../stores/resume-data";
import { CopyGuideButton } from "./CopyGuideButton";

export function EditorHeader() {
  const [resume, setResume] = useAtom(resumeAtom);
  const [editorMode, setEditorMode] = useAtom(editorModeAtom);
  const [isPreviewOpen, setIsPreviewOpen] = useAtom(isPreviewOpenAtom);
  const [isSettingsOpen, setIsSettingsOpen] = useAtom(isSettingsOpenAtom);
  const [isEditingEnabled, setIsEditingEnabled] = useAtom(editModeAtom);
  const [, setIsDeleteDialogOpen] = useAtom(isDeleteDialogOpenAtom);

  const saveStatus = useAutoSave();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(resume.resumeName || "");

  useEffect(() => setTempName(resume.resumeName || ""), [resume.resumeName]);

  const handleCopyGuide = async () => {
    await copyLLMGuideToClipboard();
  };

  const saveName = () => {
    if (tempName.trim()) setResume((prev) => ({ ...prev, resumeName: tempName.trim() }));
    setIsEditing(false);
  };

  const handleExport = () => printResume(resume, resume.resumeName || "Resume");

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
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              autoFocus
            />
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={saveName}>
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setIsEditing(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsEditing(true)}
              className="font-medium hover:bg-accent/50 px-2 py-1 rounded truncate max-w-[150px] sm:max-w-md text-left"
            >
              {resume.resumeName || "Untitled Resume"}
            </button>
            <span
              className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border ${
                saveStatus === "saved"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                  : saveStatus === "saving"
                    ? "bg-amber-500/10 text-amber-600 border-amber-200"
                    : "bg-muted text-muted-foreground"
              }`}
            >
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
            variant="ghost"
            size="sm"
            className={`h-7 px-2 text-xs ${editorMode === "markdown" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            onClick={() => setEditorMode("markdown")}
          >
            <FileCode className="w-3.5 h-3.5 mr-1" /> <span className="hidden sm:inline">MD</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-2 text-xs ${editorMode === "css" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            onClick={() => setEditorMode("css")}
          >
            <Code2 className="w-3.5 h-3.5 mr-1" /> <span className="hidden sm:inline">CSS</span>
          </Button>
        </div>

        <Button
          variant={isEditingEnabled ? "secondary" : "ghost"}
          size="sm"
          className="h-7 px-2"
          onClick={() => setIsEditingEnabled(!isEditingEnabled)}
          title={isEditingEnabled ? "Disable editing" : "Enable editing"}
        >
          {isEditingEnabled ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
        </Button>

        <div className="h-4 w-px bg-border/40 mx-2" />

        <Button
          variant={isPreviewOpen ? "secondary" : "ghost"}
          size="sm"
          className="h-8 w-8 sm:w-auto px-0 sm:px-3"
          onClick={() => setIsPreviewOpen((p) => !p)}
          title="Preview"
        >
          <Eye className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Preview</span>
        </Button>

        <Button
          variant={isSettingsOpen ? "secondary" : "ghost"}
          size="sm"
          className="h-8 w-8 sm:w-auto px-0 sm:px-3"
          onClick={() => setIsSettingsOpen((p) => !p)}
          title="Settings"
        >
          <Settings className="w-4 h-4 sm:mr-2" />{" "}
          <span className="hidden sm:inline">Settings</span>
        </Button>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-1">
          <CopyGuideButton />
          <Button variant="ghost" size="sm" className="h-8" onClick={handleExport}>
            <Download className="w-4 h-4" />
          </Button>
          <div className="h-4 w-px bg-border/40 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-destructive hover:bg-destructive/10"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className="md:hidden ml-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopyGuide}>
                <BookCopy className="w-4 h-4 mr-2" /> Copy LLM Guide
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" /> Export PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Resume
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

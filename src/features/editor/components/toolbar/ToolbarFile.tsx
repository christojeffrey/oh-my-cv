import { useAtom } from "jotai";
import { Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { resumeAtom } from "@/features/editor/stores/cv-data";
import { useResumes } from "@/features/dashboard/hooks/use-resumes";
import type { Resume } from "@/types/resume";

export function ToolbarFile() {
  const { updateResume } = useResumes();
  const [cvData, setCvData] = useAtom(resumeAtom);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    setNewName(cvData.resumeName);
  }, [cvData.resumeName]);

  const handleRename = async () => {
    if (!cvData.resumeId || !newName.trim()) return;

    // Update local state immediately
    const trimmedName = newName.trim();
    setCvData((prev: Resume) => ({ ...prev, resumeName: trimmedName }));

    // Save immediately to server (not waiting for auto-save)
    await updateResume(cvData.resumeId, {
      name: trimmedName,
      markdown: cvData.markdown,
      customCss: cvData.customCss,
      configuration: cvData.configuration,
    });
    setRenameDialogOpen(false);
  };

  const handleExportPDF = () => {
    globalThis.dispatchEvent(new CustomEvent("resume:print"));
  };

  return (
    <div className="space-y-2">
      <Label>File</Label>

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start gap-2" variant="ghost" data-umami-event="open-rename-dialog">
            <FileText className="w-4 h-4" />
            Rename
            <span className="ml-auto text-xs text-muted-foreground tracking-widest">↵</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Resume</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              placeholder="Enter new name"
            />
            <Button onClick={handleRename} className="w-full" data-umami-event="rename-resume">
              Rename
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button onClick={handleExportPDF} className="w-full justify-start gap-2" variant="ghost" data-umami-event="export-pdf-file-menu">
        <Download className="w-4 h-4" />
        Export PDF
      </Button>
    </div>
  );
}


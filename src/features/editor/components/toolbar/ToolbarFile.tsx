import { useAtom } from "jotai";
import { Download, FileText, Save, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { toast } from "@/services/toast";
import type { Resume } from "@/types/resume";

export function ToolbarFile() {
  const { updateResume } = useResumes();
  const [cvData, setCvData] = useAtom(resumeAtom);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  useEffect(() => {
    setNewName(cvData.resumeName);
  }, [cvData.resumeName]);

  const handleSave = async () => {
    if (!cvData.resumeId) return;

    await updateResume(cvData.resumeId, {
      name: cvData.resumeName,
      markdown: cvData.markdown,
      customCss: cvData.customCss,
      configuration: cvData.configuration,
    });
    toast.save();
  };

  const handleRename = async () => {
    if (!cvData.resumeId || !newName.trim()) return;

    setCvData((prev: Resume) => ({ ...prev, resumeName: newName.trim() }));
    await updateResume(cvData.resumeId, { name: newName.trim() });
    setRenameDialogOpen(false);
  };

  const getFileName = () => cvData.resumeName.trim().replaceAll(/\s+/g, "_");

  const handleExportPDF = () => {
    globalThis.dispatchEvent(new CustomEvent("resume:print"));
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([cvData.markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${getFileName()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const content = await file.text();
    setCvData((prev: Resume) => ({ ...prev, markdown: content }));
    setImportDialogOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium mb-2">File</div>
      <Button onClick={handleSave} className="w-full justify-start gap-2" variant="ghost">
        <Save className="w-4 h-4" />
        Save
        <span className="ml-auto text-xs text-muted-foreground tracking-widest">⌘ S</span>
      </Button>

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start gap-2" variant="ghost">
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
            <Button onClick={handleRename} className="w-full">
              Rename
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button onClick={handleExportPDF} className="w-full justify-start gap-2" variant="ghost">
        <Download className="w-4 h-4" />
        Export PDF
      </Button>

      <Button onClick={handleExportMarkdown} className="w-full justify-start gap-2" variant="ghost">
        <FileText className="w-4 h-4" />
        Export Markdown
      </Button>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start gap-2" variant="ghost">
            <Upload className="w-4 h-4" />
            Import Markdown
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import a Markdown file</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <label className="cursor-pointer">
                <input type="file" accept=".md" onChange={handleImportFile} className="hidden" />
                <div className="text-muted-foreground">Click to choose a file</div>
              </label>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

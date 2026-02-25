import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAtom } from "jotai";

import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  CodeEditor,
  EditorHeader,
  Preview,
  useEditorData,
  ResumeConfiguration,
} from "@/features/editor";
import { useResumes } from "@/features/dashboard";
import { editModeAtom } from "@/atoms";

export function ResumeEditor({ id }: { readonly id?: string }) {
  const navigate = useNavigate();
  const { deleteResume } = useResumes();
  const { cvData, isLoading } = useEditorData(id);
  const [isEditingEnabled] = useAtom(editModeAtom);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!cvData.loaded || (!cvData.resumeId && id)) return <div className="h-screen flex items-center justify-center">Resume not found</div>;

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full bg-background">
        <EditorHeader
          onDelete={() => setShowDeleteDialog(true)}
        />

        <div className="flex flex-1 min-w-0 overflow-hidden">
          <div className="flex-1 min-w-0 h-full flex flex-col border-r border-border/40">
            <CodeEditor editingEnabled={isEditingEnabled} />
          </div>

          <Preview />

          <ResumeConfiguration />
        </div>

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
      </div>
    </ErrorBoundary>
  );
}

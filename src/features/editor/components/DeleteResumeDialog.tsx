import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteResume } from "@/hooks/use-delete-resume";
import { isDeleteDialogOpenAtom } from "../stores/ui-state";

interface DeleteResumeDialogProps {
  resumeId?: string;
}

export function DeleteResumeDialog({ resumeId }: DeleteResumeDialogProps) {
  const navigate = useNavigate();
  const { deleteResume } = useDeleteResume();
  const [isOpen, setIsOpen] = useAtom(isDeleteDialogOpenAtom);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!resumeId) return;
    setIsDeleting(true);
    try {
      await deleteResume(resumeId);
      setIsOpen(false);
      navigate({ to: "/" });
    } catch (e) {
      console.error("Failed to delete resume:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Resume?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

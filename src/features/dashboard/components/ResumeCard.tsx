import { useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useEffect, useState } from "react";
import { useResumePagination } from "@/hooks/use-resume-pagination";
import type { DbResume } from "@/types/resume";
import { markdownService } from "@/utils/markdown";
import { FileText, MoreVertical, Copy, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResumes } from "../hooks/use-resumes";
import { Loader2 } from "lucide-react";

const CARD_ONLY_CSS = `[data-part="page"]:not(:first-child) { display: none; }`;

interface ResumeCardProps {
  readonly resume: DbResume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const navigate = useNavigate();
  const [cardWidth, setCardWidth] = useState(210);
  const containerRef = useRef<HTMLDivElement>(null);
  const { duplicateResume, deleteResume, updateResume } = useResumes();
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(resume.name);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  const html = useMemo(() => markdownService.renderResume(resume.markdown || ""), [resume.markdown]);

  const { hostRef, dims } = useResumePagination(
    resume.configuration,
    resume.customCss || "",
    html,
    CARD_ONLY_CSS
  );

  // Measure container width for responsive scaling
  useEffect(() => {
    const measureWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth - 24; // padding
        setCardWidth(Math.max(180, Math.min(280, width)));
      }
    };

    measureWidth();

    const resizeObserver = new ResizeObserver(measureWidth);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Sync rename value when resume name changes
  useEffect(() => {
    setRenameValue(resume.name);
  }, [resume.name]);

  const handleDuplicate = async () => {
    setIsMobileMenuOpen(false);
    setIsDesktopMenuOpen(false);
    await duplicateResume(resume.id);
  };

  const handleRename = async () => {
    if (renameValue.trim() && renameValue !== resume.name) {
      await updateResume(resume.id, { name: renameValue.trim() });
    }
    setIsRenameOpen(false);
  };

  const handleRenameClick = () => {
    setIsMobileMenuOpen(false);
    setIsDesktopMenuOpen(false);
    setIsRenameOpen(true);
  };

  const handleDelete = async () => {
    setIsMobileMenuOpen(false);
    setIsDesktopMenuOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteResume(resume.id);
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Failed to delete resume:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setRenameValue(resume.name);
      setIsRenameOpen(false);
    }
  };

  const scale = cardWidth / dims.widthPx;

  return (
    <>
      <div className="w-full flex flex-col items-center">
        {/* Mobile: List item - always shown, styled with CSS */}
        <div className="sm:hidden w-full p-4 border border-border/40 rounded-sm bg-background hover:bg-accent/50 transition-colors duration-200">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate({ to: `/editor/${resume.id}` })}
              className="p-2 rounded-sm bg-muted/40 flex-shrink-0 hover:bg-muted/60 transition-colors"
            >
              <FileText className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="flex-1 min-w-0">
              <button
                onClick={() => navigate({ to: `/editor/${resume.id}` })}
                className="text-left w-full"
              >
                <p className="text-sm font-medium truncate text-foreground">{resume.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(resume.created_at || Date.now()).toLocaleDateString()}
                </p>
              </button>
            </div>
            <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex-shrink-0 self-center p-2 rounded-sm bg-muted/40 border border-border/40 hover:bg-muted/60 active:bg-muted/80 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Resume options"
                >
                  <MoreVertical className="h-4 w-4 text-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="h-4 w-4" />
                  <span>Duplicate</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRenameClick}>
                  <Pencil className="h-4 w-4" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

      {/* Desktop: Preview card - shown with CSS, not JS */}
      <div className="hidden sm:flex w-full flex-col items-center group">
        <div
          ref={containerRef}
          className="w-full relative flex items-center justify-center p-3"
        >
          <div
            className="border border-border/40 rounded-sm overflow-hidden bg-white shadow-subtle hover:shadow-elevated transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate({ to: `/editor/${resume.id}` })}
            style={{ width: `${cardWidth}px`, height: `${cardWidth * 297 / 210}px` }}
          >
            <div
              className="origin-top-left"
              style={{
                width: `${dims.widthPx}px`,
                height: `${dims.heightPx}px`,
                transform: `scale(${scale})`,
              }}
            >
              <div ref={hostRef} />
            </div>
          </div>
          {/* Actions menu - shown on hover */}
          <DropdownMenu open={isDesktopMenuOpen} onOpenChange={setIsDesktopMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="absolute top-5 right-5 p-1.5 rounded-sm bg-background/90 backdrop-blur-sm border border-border/60 shadow-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-accent"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="h-4 w-4" />
                <span>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRenameClick}>
                <Pencil className="h-4 w-4" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-3 text-center w-full px-2">
          <p className="text-sm font-medium truncate text-foreground">{resume.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(resume.created_at || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>

    {/* Rename Dialog */}
    <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Resume</DialogTitle>
          <DialogDescription>
            Enter a new name for this resume.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Resume name"
          autoFocus
        />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setRenameValue(resume.name);
              setIsRenameOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleRename} disabled={!renameValue.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Delete Confirmation Dialog */}
    <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Resume</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{resume.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteConfirmOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

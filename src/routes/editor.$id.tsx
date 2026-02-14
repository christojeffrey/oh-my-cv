import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { cvDataAtom } from "@/atoms/index.ts";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary.tsx";
import { CodeEditor } from "@/components/editor/CodeEditor.tsx";
import { EditorSidebar } from "@/components/editor/EditorSidebar.tsx";
import { Preview } from "@/components/editor/Preview.tsx";
import { ResizeHandle } from "@/components/editor/ResizeHandle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { storageService } from "@/services/storage.ts";
import { DEFAULT_STYLES } from "@/constants";

export const Route = createFileRoute("/editor/$id")({
  component: Editor,
});

function Editor() {
  const { id } = Route.useParams();
  const [cvData, setCvData] = useAtom(cvDataAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [isToolbarOpen, setIsToolbarOpen] = useState(true);

  useEffect(() => {
    // Check window width on mount to handle mobile responsiveness
    if (window.innerWidth < 1024) {
      setIsToolbarOpen(false);
    }

    const loadResume = async () => {
      try {
        const resume = await storageService.getResume(Number.parseInt(id));
        if (resume) {
          setCvData({
            markdown: resume.markdown,
            css: resume.css,
            resumeId: resume.id,
            resumeName: resume.name,
            styles: resume.styles || DEFAULT_STYLES,
            loaded: true,
          });
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading resume:", error);
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    loadResume();
  }, [id, setCvData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (!cvData.loaded || !cvData.resumeId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Resume not found</h2>
          <p className="text-muted-foreground">The resume you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen relative">
        <div className="absolute top-3 right-4 z-50 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 px-0 bg-background/50 backdrop-blur border shadow-sm hover:bg-background"
            onClick={() => setIsToolbarOpen(!isToolbarOpen)}
            title={isToolbarOpen ? "Close Toolbar" : "Open Toolbar"}
          >
            {isToolbarOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden pt-[var(--header-height)]">
          {/* Left panel - Code Editor */}
          <div className="flex-1 border-r flex flex-col relative min-w-0">
            <ResizeHandle direction="horizontal" />
            <CodeEditor />
          </div>

          {/* Right panel - Preview */}
          <div className="flex-1 flex-col flex-1 min-w-0">
            <Preview />
          </div>

          {/* Right toolbar - EditorSidebar */}
          <EditorSidebar isOpen={isToolbarOpen} />
        </div>
      </div>
    </ErrorBoundary>
  );
}

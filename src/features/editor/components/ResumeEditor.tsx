import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useEffect, useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CodeEditor, EditorSidebar, Preview, ResizeHandle, useEditorData } from "@/features/editor";

interface ResumeEditorProps {
  readonly id?: string;
}

export function ResumeEditor({ id }: ResumeEditorProps) {
  const { cvData, isLoading } = useEditorData(id);
  const [isToolbarOpen, setIsToolbarOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsToolbarOpen(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (!cvData.loaded || (!cvData.resumeId && id)) {
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
      <div className="flex flex-col h-full relative">
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
          <div className="flex-1 border-r flex flex-col relative min-w-0">
            <ResizeHandle direction="horizontal" />
            <CodeEditor />
          </div>

          <div className="flex-1 flex-col flex-1 min-w-0">
            <Preview />
          </div>

          <EditorSidebar isOpen={isToolbarOpen} />
        </div>
      </div>
    </ErrorBoundary>
  );
}

import { Loader2 } from "lucide-react";

import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import {
  CodeEditor,
  DeleteResumeDialog,
  EditorHeader,
  Preview,
  ResumeConfiguration,
  useEditorData,
} from "@/features/editor";

export function ResumeEditor({ id }: { readonly id?: string }) {
  const { editorData, isLoading } = useEditorData(id);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!editorData.loaded || (!editorData.resumeId && id))
    return <div className="h-screen flex items-center justify-center">Resume not found</div>;

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full bg-background">
        <EditorHeader />

        <div className="flex flex-1 min-w-0 overflow-hidden">
          <div className="flex-1 min-w-0 h-full flex flex-col border-r border-border/40">
            <CodeEditor />
          </div>
          <Preview />
          <ResumeConfiguration />
        </div>

        <DeleteResumeDialog resumeId={id} />
      </div>
    </ErrorBoundary>
  );
}

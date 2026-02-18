import { createFileRoute, useBlocker } from "@tanstack/react-router";
import { ResumeEditor } from "@/features/editor";
import { hasUnsavedChangesSync } from "@/features/editor/hooks/use-auto-save";

export const Route = createFileRoute("/editor/$id")({
  component: Editor,
});

function Editor() {
  const { id } = Route.useParams();

  // Block navigation when there are unsaved changes
  useBlocker({
    shouldBlockFn: () => {
      // Block navigation if there are unsaved changes
      if (!hasUnsavedChangesSync()) return false;

      // Show confirmation dialog
      const shouldLeave = confirm('You have unsaved changes. Are you sure you want to leave?');
      return !shouldLeave; // Block if they don't want to leave
    },
    // Also block browser close/refresh via beforeunload
    enableBeforeUnload: () => hasUnsavedChangesSync(),
  });

  return <ResumeEditor id={id} />;
}

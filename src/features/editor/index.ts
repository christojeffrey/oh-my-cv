// Editor feature public API

// Components
export { CodeEditor } from "./components/CodeEditor";
export { CopyGuideButton } from "./components/CopyGuideButton";
export { CustomizationPanel } from "./components/CustomizationPanel";
export { DeleteResumeDialog } from "./components/DeleteResumeDialog";
export { EditorHeader } from "./components/EditorHeader";
export { Preview } from "./components/Preview";
export { ResizeHandle } from "./components/ResizeHandle";
export { EditorSidebar, ResumeConfiguration } from "./components/ResumeConfiguration"; // Alias for backwards compatibility
export { ResumeEditor } from "./components/ResumeEditor";
// Hooks
export { useEditorData } from "./hooks/use-editor-data";
export { usePreviewZoom } from "./hooks/use-preview-zoom";
export { useResumePagination } from "./hooks/use-resume-pagination";
export { useResumeStyles } from "./hooks/use-resume-styles";
// Services
export { printResume } from "./services/print-service";
// Stores
export { resumeAtom } from "./stores/resume-data";
export {
  editorModeAtom,
  isDeleteDialogOpenAtom,
  isPreviewOpenAtom,
  isSettingsOpenAtom,
} from "./stores/ui-state";

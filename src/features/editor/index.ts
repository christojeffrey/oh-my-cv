// Editor feature public API

// Components
export { CodeEditor } from "./components/CodeEditor";
export { CopyGuideButton } from "./components/CopyGuideButton";
export { CustomizationPanel } from "./components/CustomizationPanel";
export { DeleteResumeDialog } from "./components/DeleteResumeDialog";
export { EditorHeader } from "./components/EditorHeader";
export { EditorSidebar } from "./components/ResumeConfiguration"; // Alias for backwards compatibility
export { Preview } from "./components/Preview";
export { ResizeHandle } from "./components/ResizeHandle";
export { ResumeConfiguration } from "./components/ResumeConfiguration";
export { ResumeEditor } from "./components/ResumeEditor";
// Hooks
export { useEditorData } from "./hooks/use-editor-data";
export { usePreviewZoom } from "./hooks/use-preview-zoom";
export { useResumeStyles } from "./hooks/use-resume-styles";
export { useResumePagination } from "./hooks/use-resume-pagination";
// Services
export { printResume } from "./services/print-service";
// Stores
export { resumeAtom } from "./stores/cv-data";
export { isSettingsOpenAtom, isPreviewOpenAtom, editorModeAtom, isDeleteDialogOpenAtom } from "./stores/ui-state";

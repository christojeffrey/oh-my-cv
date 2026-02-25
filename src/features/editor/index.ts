// Editor feature public API

// Components
export { CodeEditor } from "./components/CodeEditor";
export { CopyGuideButton } from "./components/CopyGuideButton";
export { CustomizationPanel } from "./components/CustomizationPanel";
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
// Stores
export { resumeAtom } from "./stores/cv-data";
export { isSettingsOpenAtom, isPreviewOpenAtom, editorModeAtom } from "./stores/ui-state";

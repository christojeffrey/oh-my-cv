import Editor from "@monaco-editor/react";
import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import { resumeAtom } from "@/features/editor/stores/cv-data";
import type { Resume } from "@/types/resume";

const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 14,
  padding: { top: 16 },
  scrollBeyondLastLine: false,
  renderLineHighlight: "all",
  cursorBlinking: "smooth",
  fontFamily: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
  fontLigatures: true,
};

interface CodeEditorProps {
  mode?: "markdown" | "css";
  onModeChange?: (mode: "markdown" | "css") => void;
}

export function CodeEditor({ mode = "markdown", onModeChange }: CodeEditorProps = {}) {
  const [resume, setResume] = useAtom(resumeAtom);
  const [isDark, setIsDark] = useState(false);
  const showAdvanced = mode === "css";

  // Detect dark mode
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setResume((prev: Resume) => ({
        ...prev,
        [showAdvanced ? "customCss" : "markdown"]: value,
      }));
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={showAdvanced ? "css" : "markdown"}
          value={showAdvanced ? resume.customCss || "" : resume.markdown || ""}
          onChange={handleEditorChange}
          theme={isDark ? "vs-dark" : "vs-light"}
          options={EDITOR_OPTIONS}
        />
      </div>
    </div>
  );
}

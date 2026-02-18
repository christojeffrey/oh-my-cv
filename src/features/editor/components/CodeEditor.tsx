import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useAtom } from "jotai";
import { useMemo } from "react";
import type { editor } from "monaco-editor";
import { resumeAtom } from "@/features/editor/stores/cv-data";
import type { Resume } from "@/types/resume";
import { darkModeAtom } from "@/atoms";

const EDITOR_OPTIONS : any = {
  minimap: { enabled: false },
  fontSize: 14,
  padding: { top: 16 },
  scrollBeyondLastLine: false,
  renderLineHighlight: "all",
  cursorBlinking: "smooth",
  fontFamily: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
  fontLigatures: true,
  wordWrap: "on",
};

interface CodeEditorProps {
  mode?: "markdown" | "css";
}

export function CodeEditor({ mode = "markdown" }: CodeEditorProps = {}) {
  const [resume, setResume] = useAtom(resumeAtom);
  const [darkMode] = useAtom(darkModeAtom);
  const showAdvanced = mode === "css";

  const editorTheme = useMemo(() => {
    if (darkMode === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "vs-dark" : "vs-light";
    }
    return darkMode === "dark" ? "vs-dark" : "vs-light";
  }, [darkMode]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setResume((prev: Resume) => ({
        ...prev,
        [showAdvanced ? "customCss" : "markdown"]: value,
      }));
    }
  };

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editor.addAction({
      id: "toggle-word-wrap",
      label: "Toggle Word Wrap",
      keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ],
      run: (ed) => {
        const currentWrap = ed.getOption(monaco.editor.EditorOption.wordWrap);
        const newWrap = currentWrap === "off" ? "on" : "off";
        ed.updateOptions({ wordWrap: newWrap });
      },
    });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={showAdvanced ? "css" : "markdown"}
          value={showAdvanced ? resume.customCss || "" : resume.markdown || ""}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme={editorTheme}
          options={EDITOR_OPTIONS}
        />
      </div>
    </div>
  );
}

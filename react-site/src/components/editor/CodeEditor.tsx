import Editor from "@monaco-editor/react";
import { useAtom } from "jotai";
import type { editor } from "monaco-editor";
import { useRef, useState } from "react";
import { cvDataAtom } from "@/atoms/index.ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";

export function CodeEditor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [cvData, setCvData] = useAtom(cvDataAtom);
  const [activeTab, setActiveTab] = useState("markdown");

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCvData({
        ...cvData,
        [activeTab]: value,
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
        </TabsList>
        <TabsContent value="markdown" className="flex-1">
          <Editor
            height="100%"
            language="markdown"
            value={cvData.markdown || ""}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
        </TabsContent>
        <TabsContent value="css" className="flex-1">
          <Editor
            height="100%"
            language="css"
            value={cvData.css || ""}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

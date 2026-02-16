import Editor from "@monaco-editor/react";
import { useAtom } from "jotai";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cvDataAtom } from "@/features/editor/stores/cv-data";
import type { SystemData } from "@/types/resume";

const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 14,
};

export function CodeEditor() {
  const [cvData, setCvData] = useAtom(cvDataAtom);
  const [activeTab, setActiveTab] = useState("markdown");

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCvData((prev: SystemData) => ({
        ...prev,
        [activeTab]: value,
      }));
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
        </TabsList>
        {(["markdown", "css"] as const).map((lang) => (
          <TabsContent key={lang} value={lang} className="flex-1">
            <Editor
              height="100%"
              language={lang}
              value={cvData[lang] || ""}
              onChange={handleEditorChange}
              theme="vs-light"
              options={EDITOR_OPTIONS}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

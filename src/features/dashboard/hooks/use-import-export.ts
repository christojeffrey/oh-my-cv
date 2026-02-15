import { useAtom } from "jotai";
import { resumeAtom } from "@/store/resume-atom";


/**
 * Hook to handle import/export operations
 */
export function useImportExport(onUpdate?: () => void) {
  const [resume, setResume] = useAtom(resumeAtom);

  const exportToJSON = () => {
    // Export the single local resume
    const dataStr = JSON.stringify(resume, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resume-${resume.name.replace(/\s+/g, "_")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importFromJSON = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        try {
          const json = JSON.parse(content);

          // Check if it's the old bulk format
          if (json.version && json.data) {
            // Take the first resume found
            const firstKey = Object.keys(json.data)[0];
            if (firstKey && json.data[firstKey]) {
              const imported = json.data[firstKey];
              // Ensure it uses the 'local' ID
              setResume({ ...imported, id: "local", updated_at: new Date() });
              onUpdate?.();
              return;
            }
          }

          // Assume it's a single resume
          if (json.name && (json.markdown || json.css)) {
            setResume({ ...json, id: "local", updated_at: new Date() });
            onUpdate?.();
          }
        } catch (error) {
          console.error("Failed to import resume", error);
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  return {
    exportToJSON,
    importFromJSON,
  };
}

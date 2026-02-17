import { useAtom } from "jotai";
import { resumeAtom } from "@/store/resume-atom";

export function useImportExport() {
  const [resume, setResume] = useAtom(resumeAtom);

  const exportToJSON = () => {
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

          if (json.version && json.data) {
            const firstKey = Object.keys(json.data)[0];
            if (firstKey && json.data[firstKey]) {
              setResume({ ...json.data[firstKey], id: "local", updated_at: new Date() });
              return;
            }
          }

          if (json.name && (json.markdown || json.css || json.customCss)) {
            const mappedResume = {
              ...json,
              customCss: json.customCss || json.css || "",
              configuration: json.configuration || json.styles || {},
              id: "local",
              updated_at: new Date(),
            };
            // Clean up old fields
            delete mappedResume.css;
            delete mappedResume.styles;

            setResume(mappedResume);
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

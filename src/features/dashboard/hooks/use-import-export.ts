import { storageService } from "@/services/storage";

/**
 * Hook to handle import/export operations
 */
export function useImportExport(onUpdate?: () => void) {
  const exportToJSON = () => {
    storageService.exportToJSON();
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
        const success = await storageService.importFromJson(content);
        if (success) {
          onUpdate?.();
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

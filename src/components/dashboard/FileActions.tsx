import { Save, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { storageService } from "@/services/storage";
import { toast } from "@/services/toast";

interface FileActionsProps {
  onUpdate: () => void;
}

export function FileActions({ onUpdate }: FileActionsProps) {
  const [isImporting, setIsImporting] = useState(false);

  const exportToJSON = () => {
    storageService.exportToJSON();
    toast.export();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const content = await file.text();
      const success = await storageService.importFromJson(content);
      toast.import(success);
      if (success) {
        onUpdate();
      }
    } catch (error) {
      console.error("Import failed:", error);
      toast.error("Import failed");
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={exportToJSON} variant="secondary">
        <Save className="w-4 h-4 mr-1" />
        Save as...
      </Button>
      <Button variant="outline" disabled={isImporting}>
        <label className="cursor-pointer flex items-center">
          <Upload className="w-4 h-4 mr-1" />
          {isImporting ? "Importing..." : "Import"}
          <input type="file" accept=".json" onChange={handleImport} className="hidden" />
        </label>
      </Button>
    </div>
  );
}

import { Save, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/services/toast";
import { useImportExport } from "../hooks/use-import-export";

interface FileActionsProps {
  onUpdate: () => void;
}

export function FileActions({ onUpdate }: Readonly<FileActionsProps>) {
  const [isImporting, setIsImporting] = useState(false);
  const { exportToJSON, importFromJSON } = useImportExport(onUpdate);

  const handleExport = () => {
    exportToJSON();
    toast.export();
  };

  const handleImportClick = async () => {
    setIsImporting(true);
    try {
      await importFromJSON();
      toast.import(true);
    } catch (error) {
      console.error("Import failed:", error);
      toast.error("Import failed");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleExport} variant="secondary">
        <Save className="w-4 h-4 mr-1" />
        Save as...
      </Button>
      <Button variant="outline" disabled={isImporting} onClick={handleImportClick}>
        <Upload className="w-4 h-4 mr-1" />
        {isImporting ? "Importing..." : "Import"}
      </Button>
    </div>
  );
}

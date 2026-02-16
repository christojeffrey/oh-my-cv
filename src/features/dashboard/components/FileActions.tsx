import { Save, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/services/toast";
import { useImportExport } from "../hooks/use-import-export";

interface FileActionsProps {
  readonly onUpdate: () => void;
}

export function FileActions({ onUpdate }: FileActionsProps) {
  const [isImporting, setIsImporting] = useState(false);
  const { exportToJSON, importFromJSON } = useImportExport(onUpdate);

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => {
          exportToJSON();
          toast.export();
        }}
        variant="secondary"
      >
        <Save className="w-4 h-4 mr-1" />
        Save as...
      </Button>
      <Button
        variant="outline"
        disabled={isImporting}
        onClick={async () => {
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
        }}
      >
        <Upload className="w-4 h-4 mr-1" />
        {isImporting ? "Importing..." : "Import"}
      </Button>
    </div>
  );
}

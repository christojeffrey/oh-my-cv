import { useAtom } from "jotai";
import { cvDataAtom } from "@/atoms";
import { storageService } from "@/services/storage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export function ToolbarPaper() {
  const [cvData, setCvData] = useAtom(cvDataAtom);

  const updatePaper = async (value: string) => {
    if (!cvData.resumeId) return;

    const newStyles = { ...cvData.styles, paper: value as "A4" | "letter" | "legal" };
    setCvData((prev) => ({ ...prev, styles: newStyles }));

    await storageService.updateResume(cvData.resumeId, { styles: newStyles }, false);
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Paper Size</div>
      <Select value={cvData.styles.paper} onValueChange={updatePaper}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="A4">A4</SelectItem>
          <SelectItem value="letter">Letter</SelectItem>
          <SelectItem value="legal">Legal</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

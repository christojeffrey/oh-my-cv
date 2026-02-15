import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useResumeStyles } from "@/features/editor/hooks/use-resume-styles";

export function ToolbarPaper() {
  const { styles, updateStyles } = useResumeStyles();

  const updatePaper = (value: string) => {
    updateStyles((prev) => ({ ...prev, paper: value as "A4" | "letter" | "legal" }));
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Paper Size</div>
      <Select value={styles.paper} onValueChange={updatePaper}>
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

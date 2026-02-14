import { useAtom } from "jotai";
import { cvDataAtom } from "@/atoms";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { storageService } from "@/services/storage";

export function ToolbarFontSize() {
  const [cvData, setCvData] = useAtom(cvDataAtom);

  const updateFontSize = async (value: number) => {
    if (!cvData.resumeId) return;

    const newStyles = { ...cvData.styles, fontSize: value };
    setCvData((prev) => ({ ...prev, styles: newStyles }));

    await storageService.updateResume(cvData.resumeId, { styles: newStyles }, false);
  };

  return (
    <div className="space-y-2">
      <Label>Font Size</Label>
      <Slider
        value={[cvData.styles.fontSize]}
        onValueChange={([value]) => updateFontSize(value)}
        min={10}
        max={20}
        step={1}
        className="mt-2"
      />
      <span className="text-sm text-muted-foreground">{cvData.styles.fontSize}px</span>
    </div>
  );
}

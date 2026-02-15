import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useResumeStyles } from "@/features/editor/hooks/use-resume-styles";

export function ToolbarFontSize() {
  const { styles, updateStyles } = useResumeStyles();

  const updateFontSize = (value: number) => {
    updateStyles((prev) => ({ ...prev, fontSize: value }));
  };

  return (
    <div className="space-y-2">
      <Label>Font Size</Label>
      <Slider
        value={[styles.fontSize]}
        onValueChange={([value]) => updateFontSize(value)}
        min={10}
        max={20}
        step={1}
        className="mt-2"
      />
      <span className="text-sm text-muted-foreground">{styles.fontSize}px</span>
    </div>
  );
}

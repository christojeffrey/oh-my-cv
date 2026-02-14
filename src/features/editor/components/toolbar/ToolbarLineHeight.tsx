import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useResumeStyles } from "@/features/editor/hooks/use-resume-styles";

export function ToolbarLineHeight() {
  const { styles, updateStyles } = useResumeStyles();

  const updateLineHeight = (value: number) => {
    updateStyles((prev) => ({ ...prev, lineHeight: value }));
  };

  return (
    <div className="space-y-2">
      <Label>Line Spacing</Label>
      <Slider
        value={[styles.lineHeight]}
        onValueChange={([value]) => updateLineHeight(value)}
        min={1}
        max={2}
        step={0.1}
        className="mt-2"
      />
      <span className="text-sm text-muted-foreground">{styles.lineHeight}</span>
    </div>
  );
}

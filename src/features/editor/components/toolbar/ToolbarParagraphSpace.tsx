import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useResumeStyles } from "@/features/editor/hooks/use-resume-styles";

export function ToolbarParagraphSpace() {
  const { styles, updateStyles } = useResumeStyles();

  const updateParagraphSpace = (value: number) => {
    updateStyles((prev) => ({ ...prev, paragraphSpace: value }));
  };

  return (
    <div className="space-y-2">
      <Label>Paragraph Spacing</Label>
      <Slider
        value={[styles.paragraphSpace]}
        onValueChange={([value]) => updateParagraphSpace(value)}
        min={0}
        max={20}
        step={1}
        className="mt-2"
      />
      <span className="text-sm text-muted-foreground">{styles.paragraphSpace}px</span>
    </div>
  );
}

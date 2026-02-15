import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useResumeStyles } from "@/features/editor/hooks/use-resume-styles";

export function ToolbarMargins() {
  const { styles, updateStyles } = useResumeStyles();

  const updateMarginV = (value: number) => {
    updateStyles((prev) => ({ ...prev, marginV: value }));
  };

  const updateMarginH = (value: number) => {
    updateStyles((prev) => ({ ...prev, marginH: value }));
  };

  return (
    <div className="space-y-4">
      <Label>Margins</Label>
      <div className="space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground">Top & Bottom</Label>
          <Slider
            value={[styles.marginV]}
            onValueChange={([value]) => updateMarginV(value)}
            min={0}
            max={100}
            step={5}
            className="mt-2"
          />
          <span className="text-sm text-muted-foreground">{styles.marginV}px</span>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Left & Right</Label>
          <Slider
            value={[styles.marginH]}
            onValueChange={([value]) => updateMarginH(value)}
            min={0}
            max={100}
            step={5}
            className="mt-2"
          />
          <span className="text-sm text-muted-foreground">{styles.marginH}px</span>
        </div>
      </div>
    </div>
  );
}

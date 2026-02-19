import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRESET_COLORS } from "@/constants";
import { useResumeStyles } from "@/features/editor/hooks/use-resume-styles";

export function ToolbarThemeColor() {
  const { styles, updateStyles } = useResumeStyles();

  const updateThemeColor = (value: string) => {
    updateStyles((prev) => ({ ...prev, themeColor: value }));
  };

  return (
    <div className="space-y-3">
      <Label>Theme Color</Label>

      {/* Color presets */}
      <div className="flex justify-between gap-2 flex-wrap">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => updateThemeColor(color)}
            className={`w-8 h-8 rounded-sm flex items-center justify-center transition-all duration-200 hover:scale-105 ${
              styles.themeColor.toLowerCase() === color.toLowerCase()
                ? "ring-1 ring-offset-2 ring-foreground"
                : ""
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          >
            {styles.themeColor.toLowerCase() === color.toLowerCase() && (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Custom color input */}
      <div className="flex items-center gap-2">
        <Input
          type="color"
          value={styles.themeColor}
          onChange={(e) => updateThemeColor(e.target.value)}
          className="w-full h-9 cursor-pointer rounded-sm"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const input = document.querySelector('input[type="color"]') as HTMLInputElement;
            input?.click();
          }}
          className="h-7"
        >
          Custom
        </Button>
      </div>
    </div>
  );
}

import { useAtom } from "jotai";
import { cvDataAtom } from "@/atoms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRESET_COLORS } from "@/constants";
import { storageService } from "@/services/storage";

export function ToolbarThemeColor() {
  const [cvData, setCvData] = useAtom(cvDataAtom);

  const updateThemeColor = async (value: string) => {
    if (!cvData.resumeId) return;

    const newStyles = { ...cvData.styles, themeColor: value };
    setCvData((prev) => ({ ...prev, styles: newStyles }));

    await storageService.updateResume(cvData.resumeId, { styles: newStyles }, false);
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
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all hover:scale-110 ${
              cvData.styles.themeColor.toLowerCase() === color.toLowerCase()
                ? "ring-2 ring-offset-2 ring-primary"
                : ""
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          >
            {cvData.styles.themeColor.toLowerCase() === color.toLowerCase() && (
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
          value={cvData.styles.themeColor}
          onChange={(e) => updateThemeColor(e.target.value)}
          className="w-full h-10 cursor-pointer"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const input = document.querySelector('input[type="color"]') as HTMLInputElement;
            input?.click();
          }}
        >
          Custom
        </Button>
      </div>
    </div>
  );
}

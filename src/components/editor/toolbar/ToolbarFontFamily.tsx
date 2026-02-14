import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { cvDataAtom } from "@/atoms";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOCAL_CJK_FONTS, LOCAL_EN_FONTS } from "@/constants";
import { type Font, googleFontsService } from "@/services/fonts";
import { storageService } from "@/services/storage";

export function ToolbarFontFamily() {
  const [cvData, setCvData] = useAtom(cvDataAtom);
  const [loaded, setLoaded] = useState(false);
  const [googleFonts, setGoogleFonts] = useState<{ en: string[]; cjk: string[] }>({
    en: [],
    cjk: [],
  });

  useEffect(() => {
    const loadGoogleFonts = async () => {
      try {
        // Try to get fonts from googleFontsService
        const result = await googleFontsService.get();
        if (result) {
          setGoogleFonts(result);
        }
      } catch (error) {
        console.error("Failed to load Google Fonts:", error);
      } finally {
        setLoaded(true);
      }
    };

    loadGoogleFonts();
  }, []);

  const updateFont = async (type: "fontEN" | "fontCJK", fontName: string) => {
    if (!cvData.resumeId) return;

    const fontObj: Font = { name: fontName, fontFamily: fontName };
    const newStyles = { ...cvData.styles, [type]: fontObj };
    setCvData((prev) => ({ ...prev, styles: newStyles }));

    await storageService.updateResume(cvData.resumeId, { styles: newStyles }, false);

    // Load the font
    await googleFontsService.resolve(fontObj);
  };

  // Combine local and Google fonts
  const enFonts = [
    ...LOCAL_EN_FONTS.map((f) => ({ label: f.name, value: f.fontFamily || f.name })),
    ...googleFonts.en.map((f) => ({ label: f, value: f })),
  ];

  const cjkFonts = [
    ...LOCAL_CJK_FONTS.map((f) => ({ label: f.name, value: f.fontFamily || f.name })),
    ...googleFonts.cjk.map((f) => ({ label: f, value: f })),
  ];

  const currentENFont = cvData.styles.fontEN?.fontFamily || cvData.styles.fontEN?.name || "";
  const currentCJKFont = cvData.styles.fontCJK?.fontFamily || cvData.styles.fontCJK?.name || "";

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="font-en">English Font</Label>
        <Select value={currentENFont} onValueChange={(val) => updateFont("fontEN", val)}>
          <SelectTrigger id="font-en">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {loaded ? (
              enFonts.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))
            ) : (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="font-cjk">CJK Font</Label>
        <Select value={currentCJKFont} onValueChange={(val) => updateFont("fontCJK", val)}>
          <SelectTrigger id="font-cjk">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {loaded ? (
              cjkFonts.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))
            ) : (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { cvDataAtom } from "@/atoms";
import { storageService } from "@/services/storage";
import { googleFontsService, type Font } from "@/services/fonts";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { LOCAL_EN_FONTS, LOCAL_CJK_FONTS } from "@/constants";

export function ToolbarFontFamily() {
  const [cvData, setCvData] = useAtom(cvDataAtom);
  const [loaded, setLoaded] = useState(false);
  const [googleFonts, setGoogleFonts] = useState<{ en: string[]; cjk: string[] }>({
    en: [],
    cjk: []
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

  const updateFontEN = async (font: string) => {
    if (!cvData.resumeId) return;

    const fontObj: Font = { name: font, fontFamily: font };
    const newStyles = { ...cvData.styles, fontEN: fontObj };
    setCvData((prev) => ({ ...prev, styles: newStyles }));

    await storageService.updateResume(cvData.resumeId, { styles: newStyles }, false);

    // Load the font
    await googleFontsService.resolveEN(fontObj);
  };

  const updateFontCJK = async (font: string) => {
    if (!cvData.resumeId) return;

    const fontObj: Font = { name: font, fontFamily: font };
    const newStyles = { ...cvData.styles, fontCJK: fontObj };
    setCvData((prev) => ({ ...prev, styles: newStyles }));

    await storageService.updateResume(cvData.resumeId, { styles: newStyles }, false);

    // Load the font
    await googleFontsService.resolveCJK(fontObj);
  };

  // Combine local and Google fonts
  const enFonts = [
    ...LOCAL_EN_FONTS.map((f) => ({ label: f.name, value: f.fontFamily || f.name })),
    ...googleFonts.en.map((f) => ({ label: f, value: f }))
  ];

  const cjkFonts = [
    ...LOCAL_CJK_FONTS.map((f) => ({ label: f.name, value: f.fontFamily || f.name })),
    ...googleFonts.cjk.map((f) => ({ label: f, value: f }))
  ];

  const currentENFont =
    cvData.styles.fontEN?.fontFamily || cvData.styles.fontEN?.name || "";
  const currentCJKFont =
    cvData.styles.fontCJK?.fontFamily || cvData.styles.fontCJK?.name || "";

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="font-en">English Font</Label>
        <Select value={currentENFont} onValueChange={updateFontEN}>
          <SelectTrigger id="font-en">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {!loaded ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                {enFonts.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="font-cjk">CJK Font</Label>
        <Select value={currentCJKFont} onValueChange={updateFontCJK}>
          <SelectTrigger id="font-cjk">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {!loaded ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                {cjkFonts.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

import { useAtom } from "jotai";
import { cvDataAtom } from "@/atoms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { googleFontsService } from "@/services/fonts";
import { storageService } from "@/services/storage";

export function CustomizationPanel() {
  const [cvData, setCvData] = useAtom(cvDataAtom);

  const updateStyle = async <K extends keyof (typeof cvData)["styles"]>(
    key: K,
    value: (typeof cvData)["styles"][K]
  ) => {
    if (!cvData.resumeId) return;

    const newStyles = { ...cvData.styles, [key]: value };
    setCvData((prev) => ({ ...prev, styles: newStyles }));

    await storageService.updateResume(cvData.resumeId, { styles: newStyles }, false);
  };

  const updateFontCJK = async (field: string, value: string) => {
    if (!cvData.resumeId) return;

    const newFontCJK = { ...cvData.styles.fontCJK, [field]: value };
    const newStyles = { ...cvData.styles, fontCJK: newFontCJK };

    setCvData((prev) => ({ ...prev, styles: newStyles }));

    if (field === "name") {
      await googleFontsService.resolve(newFontCJK);
    }

    await storageService.updateResume(cvData.resumeId, { styles: newStyles }, false);
  };

  const updateFontEN = async (field: string, value: string) => {
    if (!cvData.resumeId) return;

    const newFontEN = { ...cvData.styles.fontEN, [field]: value };
    const newStyles = { ...cvData.styles, fontEN: newFontEN };

    setCvData((prev) => ({ ...prev, styles: newStyles }));

    if (field === "name") {
      await googleFontsService.resolve(newFontEN);
    }

    await storageService.updateResume(cvData.resumeId, { styles: newStyles }, false);
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Layout & Spacing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marginV">Vertical Margin (px)</Label>
              <Slider
                id="marginV"
                min={0}
                max={100}
                step={5}
                value={[cvData.styles.marginV]}
                onValueChange={([value]) => updateStyle("marginV", value)}
                className="mt-2"
              />
              <span className="text-sm text-muted-foreground">{cvData.styles.marginV}px</span>
            </div>
            <div>
              <Label htmlFor="marginH">Horizontal Margin (px)</Label>
              <Slider
                id="marginH"
                min={0}
                max={100}
                step={5}
                value={[cvData.styles.marginH]}
                onValueChange={([value]) => updateStyle("marginH", value)}
                className="mt-2"
              />
              <span className="text-sm text-muted-foreground">{cvData.styles.marginH}px</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lineHeight">Line Height</Label>
              <Slider
                id="lineHeight"
                min={1}
                max={2}
                step={0.1}
                value={[cvData.styles.lineHeight]}
                onValueChange={([value]) => updateStyle("lineHeight", value)}
                className="mt-2"
              />
              <span className="text-sm text-muted-foreground">{cvData.styles.lineHeight}</span>
            </div>
            <div>
              <Label htmlFor="paragraphSpace">Paragraph Spacing (px)</Label>
              <Slider
                id="paragraphSpace"
                min={0}
                max={20}
                step={1}
                value={[cvData.styles.paragraphSpace]}
                onValueChange={([value]) => updateStyle("paragraphSpace", value)}
                className="mt-2"
              />
              <span className="text-sm text-muted-foreground">
                {cvData.styles.paragraphSpace}px
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="fontSize">Font Size (px)</Label>
            <Slider
              id="fontSize"
              min={10}
              max={20}
              step={1}
              value={[cvData.styles.fontSize]}
              onValueChange={([value]) => updateStyle("fontSize", value)}
              className="mt-2"
            />
            <span className="text-sm text-muted-foreground">{cvData.styles.fontSize}px</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="themeColor">Theme Color</Label>
            <Input
              id="themeColor"
              type="color"
              value={cvData.styles.themeColor}
              onChange={(e) => updateStyle("themeColor", e.target.value)}
              className="mt-2 w-20 h-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fonts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>CJK Font</Label>
              <Input
                placeholder="Font name"
                value={cvData.styles.fontCJK?.name || ""}
                onChange={(e) => updateFontCJK("name", e.target.value)}
                className="mt-1"
              />
              <Input
                placeholder="Font family"
                value={cvData.styles.fontCJK?.fontFamily || ""}
                onChange={(e) => updateFontCJK("fontFamily", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>English Font</Label>
              <Input
                placeholder="Font name"
                value={cvData.styles.fontEN?.name || ""}
                onChange={(e) => updateFontEN("name", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paper</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="paper">Paper Size</Label>
          <Select
            value={cvData.styles.paper}
            onValueChange={(value) => updateStyle("paper", value as "A4" | "letter" | "legal")}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A4">A4</SelectItem>
              <SelectItem value="letter">Letter</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}

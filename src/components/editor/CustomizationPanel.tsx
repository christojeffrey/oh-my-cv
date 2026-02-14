import { useAtom } from "jotai";
import { cvDataAtom } from "@/atoms";
import type { ResumeStyles } from "@/types/resume";
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
import { SliderField } from "@/components/editor/settings/SliderField";
import { googleFontsService } from "@/services/fonts";
import { storageService } from "@/services/storage";

export function CustomizationPanel() {
  const [cvData, setCvData] = useAtom(cvDataAtom);

  const updateStyle = async <K extends keyof ResumeStyles>(
    key: K,
    value: ResumeStyles[K]
  ) => {
    if (!cvData.resumeId) return;

    const newStyles = { ...cvData.styles, [key]: value };
    setCvData((prev) => ({ ...prev, styles: newStyles }));

    await storageService.updateResume(cvData.resumeId, { styles: newStyles }, false);
  };

  const updateFont = async (type: "fontCJK" | "fontEN", field: string, value: string) => {
    if (!cvData.resumeId) return;

    const currentFont = cvData.styles[type];
    const newFont = { ...currentFont, [field]: value };
    const newStyles = { ...cvData.styles, [type]: newFont };

    setCvData((prev) => ({ ...prev, styles: newStyles }));

    if (field === "name") {
      await googleFontsService.resolve(newFont);
    }

    await storageService.updateResume(cvData.resumeId, { styles: newStyles }, false);
  };

  return (
    <div className="space-y-6 p-4">
      <LayoutSettings styles={cvData.styles} onUpdate={updateStyle} />
      <ColorSettings styles={cvData.styles} onUpdate={updateStyle} />
      <FontSettings styles={cvData.styles} onUpdateFont={updateFont} />
      <PaperSettings styles={cvData.styles} onUpdate={updateStyle} />
    </div>
  );
}

interface SettingsProps {
  styles: ResumeStyles;
  onUpdate: <K extends keyof ResumeStyles>(key: K, value: ResumeStyles[K]) => void;
}

function LayoutSettings({ styles, onUpdate }: Readonly<SettingsProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Layout & Spacing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SliderField
            id="marginV"
            label="Vertical Margin (px)"
            value={styles.marginV}
            min={0}
            max={100}
            step={5}
            unit="px"
            onValueChange={(val) => onUpdate("marginV", val)}
          />
          <SliderField
            id="marginH"
            label="Horizontal Margin (px)"
            value={styles.marginH}
            min={0}
            max={100}
            step={5}
            unit="px"
            onValueChange={(val) => onUpdate("marginH", val)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SliderField
            id="lineHeight"
            label="Line Height"
            value={styles.lineHeight}
            min={1}
            max={2}
            step={0.1}
            onValueChange={(val) => onUpdate("lineHeight", val)}
          />
          <SliderField
            id="paragraphSpace"
            label="Paragraph Spacing (px)"
            value={styles.paragraphSpace}
            min={0}
            max={20}
            step={1}
            unit="px"
            onValueChange={(val) => onUpdate("paragraphSpace", val)}
          />
        </div>

        <SliderField
          id="fontSize"
          label="Font Size (px)"
          value={styles.fontSize}
          min={10}
          max={20}
          step={1}
          unit="px"
          onValueChange={(val) => onUpdate("fontSize", val)}
        />
      </CardContent>
    </Card>
  );
}

function ColorSettings({ styles, onUpdate }: Readonly<SettingsProps>) {
  return (
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
            value={styles.themeColor}
            onChange={(e) => onUpdate("themeColor", e.target.value)}
            className="mt-2 w-20 h-10"
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface FontSettingsProps {
  styles: ResumeStyles;
  onUpdateFont: (type: "fontCJK" | "fontEN", field: string, value: string) => void;
}

function FontSettings({ styles, onUpdateFont }: Readonly<FontSettingsProps>) {
  return (
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
              value={styles.fontCJK?.name || ""}
              onChange={(e) => onUpdateFont("fontCJK", "name", e.target.value)}
              className="mt-1"
            />
            <Input
              placeholder="Font family"
              value={styles.fontCJK?.fontFamily || ""}
              onChange={(e) => onUpdateFont("fontCJK", "fontFamily", e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label>English Font</Label>
            <Input
              placeholder="Font name"
              value={styles.fontEN?.name || ""}
              onChange={(e) => onUpdateFont("fontEN", "name", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PaperSettings({ styles, onUpdate }: Readonly<SettingsProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paper</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="paper">Paper Size</Label>
        <Select
          value={styles.paper}
          onValueChange={(value) => onUpdate("paper", value as "A4" | "letter" | "legal")}
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
  );
}

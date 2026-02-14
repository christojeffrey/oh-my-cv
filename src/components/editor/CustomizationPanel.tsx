import { useAtom } from "jotai";
import { cvDataAtom } from "@/atoms";
import { type ResumeStyles } from "@/atoms/data";
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
          <div>
            <Label htmlFor="marginV">Vertical Margin (px)</Label>
            <Slider
              id="marginV"
              min={0}
              max={100}
              step={5}
              value={[styles.marginV]}
              onValueChange={([value]) => onUpdate("marginV", value)}
              className="mt-2"
            />
            <span className="text-sm text-muted-foreground">{styles.marginV}px</span>
          </div>
          <div>
            <Label htmlFor="marginH">Horizontal Margin (px)</Label>
            <Slider
              id="marginH"
              min={0}
              max={100}
              step={5}
              value={[styles.marginH]}
              onValueChange={([value]) => onUpdate("marginH", value)}
              className="mt-2"
            />
            <span className="text-sm text-muted-foreground">{styles.marginH}px</span>
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
              value={[styles.lineHeight]}
              onValueChange={([value]) => onUpdate("lineHeight", value)}
              className="mt-2"
            />
            <span className="text-sm text-muted-foreground">{styles.lineHeight}</span>
          </div>
          <div>
            <Label htmlFor="paragraphSpace">Paragraph Spacing (px)</Label>
            <Slider
              id="paragraphSpace"
              min={0}
              max={20}
              step={1}
              value={[styles.paragraphSpace]}
              onValueChange={([value]) => onUpdate("paragraphSpace", value)}
              className="mt-2"
            />
            <span className="text-sm text-muted-foreground">{styles.paragraphSpace}px</span>
          </div>
        </div>

        <div>
          <Label htmlFor="fontSize">Font Size (px)</Label>
          <Slider
            id="fontSize"
            min={10}
            max={20}
            step={1}
            value={[styles.fontSize]}
            onValueChange={([value]) => onUpdate("fontSize", value)}
            className="mt-2"
          />
          <span className="text-sm text-muted-foreground">{styles.fontSize}px</span>
        </div>
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

import GoogleFontsLoader from "@/lib/google-fonts-loader";

export interface Font {
  name: string;
  fontFamily?: string;
}

let googleFontsLoaderInstance: GoogleFontsLoader | null = null;

class GoogleFontsService {
  async init(apiKey?: string) {
    if (!googleFontsLoaderInstance) {
      googleFontsLoaderInstance = new GoogleFontsLoader(apiKey || "", {
        families: [],
        categories: [],
        subsets: ["latin"],
        variants: ["regular"],
      });
      await googleFontsLoaderInstance.init();
    }
  }

  async resolve(font: Font): Promise<void> {
    if (!font.name) return;

    try {
      if (!googleFontsLoaderInstance) {
        await this.init();
      }
      const fontMap = googleFontsLoaderInstance!.getFontMap();
      const fontObj = fontMap.get(font.name);
      if (fontObj) {
        await googleFontsLoaderInstance!.setActiveFont(font.name);
      }
    } catch (error) {
      console.error(`Failed to load font: ${font.name}`, error);
    }
  }

  async resolveCJK(font: Font): Promise<void> {
    return this.resolve(font);
  }

  async resolveEN(font: Font): Promise<void> {
    return this.resolve(font);
  }

  async get(): Promise<{ en: string[]; cjk: string[] } | null> {
    try {
      if (!googleFontsLoaderInstance) {
        await this.init();
      }

      const fontMap = googleFontsLoaderInstance!.getFontMap();
      const en: string[] = [];
      const cjk: string[] = [];

      fontMap.forEach((fontObj, name) => {
        // Try to categorize fonts by family name
        const family = fontObj.family || name;
        if (family.toLowerCase().includes("noto")) {
          if (family.includes("CJK") || family.includes("SC") || family.includes("TC")) {
            cjk.push(family);
          } else {
            en.push(family);
          }
        } else if (
          family.toLowerCase().includes("zcool") ||
          family.toLowerCase().includes("ma") ||
          family.toLowerCase().includes("long")
        ) {
          cjk.push(family);
        } else {
          en.push(family);
        }
      });

      return { en, cjk };
    } catch (error) {
      console.error("Failed to get Google Fonts:", error);
      return null;
    }
  }
}

export const googleFontsService = new GoogleFontsService();

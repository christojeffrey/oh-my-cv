export type Category = "sans-serif" | "serif" | "display" | "handwriting" | "monospace";

export type Subset =
  | "arabic"
  | "bengali"
  | "chinese-simplified"
  | "chinese-traditional"
  | "cyrillic"
  | "cyrillic-ext"
  | "devanagari"
  | "greek"
  | "greek-ext"
  | "gujarati"
  | "gurmukhi"
  | "hebrew"
  | "japanese"
  | "kannada"
  | "khmer"
  | "korean"
  | "latin"
  | "latin-ext"
  | "malayalam"
  | "myanmar"
  | "oriya"
  | "sinhala"
  | "tamil"
  | "telugu"
  | "thai"
  | "vietnamese";

export type Variant =
  | "100"
  | "100italic"
  | "200"
  | "200italic"
  | "300"
  | "300italic"
  | "regular"
  | "italic"
  | "500"
  | "500italic"
  | "600"
  | "600italic"
  | "700"
  | "700italic"
  | "800"
  | "800italic"
  | "900"
  | "900italic";

export type Font = {
  family: string;
  id: string;
  category: Category;
  subsets: Subset[];
  variants: Variant[];

  kind?: string; // Usually "webfonts#webfont"
  version?: string; // Version number
  lastModified?: string; // Date of last modification (yyyy-MM-dd)
  files?: Record<Variant, string>; // Font file for each variant
};

export type FontMap = Map<string, Font>;

export type SortOption = "alphabet" | "popularity";

export type Options = {
  families?: string[];
  categories?: Category[];
  subsets?: Subset[];
  variants?: Variant[];
  filter?: (font: Font) => boolean;
  limit?: number;
  sort?: SortOption;
};

// Stylesheets

const _stylesheetId = (fontId: string) => `font-${fontId}`;

export const hasStylesheet = (fontId: string) =>
  document.getElementById(_stylesheetId(fontId)) !== null;

export const createStylesheet = (fontId: string, styles: string) => {
  const stylesheet = document.createElement("style");

  stylesheet.id = _stylesheetId(fontId);
  stylesheet.textContent = styles;

  document.head.appendChild(stylesheet);
};

// Fonts

const GOOGLE_FONTS_API = "https://www.googleapis.com/webfonts/v1/webfonts";
const GOOGLE_FONTS_CSS = "https://fonts.googleapis.com/css";

const get = (url: string): Promise<string> =>
  new Promise((resolve, reject): void => {
    const request = new XMLHttpRequest();

    request.overrideMimeType("application/json");
    request.open("GET", url, true);

    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status !== 200) {
          reject(new Error(`Response has status code ${request.status}`));
        } else {
          resolve(request.responseText);
        }
      }
    };
    request.send();
  });

const getFontStylesheet = async (
  fonts: Font[],
  subsets: Subset[],
  variants: Variant[]
): Promise<string> => {
  const url = new URL(GOOGLE_FONTS_CSS);

  const variantsStr = variants.join(",");
  const familiesStr = fonts.map((font): string => `${font.family}:${variantsStr}`);

  url.searchParams.append("family", familiesStr.join("|"));
  url.searchParams.append("subset", subsets.join(","));
  // Tell browser to render fallback font immediately and swap in the new font once it's loaded
  url.searchParams.append("font-display", "swap");

  return get(url.href);
};

const getFontId = (fontFamily: string) => fontFamily.replace(/\s+/g, "-").toLowerCase();

export const fetchFontList = async (apiKey: string): Promise<Font[]> => {
  // Request a list of all available Google Fonts, sorted by popularity
  const url = new URL(GOOGLE_FONTS_API);

  url.searchParams.append("sort", "popularity");
  url.searchParams.append("key", apiKey);

  const response = await get(url.href);
  const fonts: Font[] = JSON.parse(response).items;

  // Generate an ID for each font
  return fonts.map((font) => ({
    ...font,
    id: getFontId(font.family),
  }));
};

/**
 * Add a stylesheet for the given font to the document head
 */
export const loadFontStylesheet = async (font: Font, subsets: Subset[], variants: Variant[]) => {
  // Load font stylesheet if it hasn't been loaded yet
  if (!hasStylesheet(font.id)) {
    const fontStyle = await getFontStylesheet([font], subsets, variants);
    createStylesheet(font.id, fontStyle);
  }
};

// Loader Class

export class GoogleFontsLoader {
  private readonly apiKey: string;
  private readonly options: Options;
  private activeFontFamily: string; // Name of currently applied font
  private onChange: (font: Font) => void;
  private fontMap: FontMap = new Map<string, Font>(); // Map from font families to font objects

  constructor(
    apiKey: string,
    {
      families = [],
      categories = [],
      subsets = ["latin"],
      variants = ["regular"],
      filter = () => true,
      limit = -1,
      sort = "alphabet",
    }: Options = {},

    onChange: (font: Font) => void = (): void => {}
  ) {
    this.apiKey = apiKey;
    this.options = {
      families,
      categories,
      subsets,
      variants,
      filter,
      limit,
      sort,
    };
    this.onChange = onChange;
    this.activeFontFamily = "";
  }

  public async init(): Promise<FontMap> {
    // Load all fonts
    const fonts = await fetchFontList(this.apiKey);

    // Function to check if a font satisfies the filter criteria
    const isFontIncluded = (font: Font) =>
      // Only keep fonts whose names are included in the provided array
      (this.options.families!.length === 0 || this.options.families!.includes(font.family)) &&
      // Only keep fonts in categories from the provided array
      (this.options.categories!.length === 0 || this.options.categories!.includes(font.category)) &&
      // Only keep fonts which are available in all specified subsets
      this.options.subsets!.every((subset) => font.subsets.includes(subset)) &&
      // Only keep fonts which contain all specified variants
      this.options.variants!.every((variant) => font.variants.includes(variant)) &&
      // Only keep fonts for which the `filter` function evaluates to `true`
      this.options.filter!(font) === true;

    // Save desired fonts in the font map
    for (const font of fonts) {
      // Exit once specified limit of number of fonts is reached
      if (this.options.limit! >= 0 && this.fontMap.size >= this.options.limit!) break;
      // Only keep fonts that satisfy the filter criteria
      if (isFontIncluded(font)) this.fontMap.set(font.family, font);
    }

    // Sort the font map if required
    if (this.options.sort === "alphabet") {
      this.fontMap = new Map(
        [...this.fontMap.entries()].sort(([family1], [family2]) => family1.localeCompare(family2))
      );
    }

    return this.fontMap;
  }

  public getFontMap(): FontMap {
    return this.fontMap;
  }

  public getActiveFont(): Font {
    const activeFont = this.fontMap.get(this.activeFontFamily);
    if (!activeFont) {
      throw Error(`Cannot get active font: "${this.activeFontFamily}" is not in the font list`);
    } else {
      return activeFont;
    }
  }

  /**
   * Set the specified font as the active font and download it
   */
  public async setActiveFont(fontFamily: string) {
    const activeFont = this.fontMap.get(fontFamily);

    if (!activeFont) {
      // Font is not in fontList: Keep current activeFont and log error
      throw Error(`Cannot update active font: "${fontFamily}" is not in the font list`);
    }

    this.activeFontFamily = fontFamily;

    await loadFontStylesheet(activeFont, this.options.subsets!, this.options.variants!);

    this.onChange(activeFont);
  }

  public setOnChange(onChange: (font: Font) => void) {
    this.onChange = onChange;
  }
}

export default GoogleFontsLoader;

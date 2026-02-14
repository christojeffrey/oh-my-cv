import type { Font, ResumeStyles } from "@/types/resume";

// Paper sizes (height includes buffer for pagination calculations)
export const PAPER_SIZES: Record<string, { w: number; h: number }> = {
  A4: { w: 210, h: 297 + 2 }, // Height includes 2mm buffer
  letter: { w: 215.9, h: 279.4 + 3 }, // Height includes 3mm buffer
  legal: { w: 215.9, h: 355.6 },
};

export const MM_TO_PX = 3.78;

// Colors
export const PRESET_COLORS = [
  "#377bb5", // Blue
  "#e11d48", // Red
  "#16a34a", // Green
  "#ca8a04", // Yellow
  "#7c3aed", // Purple
  "#ea580c", // Orange
  "#0891b2", // Cyan
  "#4b5563", // Gray
];

export const LOCAL_EN_FONTS: Font[] = [
  { name: "Arial", fontFamily: "Arial, sans-serif" },
  { name: "Times New Roman", fontFamily: '"Times New Roman", Times, serif' },
  { name: "Helvetica", fontFamily: "Helvetica, Arial, sans-serif" },
  { name: "Georgia", fontFamily: "Georgia, serif" },
  { name: "Courier New", fontFamily: '"Courier New", Courier, monospace' },
  { name: "Verdana", fontFamily: "Verdana, Geneva, sans-serif" },
  { name: "Tahoma", fontFamily: "Tahoma, Geneva, sans-serif" },
  { name: "Trebuchet MS", fontFamily: '"Trebuchet MS", Helvetica, sans-serif' },
];

export const LOCAL_CJK_FONTS: Font[] = [
  { name: "华康宋体", fontFamily: "HKST" },
  { name: "思源黑体", fontFamily: '"Noto Sans SC", sans-serif' },
  { name: "思源宋体", fontFamily: '"Noto Serif SC", serif' },
  { name: "楷体", fontFamily: 'KaiTi, "楷体", serif' },
  { name: "黑体", fontFamily: 'SimHei, "黑体", sans-serif' },
];

// Google Fonts
export const GF_CJK_SUBSETS = ["chinese-simplified", "chinese-traditional"];

export const GF_CJK_FAMILY_TO_NAME: Record<string, string> = {
  "Noto Sans SC": "思源黑体",
  "Noto Serif SC": "思源宋体",
  "ZCOOL XiaoWei": "站酷小薇LOGO体",
  "ZCOOL QingKe HuangYou": "站酷庆科黄油体",
  "Ma Shan Zheng": "马善政毛笔楷书",
  "Long Cang": "龙藏体",
  "Liu Jian Mao Cao": "刘建毛草",
};

export const GF_CJK_FIRST = ["思源黑体", "思源宋体", "站酷小薇LOGO体", "站酷庆科黄油体"];

export const GF_IGNORE_FONTS = ["Icon"];

// Defaults
export const DEFAULT_STYLES: ResumeStyles = {
  marginV: 50,
  marginH: 45,
  lineHeight: 1.3,
  paragraphSpace: 5,
  themeColor: "#377bb5",
  fontCJK: {
    name: "华康宋体",
    fontFamily: "HKST",
  },
  fontEN: {
    name: "Minion Pro",
    fontFamily: "Minion Pro, serif",
  },
  fontSize: 15,
  paper: "A4",
};

export const DEFAULT_RESUME_NAME = "New Resume";

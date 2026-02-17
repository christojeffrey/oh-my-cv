import type { Font, ResumeConfiguration } from "@/types/resume";

// Paper sizes (height includes buffer for pagination calculations)
export const PAPER_SIZES: Record<string, { w: number; h: number }> = {
  A4: { w: 210, h: 297 },
  letter: { w: 215.9, h: 279.4 },
  legal: { w: 215.9, h: 355.6 },
};

export const MM_TO_PX = 3.78;

// ColorsImp
export const PRESET_COLORS = [
  "#000000",
  "#377bb5",
  "#0891b2",
  "#16a34a",
  "#e11d48",
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


export const DEFAULT_RESUME_CONFIGURATION: ResumeConfiguration = {
  marginV: 30,
  marginH: 30,
  lineHeight: 1.3,
  paragraphSpace: 5,
  themeColor: "#000000",
  fontCJK: {
    name: "华康宋体",
    fontFamily: "HKST",
  },
  fontEN: {
    name: "Times New Roman",
    fontFamily: '"Times New Roman", Times, serif',
  },
  fontSize: 15,
  paper: "A4",
};

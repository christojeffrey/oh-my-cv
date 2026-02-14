import { atom } from "jotai";

export interface Font {
  name: string;
  fontFamily?: string;
}

export interface ResumeStyles {
  marginV: number;
  marginH: number;
  lineHeight: number;
  paragraphSpace: number;
  themeColor: string;
  fontCJK: Font;
  fontEN: Font;
  fontSize: number;
  paper: "A4" | "letter" | "legal";
}

export interface DbResume {
  id: number;
  name: string;
  markdown: string;
  css: string;
  styles: ResumeStyles;
  created_at: Date;
  updated_at: Date;
}

export interface SystemData {
  markdown: string;
  css: string;
  resumeId: number | null;
  resumeName: string;
  styles: ResumeStyles;
  loaded: boolean;
}

export const cvDataAtom = atom<SystemData>({
  markdown: "",
  css: "",
  resumeId: null,
  resumeName: "",
  styles: {
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
    },
    fontSize: 15,
    paper: "A4",
  },
  loaded: false,
});

export const resumeStyleAtom = atom<SystemData["styles"]>({
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
  },
  fontSize: 15,
  paper: "A4",
});

export const darkModeAtom = atom<"light" | "dark" | "system">("system");

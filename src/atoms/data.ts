import { atom } from "jotai";
import type { SystemData } from "@/types/resume";
import { DEFAULT_STYLES } from "@/constants";

export type { DbResume, ResumeStyles, SystemData } from "@/types/resume";

export const cvDataAtom = atom<SystemData>({
  markdown: "",
  css: "",
  resumeId: null,
  resumeName: "",
  styles: DEFAULT_STYLES,
  loaded: false,
});

export const darkModeAtom = atom<"light" | "dark" | "system">("system");

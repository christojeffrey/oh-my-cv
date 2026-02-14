import { atom } from "jotai";
import { DEFAULT_STYLES } from "@/constants";
import type { SystemData } from "@/types/resume";

export const cvDataAtom = atom<SystemData>({
  markdown: "",
  css: "",
  resumeId: null,
  resumeName: "",
  styles: DEFAULT_STYLES,
  loaded: false,
});

import { atom } from "jotai";
import { DEFAULT_RESUME_CONFIGURATION } from "@/constants";
import type { Resume } from "@/types/resume";

export const resumeAtom = atom<Resume>({
  markdown: "",
  customCss: "",
  resumeId: null,
  resumeName: "",
  configuration: DEFAULT_RESUME_CONFIGURATION,
  loaded: false,
});

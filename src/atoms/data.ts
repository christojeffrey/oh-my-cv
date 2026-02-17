import { atomWithStorage } from "jotai/utils";

export type { DbResume, Resume } from "@/types/resume";

// Global UI state with localStorage persistence
export const darkModeAtom = atomWithStorage<"light" | "dark" | "system">(
  "oh-my-cv-theme",
  "system"
);

export const languageAtom = atomWithStorage<string>(
  "oh-my-cv-language",
  "en"
);

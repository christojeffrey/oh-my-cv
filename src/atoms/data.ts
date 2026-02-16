import { atom } from "jotai";

export type { DbResume, ResumeConfiguration as ResumeStyles, SystemData } from "@/types/resume";

// Global UI state
export const darkModeAtom = atom<"light" | "dark" | "system">("system");

import { atom } from "jotai";

export type { DbResume, SystemData } from "@/types/resume";

// Global UI state
export const darkModeAtom = atom<"light" | "dark" | "system">("system");

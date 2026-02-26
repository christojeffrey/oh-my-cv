import { atom } from "jotai";
import { DEFAULT_RESUME_CONFIGURATION } from "@/constants";
import type { Resume } from "@/types/resume";

export type SaveStatus = "saved" | "saving" | "unsaved";
export const syncStatusAtom = atom<SaveStatus>("saved");

const baseResumeAtom = atom<Resume>({
  markdown: "",
  customCss: "",
  resumeId: null,
  resumeName: "",
  configuration: DEFAULT_RESUME_CONFIGURATION,
  loaded: false,
});

export const resumeAtom = atom<Resume, [React.SetStateAction<Resume>, boolean?], void>(
  (get) => get(baseResumeAtom),
  (get, set, update, isFromServer = false) => {
    const prev = get(baseResumeAtom);
    const next = typeof update === "function" ? update(prev) : update;
    set(baseResumeAtom, next);

    // Explicitly flag as unsaved if the write originated from local UI
    if (!isFromServer && next.loaded) {
      set(syncStatusAtom, "unsaved");
    }
  }
);

import { atomWithStorage } from "jotai/utils";
import type { DbResume } from "@/types/resume";
import { DEFAULT_RESUME_MARKDOWN, DEFAULT_RESUME_CSS } from "@/constants/templates/default";
import { DEFAULT_STYLES } from "@/constants";

const defaultResume: DbResume = {
    id: "local",
    name: "My Resume",
    markdown: DEFAULT_RESUME_MARKDOWN,
    css: DEFAULT_RESUME_CSS,
    styles: DEFAULT_STYLES,
    created_at: new Date(),
    updated_at: new Date(),
};

export const resumeAtom = atomWithStorage<DbResume>("oh-my-cv-local-resume", defaultResume);

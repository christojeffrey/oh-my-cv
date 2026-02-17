import { atomWithStorage } from "jotai/utils";
import type { DbResume } from "@/types/resume";
import { DEFAULT_RESUME_MARKDOWN, DEFAULT_RESUME_CUSTOM_CSS } from "@/constants/templates/default";
import { DEFAULT_RESUME_CONFIGURATION } from "@/constants";

const defaultResume: DbResume = {
    id: "local",
    name: "My Resume",
    markdown: DEFAULT_RESUME_MARKDOWN,
    customCss: DEFAULT_RESUME_CUSTOM_CSS,
    configuration: DEFAULT_RESUME_CONFIGURATION,
    created_at: new Date(),
    updated_at: new Date(),
};

export const resumeAtom = atomWithStorage<DbResume>("oh-my-cv-local-resume", defaultResume);

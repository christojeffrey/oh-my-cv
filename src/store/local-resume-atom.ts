import { atomWithStorage } from "jotai/utils";
import { DEFAULT_RESUME_CONFIGURATION } from "@/constants";
import { DEFAULT_RESUME_CUSTOM_CSS, DEFAULT_RESUME_MARKDOWN } from "@/constants/templates/default";
import type { DbResume } from "@/types/resume";

const defaultLocalResume: DbResume = {
  id: "local",
  name: "My Resume",
  markdown: DEFAULT_RESUME_MARKDOWN,
  customCss: DEFAULT_RESUME_CUSTOM_CSS,
  configuration: DEFAULT_RESUME_CONFIGURATION,
  created_at: new Date(),
  updated_at: new Date(),
};

export const localResumeAtom = atomWithStorage<DbResume>(
  "oh-my-resume-local-resume",
  defaultLocalResume
);

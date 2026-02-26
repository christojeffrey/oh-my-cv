import { useConvexAuth, useMutation } from "convex/react";
import { useAtom } from "jotai";
import { DEFAULT_RESUME_CONFIGURATION } from "@/constants";
import { DEFAULT_RESUME_CUSTOM_CSS, DEFAULT_RESUME_MARKDOWN } from "@/constants/templates/default";
import { localResumeAtom } from "@/store/local-resume-atom.ts";
import type { DbResume } from "@/types/resume";
import { api } from "../../convex/_generated/api";

/** Mutation-only hook for creating a new resume. No list subscription. */
export function useCreateResume() {
  const { isAuthenticated } = useConvexAuth();
  const [, setLocalResume] = useAtom(localResumeAtom);
  const createResumeMutation = useMutation(api.resumes.createResume);

  const createResume = async (): Promise<string> => {
    if (isAuthenticated) {
      try {
        const id = await createResumeMutation({
          title: "Untitled Resume",
          markdown: DEFAULT_RESUME_MARKDOWN,
          customCss: DEFAULT_RESUME_CUSTOM_CSS,
          configuration: JSON.stringify({ ...DEFAULT_RESUME_CONFIGURATION }),
        });
        return id;
      } catch (error) {
        console.error("Failed to create resume in Convex:", error);
        alert(`Failed to create resume: ${error}`);
        throw error;
      }
    }

    const now = new Date();
    const newResume: DbResume = {
      id: "local",
      name: "Untitled Resume",
      markdown: DEFAULT_RESUME_MARKDOWN,
      customCss: DEFAULT_RESUME_CUSTOM_CSS,
      configuration: { ...DEFAULT_RESUME_CONFIGURATION },
      created_at: now,
      updated_at: now,
    };
    setLocalResume(newResume);
    return newResume.id;
  };

  return { createResume };
}

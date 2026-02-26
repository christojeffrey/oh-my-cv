import { useConvexAuth, useMutation } from "convex/react";
import { useAtom } from "jotai";
import { toConvexArgs } from "@/lib/resume-mapper";
import { localResumeAtom } from "@/store/local-resume-atom.ts";
import type { DbResume } from "@/types/resume";
import { api } from "../../convex/_generated/api";

/**
 * Mutation-only hook for duplicating a resume.
 * Accepts the full source resume object — no list subscription needed.
 */
export function useDuplicateResume() {
  const { isAuthenticated } = useConvexAuth();
  const [, setLocalResume] = useAtom(localResumeAtom);
  const createResumeMutation = useMutation(api.resumes.createResume);

  const duplicateResume = async (source: DbResume): Promise<string | undefined> => {
    const copy: Partial<DbResume> = {
      name: `${source.name} (copy)`,
      markdown: source.markdown,
      customCss: source.customCss,
      configuration: source.configuration,
    };

    if (isAuthenticated) {
      try {
        const args = toConvexArgs(copy);
        const newId = await createResumeMutation({
          title: args.title ?? copy.name ?? "Untitled Resume",
          markdown: args.markdown ?? "",
          customCss: args.customCss ?? "",
          configuration: args.configuration ?? "{}",
        });
        return newId;
      } catch (error) {
        console.error("Failed to duplicate resume in Convex:", error);
        alert(`Failed to duplicate resume: ${error}`);
        throw error;
      }
    } else {
      const newResume: DbResume = {
        ...source,
        id: `local-${Date.now()}`,
        name: `${source.name} (copy)`,
        created_at: new Date(),
        updated_at: new Date(),
      };
      setLocalResume(newResume);
      return newResume.id;
    }
  };

  return { duplicateResume };
}

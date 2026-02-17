import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { localResumeAtom } from "@/store/local-resume-atom.ts";
import type { DbResume } from "@/types/resume";
import { DEFAULT_RESUME_CONFIGURATION } from "@/constants";
import { DEFAULT_RESUME_MARKDOWN, DEFAULT_RESUME_CUSTOM_CSS } from "@/constants/templates/default";

export function useResumes() {
  const { isLoaded } = useAuth();
  const { isAuthenticated, isLoading: isConvexAuthLoading } = useConvexAuth();
  const [localResume, setLocalResume] = useAtom(localResumeAtom);

  const convexResumes = useQuery(api.resumes.getResumes, isAuthenticated ? {} : "skip");
  const createResumeMutation = useMutation(api.resumes.createResume);
  const updateResumeMutation = useMutation(api.resumes.updateResume);
  const deleteResumeMutation = useMutation(api.resumes.deleteResume);

  const resumes = useMemo(() => {
    if (isAuthenticated && convexResumes) {
      return convexResumes.map(r => ({
        id: r._id,
        name: r.title,
        markdown: r.markdown,
        customCss: r.customCss,
        configuration: JSON.parse(r.configuration),
        created_at: new Date(r._creationTime),
        updated_at: new Date(r.lastUpdated),
      }));
    }
    return isAuthenticated ? [] : [localResume];
  }, [isAuthenticated, convexResumes, localResume]);

  const isConvexLoading = isAuthenticated && convexResumes === undefined;
  const isLoading = !isLoaded || isConvexAuthLoading || isConvexLoading;

  const createResume = async () => {
    if (isAuthenticated) {
      const now = new Date();
      const resumeToSave = {
        name: "Untitled Resume",
        markdown: DEFAULT_RESUME_MARKDOWN,
        customCss: DEFAULT_RESUME_CUSTOM_CSS,
        configuration: { ...DEFAULT_RESUME_CONFIGURATION, },
        created_at: now,
        updated_at: now,
      };

      try {
        const id = await createResumeMutation({
          title: resumeToSave.name,
          markdown: resumeToSave.markdown,
          customCss: resumeToSave.customCss,
          configuration: JSON.stringify(resumeToSave.configuration),
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

  const updateResume = async (id: number | string, data: Partial<DbResume>) => {
    if (isAuthenticated) {
      const current = resumes.find(r => r.id === id);
      if (!current) return;

      const updated = { ...current, ...data, updated_at: new Date() };

      try {
        await updateResumeMutation({
          id: id as Id<"resumes">,
          title: updated.name,
          markdown: updated.markdown,
          customCss: updated.customCss,
          configuration: JSON.stringify(updated.configuration),
        });
      } catch (error) {
        console.error("Failed to update resume in Convex:", error);
      }
    } else if (id === localResume.id) {
      setLocalResume(prev => ({
        ...prev,
        ...data,
        updated_at: new Date(),
      }));
    }
  };

  const deleteResume = async (id: number | string) => {
    if (isAuthenticated) {
      try {
        await deleteResumeMutation({id: id as Id<"resumes">});
      } catch (error) {
        console.error("Failed to delete resume in Convex:", error);
      }
    }
  };

  return {
    resumes,
    isLoading,
    createResume,
    updateResume,
    deleteResume,
  };
}

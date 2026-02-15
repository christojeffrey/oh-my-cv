import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { resumeAtom } from "@/store/resume-atom";

import type { DbResume } from "@/types/resume";
import { DEFAULT_STYLES } from "@/constants";
import { DEFAULT_RESUME_MARKDOWN, DEFAULT_RESUME_CSS } from "@/constants/templates/default";

export function useResumes() {
  const { isLoaded } = useAuth();
  const { isAuthenticated, isLoading: isConvexAuthLoading } = useConvexAuth();

  // Local storage state
  const [localResume, setLocalResume] = useAtom(resumeAtom);

  // Convex state
  const convexResumes = useQuery(api.resumes.getResumes, isAuthenticated ? {} : "skip");
  const createResumeMutation = useMutation(api.resumes.createResume);
  const updateResumeMutation = useMutation(api.resumes.updateResume);
  const deleteResumeMutation = useMutation(api.resumes.deleteResume);

  // Unified Interface
  const resumes = useMemo(() => {
    if (isAuthenticated && convexResumes) {
      return convexResumes.map(r => ({
        id: r._id,
        name: r.title,
        markdown: r.markdown || DEFAULT_RESUME_MARKDOWN,
        css: r.css || DEFAULT_RESUME_CSS,
        styles: r.styles ? JSON.parse(r.styles) : DEFAULT_STYLES,
        created_at: new Date(r._creationTime),
        updated_at: new Date(r.lastUpdated),
      }));
    }
    // Return array with single local resume if not authenticated
    return isAuthenticated ? [] : [localResume];
  }, [isAuthenticated, convexResumes, localResume]);

  // Simplify loading state logic
  const isConvexLoading = isAuthenticated && convexResumes === undefined;
  // Local storage via atomWithStorage is synchronous after initial load (which is handled by Jotai), 
  // but to be safe we can consider it loaded if the atom has a value. 
  // For atomWithStorage, it might need a Suspense boundary or we assume it's ready. 
  // Given the simplicity, we'll assume local is always "loaded" for now or check if localResume is present.
  const isLoading = !isLoaded || isConvexAuthLoading || isConvexLoading;

  const reload = async () => {
    // No-op for atom-based local storage as it reactive
    if (isAuthenticated && convexResumes === undefined) {
      // Trigger convex refetch if needed, but useQuery handles it
    }
  };

  const createResume = async (data: Partial<DbResume>) => {
    // We utilize isAuthenticated to ensure Convex is ready to accept mutations
    if (isAuthenticated) {
      const now = new Date();
      const resumeToSave = {
        name: data.name || "Untitled Resume",
        markdown: data.markdown || DEFAULT_RESUME_MARKDOWN,
        css: data.css || DEFAULT_RESUME_CSS,
        styles: { ...DEFAULT_STYLES, ...data.styles },
        created_at: now,
        updated_at: now,
        ...data
      };

      try {
        const id = await createResumeMutation({
          title: resumeToSave.name,
          markdown: resumeToSave.markdown,
          css: resumeToSave.css,
          styles: JSON.stringify(resumeToSave.styles),
        });
        return id;
      } catch (error) {
        console.error("Failed to create resume in Convex:", error);
        alert(`Failed to create resume: ${error}`);
        throw error;
      }
    }

    // For local, we only support one resume, so "creating" just updates the single existing one
    // or resets it. But to match the "create" semantics, we'll update it.
    // However, if the user thinks they are creating a *new* one, we should probably reset ID/dates?
    // The requirement says "only a single resume", so effectively "create" is "reset/overwrite".

    const now = new Date();
    const newResume: DbResume = {
      id: "local", // Keep consistent ID for single local resume
      name: data.name || "Untitled Resume",
      markdown: data.markdown || DEFAULT_RESUME_MARKDOWN,
      css: data.css || DEFAULT_RESUME_CSS,
      styles: { ...DEFAULT_STYLES, ...data.styles },
      created_at: now,
      updated_at: now,
    };
    setLocalResume(newResume);
    return newResume.id;
  };

  const updateResume = async (id: number | string, data: Partial<DbResume>) => {
    if (isAuthenticated) {
      // For Convex, we need to map the ID
      const current = resumes.find(r => r.id === id);

      if (!current) {
        return;
      }

      const updated = { ...current, ...data, updated_at: new Date() };

      try {
        await updateResumeMutation({
          id: id as Id<"resumes">,
          title: updated.name,
          markdown: updated.markdown,
          css: updated.css,
          styles: JSON.stringify(updated.styles),
        });
      } catch (error) {
        console.error("Failed to update resume in Convex:", error);
      }
    } else {
      // Local update
      // We ignore the ID check effectively since we only have one, 
      // but good to keep it somewhat sane.
      if (id === localResume.id) {
        setLocalResume(prev => ({
          ...prev,
          ...data,
          updated_at: new Date(),
        }));
      }
    }
  };

  const deleteResume = async (id: number | string) => {
    if (isAuthenticated) {
      try {
        await deleteResumeMutation({ id: id as Id<"resumes"> });
      } catch (error) {
        console.error("Failed to delete resume in Convex:", error);
      }
    } else {
      // "Deleting" the single local resume... maybe reset to default?
      // Or do nothing? 
      // Let's reset to default to simulate "gone" but keeping the structure ready.
      const defaultResume: DbResume = {
        id: "local",
        name: "My Resume",
        markdown: DEFAULT_RESUME_MARKDOWN,
        css: DEFAULT_RESUME_CSS,
        styles: DEFAULT_STYLES,
        created_at: new Date(),
        updated_at: new Date(),
      };
      setLocalResume(defaultResume);
    }
  };

  return {
    resumes,
    isLoading,
    createResume,
    updateResume,
    deleteResume,
    reload
  };
}

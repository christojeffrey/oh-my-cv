import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { useEffect, useState, useMemo } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { storageService } from "@/services/storage";

import type { DbResume } from "@/types/resume";
import { DEFAULT_STYLES } from "@/constants";
import { DEFAULT_RESUME_MARKDOWN, DEFAULT_RESUME_CSS } from "@/constants/templates/default";

export function useResumes() {
  const { isLoaded } = useAuth();
  const { isAuthenticated, isLoading: isConvexAuthLoading } = useConvexAuth();

  // Local storage state
  const [localResumes, setLocalResumes] = useState<DbResume[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  // Convex state
  const convexResumes = useQuery(api.resumes.getResumes, isAuthenticated ? {} : "skip");
  const createResumeMutation = useMutation(api.resumes.createResume);
  const updateResumeMutation = useMutation(api.resumes.updateResume);
  const deleteResumeMutation = useMutation(api.resumes.deleteResume);

  // Load local storage
  useEffect(() => {
    if (!isLoaded) return;
    if (!isAuthenticated) {
      storageService.getResumes().then((resumes) => {
        setLocalResumes(resumes);
        setIsLocalLoading(false);
      });
    } else {
      setIsLocalLoading(false);
    }
  }, [isAuthenticated, isLoaded]);

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
    return isAuthenticated ? [] : localResumes;
  }, [isAuthenticated, convexResumes, localResumes]);

  // Simplify loading state logic
  const isConvexLoading = isAuthenticated && convexResumes === undefined;
  const isLoading = !isLoaded || isConvexAuthLoading || isConvexLoading || (!isAuthenticated && isLocalLoading);

  const reload = async () => {
    if (!isAuthenticated) {
      setIsLocalLoading(true);
      const data = await storageService.getResumes();
      setLocalResumes(data);
      setIsLocalLoading(false);
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

    const newResume = await storageService.createResume(data);
    if (newResume) {
      setLocalResumes(prev => [newResume, ...prev]);
      return newResume.id;
    }

    return 0;
  };

  const updateResume = async (id: number | string, data: Partial<DbResume>) => {
    if (isAuthenticated) {
      // For Convex, we need to map the ID
      // The ID passed here is the Convex ID (string)
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
      await storageService.updateResume(Number(id), data);
      setLocalResumes(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
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
      await storageService.deleteResume(Number(id));
      setLocalResumes(prev => prev.filter(r => r.id !== id));
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

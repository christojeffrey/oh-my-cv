import { useAtom } from "jotai";
import { useEffect } from "react";
import { DEFAULT_STYLES } from "@/constants";
import { useResumes } from "@/features/dashboard/hooks/use-resumes";
import { cvDataAtom } from "../stores/cv-data";

/**
 * Hook to load and manage editor data for a resume
 */
export function useEditorData(id?: string) {
  const [cvData, setCvData] = useAtom(cvDataAtom);
  const { resumes, isLoading: isResumesLoading } = useResumes();

  // We need local loading state because resumes might be loaded but the specific ID not found yet?
  // Actually, useResumes handles loading state.

  useEffect(() => {
    if (isResumesLoading) return;

    // If no ID provided (guest mode), we try to find the "active" or latest resume.
    // If multiple exist locally, maybe the one most recently updated?
    // For now, let's pick the first one from the list (local storage returns array).
    let resume = null;

    console.log("useEditorData effect. ID:", id, "Resumes:", resumes.length, "Loading:", isResumesLoading);

    if (id) {
      resume = resumes.find(r => String(r.id) === id);
      console.log("Found resume by ID:", resume ? "yes" : "no");
    } else if (resumes.length > 0) {
      // If no ID, but we have resumes, pick the first one (most recent usually if sorted by backend/storage service)
      resume = resumes[0];
    }

    if (resume) {
      setCvData((prev) => {
        // Prevent infinite loop: only update if data actually changed
        // We can do a shallow check or just check ID/name/updated_at if available. 
        // For now, let's check a few key fields.
        if (prev.loaded && String(prev.resumeId) === String(resume.id) && prev.resumeName === resume.name && prev.markdown === resume.markdown) {
          return prev;
        }

        return {
          markdown: resume.markdown,
          css: resume.css,
          resumeId: resume.id, // Store as string or number, atom should handle it
          resumeName: resume.name,
          styles: { ...DEFAULT_STYLES, ...resume.styles },
          loaded: true,
        };
      });
    }
  }, [id, resumes, isResumesLoading, setCvData]);

  return { cvData, isLoading: isResumesLoading };
}

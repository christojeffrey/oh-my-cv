import { useAtom } from "jotai";

import { useResumes } from "@/features/dashboard/hooks/use-resumes";
import type { ResumeConfiguration } from "@/types/resume";
import { cvDataAtom } from "../stores/cv-data";

/**
 * Hook to manage resume style changes and persistence
 */
export function useResumeStyles() {
  const [cvData, setCvData] = useAtom(cvDataAtom);
  const { updateResume } = useResumes();

  const updateStyles = async (updater: (prev: ResumeConfiguration) => ResumeConfiguration) => {
    const newStyles = updater(cvData.styles);

    setCvData((prev) => ({
      ...prev,
      styles: newStyles,
    }));

    // Persist to storage (or backend via hook)
    if (cvData.resumeId) {
      await updateResume(cvData.resumeId, {
        styles: newStyles,
      });
    }
  };

  return {
    styles: cvData.styles,
    updateStyles,
  };
}

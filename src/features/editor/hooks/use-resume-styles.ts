import { useAtom } from "jotai";
import { storageService } from "@/services/storage";
import type { ResumeStyles } from "@/types/resume";
import { cvDataAtom } from "../stores/cv-data";

/**
 * Hook to manage resume style changes and persistence
 */
export function useResumeStyles() {
  const [cvData, setCvData] = useAtom(cvDataAtom);

  const updateStyles = async (updater: (prev: ResumeStyles) => ResumeStyles) => {
    const newStyles = updater(cvData.styles);

    setCvData((prev) => ({
      ...prev,
      styles: newStyles,
    }));

    // Persist to storage
    if (cvData.resumeId) {
      await storageService.updateResume(cvData.resumeId, {
        styles: newStyles,
      });
    }
  };

  return {
    styles: cvData.styles,
    updateStyles,
  };
}

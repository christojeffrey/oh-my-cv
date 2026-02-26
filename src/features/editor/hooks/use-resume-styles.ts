import { useAtom } from "jotai";

import { useUpdateResume } from "@/hooks/use-update-resume";
import type { ResumeConfiguration } from "@/types/resume";
import { resumeAtom } from "../stores/resume-data";

/**
 * Hook to manage resume style changes and persistence
 */
export function useResumeStyles() {
  const [cvData, setCvData] = useAtom(resumeAtom);
  const { updateResume } = useUpdateResume();

  const updateStyles = async (updater: (prev: ResumeConfiguration) => ResumeConfiguration) => {
    const newConfiguration = updater(cvData.configuration);

    setCvData((prev) => ({
      ...prev,
      configuration: newConfiguration,
    }));

    // Persist to storage (or backend via hook)
    if (cvData.resumeId) {
      await updateResume(cvData.resumeId, {
        configuration: newConfiguration,
      });
    }
  };

  return {
    styles: cvData.configuration,
    updateStyles,
  };
}

import { useAtom } from "jotai";
import { useEffect } from "react";
import { DEFAULT_RESUME_CONFIGURATION } from "@/constants";
import { useResumes } from "@/features/dashboard/hooks/use-resumes";
import { resumeAtom } from "../stores/cv-data";

export function useEditorData(id?: string) {
  const [cvData, setCvData] = useAtom(resumeAtom);
  const { resumes, isLoading: isResumesLoading } = useResumes();

  useEffect(() => {
    if (isResumesLoading) return;

    let resume = null;

    if (id) {
      resume = resumes.find(r => String(r.id) === id);
    } else if (resumes.length > 0) {
      resume = resumes[0];
    }

    if (resume) {
      setCvData((prev) => {
        if (prev.loaded && String(prev.resumeId) === String(resume.id) && prev.resumeName === resume.name && prev.markdown === resume.markdown) {
          return prev;
        }

        return {
          markdown: resume.markdown,
          customCss: resume.customCss,
          resumeId: resume.id,
          resumeName: resume.name,
          configuration: { ...DEFAULT_RESUME_CONFIGURATION, ...resume.configuration },
          loaded: true,
        };
      });
    }
  }, [id, resumes, isResumesLoading, setCvData]);

  return { cvData, isLoading: isResumesLoading };
}

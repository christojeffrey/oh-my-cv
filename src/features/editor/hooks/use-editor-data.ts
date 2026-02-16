import { useAtom } from "jotai";
import { useEffect } from "react";
import { DEFAULT_STYLES } from "@/constants";
import { useResumes } from "@/features/dashboard/hooks/use-resumes";
import { cvDataAtom } from "../stores/cv-data";

export function useEditorData(id?: string) {
  const [cvData, setCvData] = useAtom(cvDataAtom);
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
          css: resume.css,
          resumeId: resume.id,
          resumeName: resume.name,
          styles: { ...DEFAULT_STYLES, ...resume.styles },
          loaded: true,
        };
      });
    }
  }, [id, resumes, isResumesLoading, setCvData]);

  return { cvData, isLoading: isResumesLoading };
}

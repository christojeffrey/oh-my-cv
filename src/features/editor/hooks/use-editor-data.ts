import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { DEFAULT_STYLES } from "@/constants";
import { storageService } from "@/services/storage";
import { cvDataAtom } from "../stores/cv-data";

/**
 * Hook to load and manage editor data for a resume
 */
export function useEditorData(id: string) {
  const [cvData, setCvData] = useAtom(cvDataAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const resume = await storageService.getResume(Number.parseInt(id, 10));
        if (resume) {
          setCvData({
            markdown: resume.markdown,
            css: resume.css,
            resumeId: resume.id,
            resumeName: resume.name,
            styles: resume.styles || DEFAULT_STYLES,
            loaded: true,
          });
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading resume:", error);
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    loadResume();
  }, [id, setCvData]);

  return { cvData, isLoading };
}

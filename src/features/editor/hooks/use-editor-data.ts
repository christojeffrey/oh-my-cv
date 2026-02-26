import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { useResume } from "@/hooks/use-resume";
import { resumeAtom, syncStatusAtom } from "../stores/resume-data";

export function useEditorData(id?: string) {
  const [editorData, setEditorData] = useAtom(resumeAtom);
  const syncStatus = useAtomValue(syncStatusAtom);
  const { resume, isLoading } = useResume(id);

  useEffect(() => {
    if (isLoading || !resume) return;

    setEditorData((prev) => {
      const isCurrentlyLoaded = prev.loaded && String(prev.resumeId) === String(resume.id);

      const isIdentical =
        prev.resumeName === resume.name &&
        prev.markdown === resume.markdown &&
        prev.customCss === resume.customCss &&
        JSON.stringify(prev.configuration) === JSON.stringify(resume.configuration);

      if (isCurrentlyLoaded && isIdentical) {
        // Data is identical (e.g. our own save bouncing back) — no update needed.
        return prev;
      }

      if (isCurrentlyLoaded && (syncStatus === "unsaved" || syncStatus === "saving")) {
        // We have unsaved local changes or are actively pushing — ignore server update to prevent clobbering.
        return prev;
      }

      return {
        markdown: resume.markdown,
        customCss: resume.customCss,
        resumeId: resume.id,
        resumeName: resume.name,
        configuration: resume.configuration, // already merged with defaults in useResume
        loaded: true,
      };
    }, true); // `true` = server push; atom won't flip syncStatus to "unsaved"
  }, [resume, isLoading, setEditorData, syncStatus]);

  return { editorData, isLoading };
}

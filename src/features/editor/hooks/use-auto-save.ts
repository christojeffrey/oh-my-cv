import { useAtomValue } from "jotai";
import { useEffect, useRef, useState, useCallback } from "react";
import { useResumes } from "@/features/dashboard/hooks/use-resumes";
import { resumeAtom } from "@/features/editor/stores/cv-data";

export type SaveStatus = "saved" | "saving" | "unsaved";

let hasUnsavedChanges = false;
export const hasUnsavedChangesSync = () => hasUnsavedChanges;

const DEBOUNCE_MS = 1000;

const getSavePayload = (cv: ReturnType<typeof useAtomValue<typeof resumeAtom>>) => ({
  name: cv.resumeName,
  markdown: cv.markdown,
  customCss: cv.customCss,
  configuration: cv.configuration,
});

export function useAutoSave() {
  const cvData = useAtomValue(resumeAtom);
  const { updateResume } = useResumes();
  const [status, setStatus] = useState<SaveStatus>("saved");

  const lastSaved = useRef("");
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saving = useRef(false);
  const latest = useRef({ data: getSavePayload(cvData), str: "" });

  // Block tab close when unsaved
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  const save = useCallback(async (resumeId: string, str: string) => {
  if (saving.current) return;
  saving.current = true;
  setStatus("saving");
  try {
    await updateResume(resumeId, latest.current.data);
    if (latest.current.str === str) {
      lastSaved.current = str;
      setStatus("saved");
      hasUnsavedChanges = false;
    } else {
      // New changes arrived while saving — schedule a follow-up save
      setStatus("unsaved");
      if (pending.current) clearTimeout(pending.current);
      pending.current = setTimeout(
        () => save(resumeId, latest.current.str),
        DEBOUNCE_MS
      );
    }
  } catch {
    setStatus("unsaved");
    hasUnsavedChanges = true;
  } finally {
    saving.current = false;
  }
}, [updateResume]);

  useEffect(() => {
    if (!cvData.loaded || !cvData.resumeId) return;

    const data = getSavePayload(cvData);
    const str = JSON.stringify(data);
    latest.current = { data, str };

    // First load — just set baseline, don't save
    if (!lastSaved.current) {
      lastSaved.current = str;
      return;
    }

    if (str === lastSaved.current) {
      setStatus("saved");
      hasUnsavedChanges = false;
      return;
    }

    setStatus("unsaved");
    hasUnsavedChanges = true;

    if (pending.current) clearTimeout(pending.current);
    pending.current = setTimeout(() => save(cvData.resumeId!, str), DEBOUNCE_MS);
    return () => { if (pending.current) clearTimeout(pending.current); };
  }, [cvData, save]);

  return status;
}
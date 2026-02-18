import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useResumes } from "@/features/dashboard/hooks/use-resumes";
import { resumeAtom } from "@/features/editor/stores/cv-data";

export type SaveStatus = "saved" | "saving" | "unsaved";

// Module-level variable to track unsaved state for navigation blocking
// This is safe because we only read/write to it, no React features needed
let hasUnsavedChanges = false;

export function hasUnsavedChangesSync(): boolean {
  return hasUnsavedChanges;
}

export function useAutoSave() {
  const cvData = useAtomValue(resumeAtom);
  const { updateResume } = useResumes();
  const [status, setStatus] = useState<SaveStatus>("saved");

  const lastSavedDataStr = useRef<string>("");
  const timeoutRef = useRef<number | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (cvData.loaded && isFirstLoad.current) {
      lastSavedDataStr.current = JSON.stringify({
        name: cvData.resumeName,
        markdown: cvData.markdown,
        customCss: cvData.customCss,
        configuration: cvData.configuration,
      });
      isFirstLoad.current = false;
    }
  }, [cvData.loaded, cvData.resumeName, cvData.markdown, cvData.customCss, cvData.configuration]);

  useEffect(() => {
    if (!cvData.loaded || !cvData.resumeId || isFirstLoad.current) return;

    const currentData = {
      name: cvData.resumeName,
      markdown: cvData.markdown,
      customCss: cvData.customCss,
      configuration: cvData.configuration,
    };
    const currentDataStr = JSON.stringify(currentData);

    // --- FIX STARTS HERE ---
    if (currentDataStr === lastSavedDataStr.current) {
      // If the data matches what we last saved, we are "saved".
      // This handles the case where the user types, then backspaces to original.
      if (status !== "saved" && status !== "saving") {
        setStatus("saved");
        hasUnsavedChanges = false;
      }
      return;
    }
    // --- FIX ENDS HERE ---

    setStatus("unsaved");
    hasUnsavedChanges = true;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setStatus("saving");
      try {
        await updateResume(cvData.resumeId!, currentData);
        lastSavedDataStr.current = currentDataStr;
        setStatus("saved");
        hasUnsavedChanges = false;
      } catch (error) {
        console.error("Auto-save failed", error);
        setStatus("unsaved");
        hasUnsavedChanges = true;
      }
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [cvData, updateResume]); // Removed 'status' from dependency to prevent loops, though logic above handles it.

  // ... handleBeforeUnload logic ... (unchanged)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status !== "saved") {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [status]);

  return status;
}

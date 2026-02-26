import { useBlocker } from "@tanstack/react-router";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { useUpdateResume } from "@/hooks/use-update-resume";
import { resumeAtom, syncStatusAtom } from "@/features/editor/stores/cv-data";

const DEBOUNCE_MS = 1000;

const getSavePayload = (cv: ReturnType<typeof useAtomValue<typeof resumeAtom>>) => ({
  name: cv.resumeName,
  markdown: cv.markdown,
  customCss: cv.customCss,
  configuration: cv.configuration,
});

export function useAutoSave() {
  const cvData = useAtomValue(resumeAtom);
  const { updateResume } = useUpdateResume();
  const [status, setStatus] = useAtom(syncStatusAtom);

  const statusRef = useRef(status);
  statusRef.current = status;

  const lastSaved = useRef("");
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saving = useRef(false);
  const latest = useRef({ data: getSavePayload(cvData), str: "" });

  // Block navigation when there are unsaved changes
  useBlocker({
    shouldBlockFn: () => {
      // Block navigation if there are unsaved changes
      if (status === "saved") return false;

      // Show confirmation dialog
      const shouldLeave = confirm("You have unsaved changes. Are you sure you want to leave?");
      return !shouldLeave; // Block if they don't want to leave
    },
    // Also block browser close/refresh via beforeunload
    enableBeforeUnload: () => status !== "saved",
  });

  const save = useCallback(
    async (resumeId: string, str: string) => {
      if (saving.current) return;
      saving.current = true;
      setStatus("saving");
      try {
        await updateResume(resumeId, latest.current.data);
        if (latest.current.str === str) {
          lastSaved.current = str;
          setStatus("saved");
        } else {
          // New changes arrived while saving — schedule a follow-up save
          setStatus("unsaved");
          if (pending.current) clearTimeout(pending.current);
          pending.current = setTimeout(() => save(resumeId, latest.current.str), DEBOUNCE_MS);
        }
      } catch {
        setStatus("unsaved");
      } finally {
        saving.current = false;
      }
    },
    [updateResume, setStatus]
  );

  useEffect(() => {
    if (!cvData.loaded || !cvData.resumeId) return;
    const resumeId = cvData.resumeId;

    const data = getSavePayload(cvData);
    const str = JSON.stringify(data);
    latest.current = { data, str };

    // First load — just set baseline, don't save
    if (!lastSaved.current) {
      lastSaved.current = str;
      return;
    }

    if (str === lastSaved.current) {
      if (statusRef.current !== "saved") setStatus("saved");
      return;
    }

    // If change came from convex sync, it didn't trigger Jotai's unsaved flag!
    if (statusRef.current === "saved") {
      lastSaved.current = str;
      return;
    }

    if (pending.current) clearTimeout(pending.current);
    pending.current = setTimeout(() => save(resumeId, str), DEBOUNCE_MS);

    return () => {
      if (pending.current) clearTimeout(pending.current);
    };
  }, [cvData, save, setStatus]);

  return status;
}

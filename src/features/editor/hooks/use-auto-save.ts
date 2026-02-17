import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useResumes } from "@/features/dashboard/hooks/use-resumes";
import { resumeAtom } from "@/features/editor/stores/cv-data";

export type SaveStatus = "saved" | "saving" | "unsaved";

export function useAutoSave() {
    const cvData = useAtomValue(resumeAtom);
    const { updateResume } = useResumes();
    const [status, setStatus] = useState<SaveStatus>("saved");

    // We use a ref to store the last saved data to avoid saving if no changes occurred
    // and to properly detect changes.
    const lastSavedDataStr = useRef<string>("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isFirstLoad = useRef(true);

    useEffect(() => {
        if (cvData.loaded && isFirstLoad.current) {
            // Initialize lastSavedData on first load
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

        if (currentDataStr === lastSavedDataStr.current) {
            // Data hasn't physically changed from what we last saved (or initially loaded)
            return;
        }

        // Data has changed
        setStatus("unsaved");

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            setStatus("saving");
            try {
                await updateResume(cvData.resumeId!, currentData);
                lastSavedDataStr.current = currentDataStr;
                setStatus("saved");
            } catch (error) {
                console.error("Auto-save failed", error);
                setStatus("unsaved");
            }
        }, 2000);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [cvData, updateResume]);

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

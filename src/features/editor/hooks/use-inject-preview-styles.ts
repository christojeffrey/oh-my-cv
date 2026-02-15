import { useEffect } from "react";
import { injectCss } from "@/utils/dynamic-css";
import { coreStyles } from "@/utils/styles/core-styles";
import { generatePreviewStyles } from "@/utils/styles/preview-styles";
import type { ResumeStyles } from "@/types/resume";

export function useInjectPreviewStyles(styles: ResumeStyles) {
    // Inject core styles (static layout)
    useEffect(() => {
        injectCss("resume-core", coreStyles);
    }, []);

    // Inject dynamic config styles (from sliders)
    useEffect(() => {
        const css = generatePreviewStyles(styles);
        injectCss("resume-config", css);
    }, [styles]);
}

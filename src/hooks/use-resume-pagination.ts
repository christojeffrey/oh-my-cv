import { useLayoutEffect, useRef, useMemo, useEffect } from "react";
import { coreStyles as coreCss } from "@/utils/styles/core-styles";
import { generateConfigurationStyles as generateConfigCss } from "@/utils/styles/preview-styles";
import { MM_TO_PX, PAPER_SIZES } from "@/constants";
import type { ResumeConfiguration } from "@/types/resume";
import { applyPagination } from "@/utils/pagination";

export function useResumePagination(
  config: ResumeConfiguration,
  customCss: string,
  html: string,
  additionalCss: string = ""
) {
  const hostRef = useRef<HTMLDivElement>(null!);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // 1. Normalized Dimensions (All in PX for internal math)
  const dims = useMemo(() => {
    const paper = PAPER_SIZES[config.paper] || PAPER_SIZES.A4;
    return {
      widthPx: paper.w * MM_TO_PX,
      heightPx: paper.h * MM_TO_PX,
      vMargin: config.marginV,
      hMargin: config.marginH,
    };
  }, [config.paper, config.marginV, config.marginH, config.fontSize]);

  // 2. Setup Shadow DOM & Styles
  useLayoutEffect(() => {
    if (!hostRef.current) return;

    if (!hostRef.current.shadowRoot) {
      const shadow = hostRef.current.attachShadow({ mode: "open" });
      styleRef.current = document.createElement("style");
      containerRef.current = document.createElement("div");
      shadow.append(styleRef.current, containerRef.current);
    }

    styleRef.current!.textContent = `
      ${coreCss}
      ${generateConfigCss(config)}
      ${customCss}
      ${additionalCss}
    `;
  }, [config, customCss, additionalCss]);

  // 3. Apply Pagination using shared utility
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const timer = setTimeout(() => {
      applyPagination(container, html, config);
    }, 200);
    return () => clearTimeout(timer);
  }, [html, config]);

  return { hostRef, dims };
}

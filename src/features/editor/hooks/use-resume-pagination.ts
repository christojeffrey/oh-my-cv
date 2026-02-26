import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { ResumeConfiguration } from "@/types/resume";
import { applyPagination, getResumeDimensions, getResumeStyles } from "../utils/pagination";

export function useResumePagination(
  config: ResumeConfiguration,
  customCss: string,
  html: string,
  additionalCss: string = ""
) {
  const hostRef = useRef<HTMLDivElement>(null!);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // 1. Normalized Dimensions
  const dims = useMemo(() => getResumeDimensions(config), [config]);

  // 2. Setup Shadow DOM & Styles
  useLayoutEffect(() => {
    if (!hostRef.current) return;

    if (!hostRef.current.shadowRoot) {
      const shadow = hostRef.current.attachShadow({ mode: "open" });
      styleRef.current = document.createElement("style");
      containerRef.current = document.createElement("div");
      shadow.append(styleRef.current, containerRef.current);
    }

    styleRef.current!.textContent = getResumeStyles(config, customCss, additionalCss);
  }, [config, customCss, additionalCss]);

  // 3. Apply Pagination
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

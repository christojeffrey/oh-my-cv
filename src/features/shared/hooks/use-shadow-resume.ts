import { useEffect, useRef } from "react";
import { coreStyles } from "@/utils/styles/core-styles";
import { generatePreviewStyles } from "@/utils/styles/preview-styles";
import type { ResumeStyles } from "@/types/resume";

export interface UseShadowResumeResult {
  hostRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Shadow DOM hook for resume rendering.
 *
 * CSS priority by order (last wins):
 * 1. Core styles (base)
 * 2. Config styles (user's theme settings)
 * 3. Custom CSS (user's direct CSS edits)
 *
 * Everything in Shadow DOM = fully isolated, no conflicts.
 *
 * @param styles - Resume style configuration
 * @param customCss - User/template custom CSS
 * @param additionalCss - Optional additional CSS (e.g., for card-specific styles)
 */
export function useShadowResume(
  styles: ResumeStyles,
  customCss: string,
  additionalCss?: string
): UseShadowResumeResult {
  const hostRef = useRef<HTMLDivElement>(null!); // Non-null assertion for host
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Create shadow root on first render
    const shadowRoot = host.shadowRoot || host.attachShadow({ mode: "open" });

    // Create container element if it doesn't exist
    let container = shadowRoot.querySelector(".resume-container") as HTMLDivElement;
    if (!container) {
      container = document.createElement("div");
      container.className = "resume-container";
      shadowRoot.appendChild(container);
    }

    // Update container ref
    containerRef.current = container;

    // Combine styles in priority order: core → config → custom → additional
    // Last definition wins in Shadow DOM
    const allStyles = `
        ${coreStyles}

        /* Config styles - override core */
        ${generatePreviewStyles(styles)}

        /* Custom CSS - overrides everything */
        ${customCss}

        /* Additional CSS - highest priority (for card-specific styles) */
        ${additionalCss || ""}
      `;

    // Check if we already have a style element
    let styleElement = shadowRoot.querySelector("style") as HTMLStyleElement;

    if (styleElement) {
      // Update existing
      styleElement.textContent = allStyles;
    } else {
      // Create new and insert at the beginning
      styleElement = document.createElement("style");
      styleElement.textContent = allStyles;
      shadowRoot.insertBefore(styleElement, shadowRoot.firstChild);
    }
  }, [styles, customCss, additionalCss]);

  return {
    hostRef,
    containerRef,
  };
}

import { useEffect } from "react";
import { injectCss, removeCss } from "@/utils/dynamic-css";
import { coreStyles } from "@/utils/styles/core-styles";
import { generatePreviewStyles } from "@/utils/styles/preview-styles";
import type { ResumeStyles } from "@/types/resume";

/**
 * Inject resume styles with optional scoping via wrapper div.
 *
 * Architecture:
 * - Core styles: Static layout (lists, headers, spacing)
 * - Config styles: Dynamic theme settings (colors, sizes from sliders)
 * - Custom CSS: User/template CSS (highest priority)
 *
 * Layers ensure priority: core < config < custom
 *
 * @param styles - Resume style configuration
 * @param customCss - User/template custom CSS
 * @param wrapperId - Optional wrapper ID for scoping (e.g., resume ID for cards)
 */
export function useInjectResumeStyles(
  styles: ResumeStyles,
  customCss: string,
  wrapperId?: string
) {
  useEffect(() => {
    // Clean up any old style elements from previous system
    const oldStyleIds = ["resume-core", "resume-config", "resume-editor"];
    oldStyleIds.forEach((id) => {
      const existingElement = document.querySelector(`style[data-dynamic-css-id="${id}"]`);
      if (existingElement) {
        existingElement.remove();
      }
    });

    // For scoped CSS (cards), prefix all selectors with the wrapper ID
    // This is simple and reliable - no regex magic needed
    let scopedCoreStyles = coreStyles;
    let scopedConfigStyles = generatePreviewStyles(styles);
    let scopedCustomCss = customCss;

    if (wrapperId) {
      const scope = `#${wrapperId}`;
      scopedCoreStyles = scopeSelectors(coreStyles, scope);
      scopedConfigStyles = scopeSelectors(generatePreviewStyles(styles), scope);
      scopedCustomCss = scopeSelectors(customCss, scope);
    }

    // Combine all layers - layer declaration is already in coreStyles
    const combinedCss = `${scopedCoreStyles}\n${scopedConfigStyles}\n${scopedCustomCss}`;

    // Generate style ID
    const styleId = wrapperId ? `resume-styles-${wrapperId}` : "resume-styles-global";

    // Inject combined CSS
    injectCss(styleId, combinedCss);

    // Cleanup on unmount
    return () => {
      if (wrapperId) {
        removeCss(styleId);
      }
    };
  }, [styles, customCss, wrapperId]);
}

/**
 * Scope CSS selectors by prefixing them with a wrapper ID.
 * This is a simple replacement that works for most CSS patterns.
 *
 * Examples:
 *   `.resume-content h2` → `#wrapper .resume-content h2`
 *   `[data-part="page"]` → `#wrapper [data-part="page"]`
 */
function scopeSelectors(css: string, scope: string): string {
  // Remove the layer order declaration since we're keeping layers intact
  // and add it back at the end
  const withoutLayerOrder = css.replace(/^@layer\s+[\w\s,-]+;\s*/g, "");

  // Prefix selectors - target class selectors, attribute selectors, and element selectors
  // that appear at the start of a rule or after a comma
  return withoutLayerOrder.replace(
    /^([ \t]*)([\.a-z\[\-])/gm,
    `$1${scope} $2`
  );
}

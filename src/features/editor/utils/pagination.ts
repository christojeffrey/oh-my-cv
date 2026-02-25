import type { ResumeConfiguration } from "@/types/resume";
import { coreStyles as coreCss } from "@/utils/styles/core-styles";
import { generateConfigurationStyles as generateConfigCss } from "@/utils/styles/preview-styles";
import { MM_TO_PX, PAPER_SIZES } from "@/constants";

export interface PaginationResult {
  css: string;
  widthPx: number;
  heightPx: number;
}

export interface ResumeDimensions {
  widthPx: number;
  heightPx: number;
  vMargin: number;
  hMargin: number;
}

/**
 * Calculates resume dimensions in pixels based on configuration.
 */
export function getResumeDimensions(config: ResumeConfiguration): ResumeDimensions {
  const paper = PAPER_SIZES[config.paper] || PAPER_SIZES.A4;
  return {
    widthPx: paper.w * MM_TO_PX,
    heightPx: paper.h * MM_TO_PX,
    vMargin: config.marginV,
    hMargin: config.marginH,
  };
}

/**
 * Generates the complete CSS string for the resume.
 */
export function getResumeStyles(
  config: ResumeConfiguration,
  customCss: string = "",
  additionalCss: string = ""
): string {
  return `
    ${coreCss}
    ${generateConfigCss(config)}
    ${customCss}
    ${additionalCss}
  `;
}

/**
 * Applies pagination to a container DOM element.
 * CSS must be applied to the container before calling this function.
 * Shared by Preview component and print service.
 */
export function applyPagination(
  container: HTMLElement,
  html: string,
  config: ResumeConfiguration
): PaginationResult {
  const { widthPx, heightPx, vMargin, hMargin } = getResumeDimensions(config);
  const maxHeight = heightPx - (vMargin * 2);

  // Clear container
  container.innerHTML = "";

  // Initial render to measure
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Use childNodes to capture text nodes as well
  const children = Array.from(tempDiv.childNodes);

  let currentHeight = 0;
  let currentPage = document.createElement("div");

  const setupPage = (p: HTMLDivElement) => {
    p.dataset.part = "page";
    p.dataset.scope = "react-smart-pages";
    p.style.cssText = `
      height: ${heightPx}px;
      width: ${widthPx}px;
      padding: ${vMargin}px ${hMargin}px;
      box-sizing: border-box;
      flex-shrink: 0;
      background: white;
      position: relative;
    `;
  };

  setupPage(currentPage);
  container.appendChild(currentPage);

  children.forEach((node) => {
    // Handle non-element nodes (text, comments)
    if (node.nodeType !== Node.ELEMENT_NODE) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() === "") {
        return; // Skip empty text
      }
      // Wrap text/other nodes in a div to measure them
      const wrapper = document.createElement("div");
      wrapper.appendChild(node.cloneNode(true));
      node = wrapper;
    }

    const el = node as HTMLElement;
    currentPage.appendChild(el);

    const style = globalThis.getComputedStyle(el);
    const h = el.offsetHeight +
      Number.parseFloat(style.marginTop) +
      Number.parseFloat(style.marginBottom);

    const isManualBreak = el.classList.contains("md-it-newpage");

    if (currentHeight + h > maxHeight || isManualBreak) {
      // Move to new page
      const newPage = document.createElement("div");
      setupPage(newPage);
      container.appendChild(newPage);

      el.remove(); // Remove from previous page
      newPage.appendChild(el); // Add to new page
      currentPage = newPage;

      // Recalculate height in new context
      const newStyle = globalThis.getComputedStyle(el);
      const newH = el.offsetHeight +
        Number.parseFloat(newStyle.marginTop) +
        Number.parseFloat(newStyle.marginBottom);
      currentHeight = newH;
    } else {
      currentHeight += h;
    }
  });

  return { css: "", widthPx, heightPx };
}

/**
 * Creates a container with CSS applied, ready for pagination.
 * Used by print service to ensure measurements match preview.
 */
export function createStyledContainer(
  config: ResumeConfiguration,
  customCss: string,
  additionalCss: string = ""
): { container: HTMLElement; styleEl: HTMLElement } {
  const container = document.createElement("div");
  const styleEl = document.createElement("style");

  styleEl.textContent = getResumeStyles(config, customCss, additionalCss);
  container.appendChild(styleEl);

  // Hide container
  container.style.position = "absolute";
  container.style.visibility = "hidden";
  container.style.pointerEvents = "none";

  document.body.appendChild(container);

  return { container, styleEl };
}

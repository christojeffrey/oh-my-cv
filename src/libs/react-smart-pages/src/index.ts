import { useEffect, useRef, useCallback } from "react";
import { breakPage } from "./dom";
import type { PageSize, PageMargins, SmartPagesOptions } from "./types";

export interface UseSmartPagesResult {
  render: () => Promise<void>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useSmartPages = (
  html: string,
  size: PageSize,
  margins: PageMargins = {},
  options: SmartPagesOptions = {}
): UseSmartPagesResult => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const render = useCallback(async () => {
    const element = containerRef.current;
    if (!element) return;

    const { width, height } = size;
    const { top = 0, bottom = 0, left = 0, right = 0 } = margins;

    const _size = { width, height };
    const _margins = { top, bottom, left, right };

    // Clone element to avoid flickering
    const copy = element.cloneNode(true) as HTMLElement;
    copy.innerHTML = html;

    // Set width and margins
    element.style.width = `${width}mm`;
    element.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;

    // Attach to body temporarily to get correct computed styles
    document.body.appendChild(copy);
    copy.style.width = `${width}mm`;
    copy.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;

    if (options.beforeRender) await options.beforeRender();

    // Break page based on given size and margins
    breakPage(copy, _size, _margins);

    // Replace original element with modified copy
    element.innerHTML = copy.innerHTML;

    // Remove copy from body
    copy.remove();

    if (options.afterRender) await options.afterRender();
  }, [html, size, margins, options]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const runRender = async () => {
      await render();
    };

    // Use throttle if specified
    if (options.throttle) {
      timeoutId = setTimeout(runRender, options.throttle);
    } else {
      runRender();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [html, size, margins, options.throttle, render]);

  return { render, containerRef };
};

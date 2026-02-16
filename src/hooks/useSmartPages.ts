import { useCallback, useEffect, useRef } from "react";

export interface PageSize {
  width: number;
  height: number;
}

export interface PageMargins {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface SmartPagesOptions {
  throttle?: number;
  beforeRender?: () => Promise<void> | void;
  afterRender?: () => Promise<void> | void;
}

const NEW_PAGE_CLASS = "md-it-newpage";

const _elementHeight = (element: Element) => {
  const style = globalThis.getComputedStyle(element);

  const marginTop = Number.parseInt(style.marginTop) || 0;
  const marginBottom = Number.parseInt(style.marginBottom) || 0;

  return element.clientHeight + marginTop + marginBottom;
};

const _createPage = (size: PageSize, margins: Required<PageMargins>) => {
  const page = document.createElement("div");

  page.dataset.scope = "react-smart-pages";
  page.dataset.part = "page";

  page.style.height = `${size.height}px`;
  setWidthAndMargins(page, size, margins);

  return page;
};

export const setWidthAndMargins = (
  element: HTMLElement,
  size: PageSize,
  margins: Required<PageMargins>
) => {
  element.style.width = `${size.width}mm`;
  element.style.padding = `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`;
};

export const breakPage = (target: HTMLElement, size: PageSize, margins: Required<PageMargins>) => {
  const maxHeight = size.height - margins.top - margins.bottom;
  const pages = document.createElement("div");

  let accHeight = 0;
  let page = _createPage(size, margins);

  Array.from(target.children).forEach((child) => {
    const childHeight = _elementHeight(child);

    if (accHeight + childHeight > maxHeight || child.className === NEW_PAGE_CLASS) {
      pages.appendChild(page);

      accHeight = 0;
      page = _createPage(size, margins);
    }

    page.appendChild(child);
    accHeight += childHeight;
  });

  pages.appendChild(page);
  target.innerHTML = pages.innerHTML;
};

export interface UseSmartPagesResult {
  render: () => Promise<void>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useSmartPages = (
  html: string,
  size: PageSize,
  margins: PageMargins = {},
  options: SmartPagesOptions = {},
  externalRef?: React.RefObject<HTMLDivElement | null>
): UseSmartPagesResult => {
  const internalRef = useRef<HTMLDivElement | null>(null);
  // Use external ref if provided, otherwise use internal ref
  const containerRef = (externalRef as React.RefObject<HTMLDivElement | null>) || internalRef;

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

    // Attach temporarily to get correct computed styles
    // Check if the current element is inside a Shadow Root to ensure styles are applied
    const rootNode = element.getRootNode();
    const attachTarget = (rootNode instanceof ShadowRoot ? rootNode : document.body);

    // Hide the copy to prevent flickering, but ensure it's rendered for calculations
    copy.style.visibility = "hidden";
    copy.style.position = "absolute";
    copy.style.left = "-9999px";
    copy.style.top = "0";
    copy.style.pointerEvents = "none";
    copy.style.boxSizing = "border-box";

    attachTarget.appendChild(copy);
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

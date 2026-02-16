import { useLayoutEffect, useRef, useMemo, useCallback, useEffect } from "react";
import { coreStyles as coreCss } from "@/utils/styles/core-styles";
import { generateConfigurationStyles as generateConfigCss } from "@/utils/styles/preview-styles";
import { MM_TO_PX, PAPER_SIZES } from "@/constants";
import type { ResumeConfiguration } from "@/types/resume";

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
    }, [config.paper, config.marginV, config.marginH]);

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

    // 3. The Pagination Engine
    const paginate = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const maxHeight = dims.heightPx - (dims.vMargin * 2);

        // Initial render to measure
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        // Use childNodes to capture text nodes as well
        const children = Array.from(tempDiv.childNodes);
        container.innerHTML = "";

        let currentHeight = 0;
        let currentPage = document.createElement("div");

        const setupPage = (p: HTMLDivElement) => {
            p.dataset.part = "page";
            p.dataset.scope = "react-smart-pages";
            p.style.cssText = `
        height: ${dims.heightPx}px; 
        width: ${dims.widthPx}px; 
        padding: ${dims.vMargin}px ${dims.hMargin}px; 
        box-sizing: border-box; 
        overflow: hidden; 
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

            const htmlEl = el as HTMLElement; // cast for TS
            const style = globalThis.getComputedStyle(el);
            const h = htmlEl.offsetHeight +
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
                const newH = htmlEl.offsetHeight +
                    Number.parseFloat(newStyle.marginTop) +
                    Number.parseFloat(newStyle.marginBottom);
                currentHeight = newH;
            } else {
                currentHeight += h;
            }
        });
    }, [html, dims]);

    // 4. Trigger on content or config change
    useEffect(() => {
        const timer = setTimeout(paginate, 200);
        return () => clearTimeout(timer);
    }, [paginate]);

    return { hostRef, dims };
}

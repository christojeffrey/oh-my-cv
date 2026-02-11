import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { cvDataAtom } from "@/atoms";
import { markdownService } from "@/utils/markdown";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, Maximize } from "lucide-react";
import { injectCss } from "@/utils/dynamic-css";
import { PAPER_SIZES, MM_TO_PX } from "@/constants";
import { useSmartPages } from "@ohmycv/react-smart-pages";
import { Zoom } from "@ohmycv/react-zoom";

export function Preview() {
  const [cvData] = useAtom(cvDataAtom);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const size = PAPER_SIZES[cvData.styles.paper] || PAPER_SIZES.A4;
  const widthPx = size.w * MM_TO_PX;
  const heightPx = size.h * MM_TO_PX;

  // Measure container for fit calculations
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, []);

  // Auto-fit width on mount and when paper size changes
  useEffect(() => {
    if (containerWidth > 0) {
      // Account for padding (p-8 = 32px on each side = 64px total)
      const availableWidth = containerWidth - 64;
      const fitScale = availableWidth / widthPx;
      setScale(fitScale);
    }
  }, [containerWidth, widthPx, heightPx]);

  // Render resume markdown to HTML (includes front matter header parsing)
  const html = markdownService.renderResume(cvData.markdown || "");

  // Inject toolbar styles
  useEffect(() => {
    const toolbarStyles = `
      .resume-content {
        line-height: ${cvData.styles.lineHeight};
        font-size: ${cvData.styles.fontSize}px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding-bottom: 40px;
      }
      [data-scope="react-smart-pages"][data-part="page"] {
        box-sizing: border-box;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background-color: white;
      }
      .resume-content p,
      .resume-content li {
        margin-bottom: ${cvData.styles.paragraphSpace}px;
      }
      .resume-content h2,
      .resume-content h3 {
        margin-bottom: ${cvData.styles.paragraphSpace}px;
      }
      .resume-content .resume-header h1 {
        color: ${cvData.styles.themeColor};
        margin-bottom: 20px;
        text-align: center;
      }
      .resume-content .resume-header {
        text-align: center;
        margin-bottom: 30px;
      }
      .resume-content .resume-header-item:not(.no-separator)::after {
        content: " | ";
        margin: 0 8px;
      }
      .resume-content h2 {
        border-bottom: 1px solid ${cvData.styles.themeColor};
        padding-bottom: 5px;
        margin-bottom: 10px;
      }
      .resume-content h3 {
        margin-top: 20px;
      }
      .resume-content ul {
        list-style-type: circle;
        padding-left: 20px;
      }
      .resume-content ol {
        list-style-type: decimal;
        padding-left: 20px;
      }
      .resume-content li {
        margin-bottom: 5px;
      }
      .resume-content p {
        margin-bottom: 10px;
      }
      .resume-content strong {
        font-weight: bold;
      }
      .resume-content em {
        font-style: italic;
      }
    `;
    const styleElement = document.getElementById("preview-toolbar-styles");
    if (styleElement) {
      styleElement.textContent = toolbarStyles;
    } else {
      const newStyleElement = document.createElement("style");
      newStyleElement.id = "preview-toolbar-styles";
      newStyleElement.textContent = toolbarStyles;
      document.head.appendChild(newStyleElement);
    }
  }, [cvData.styles]);

  // Use smart pages for pagination
  const { containerRef: pagesContainerRef } = useSmartPages(
    html,
    { width: size.w, height: heightPx },
    {
      top: cvData.styles.marginV,
      bottom: Math.max(cvData.styles.marginV - 10, 10),
      left: cvData.styles.marginH,
      right: cvData.styles.marginH
    },
    {
      throttle: 200,
      beforeRender: async () => {
        // Inject CSS
        injectCss(
          "resume-editor",
          cvData.css.replace(/vue-smart-pages/g, "react-smart-pages")
        );
      }
    }
  );

  const zoomIn = () => setScale((prev) => prev * 1.1);
  const zoomOut = () => setScale((prev) => prev / 1.1);
  const fitWidth = () => {
    if (containerWidth > 0) {
      const availableWidth = containerWidth - 64;
      setScale(availableWidth / widthPx);
    }
  };
  const fitHeight = () => {
    if (containerHeight > 0) {
      const availableHeight = containerHeight - 64;
      setScale(availableHeight / heightPx);
    }
  };

  return (
    <div ref={containerRef} className="relative h-full bg-secondary overflow-hidden">

      <Zoom scale={scale} className="h-full">
        <div className="h-full overflow-auto flex justify-center p-8">
          <div
            ref={pagesContainerRef}
            className="resume-content"
            style={{
              width: `${widthPx}px`,
              fontFamily: cvData.styles.fontEN?.fontFamily || "Arial, sans-serif"
            }}
          />
        </div>
      </Zoom>

      <div className="absolute bottom-4 left-4 bg-blue-500 text-white rounded-full shadow-lg flex z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomIn}
          className="text-white hover:bg-blue-600 p-2"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomOut}
          className="text-white hover:bg-blue-600 p-2"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={fitWidth}
          className="text-white hover:bg-blue-600 p-2"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={fitHeight}
          className="text-white hover:bg-blue-600 p-2"
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

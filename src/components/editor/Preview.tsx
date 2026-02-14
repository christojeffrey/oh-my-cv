import { useAtom } from "jotai";
import { Maximize, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cvDataAtom } from "@/atoms";
import { Zoom } from "@/components/shared/Zoom";
import { Button } from "@/components/ui/button";
import { MM_TO_PX, PAPER_SIZES } from "@/constants";
import { useSmartPages } from "@/hooks/useSmartPages";
import { sanitizeHtml } from "@/utils/dompurify";
import { injectCss } from "@/utils/dynamic-css";
import { markdownService } from "@/utils/markdown";
import { generatePreviewStyles } from "@/utils/styles/preview-styles";

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
  const dirtyHtml = markdownService.renderResume(cvData.markdown || "");
  const html = sanitizeHtml(dirtyHtml);

  // Inject toolbar styles
  useEffect(() => {
    const styles = generatePreviewStyles(cvData.styles);
    injectCss("preview-toolbar-styles", styles);
  }, [cvData.styles]);

  // Use smart pages for pagination
  const { containerRef: pagesContainerRef } = useSmartPages(
    html,
    { width: size.w, height: heightPx },
    {
      top: cvData.styles.marginV,
      bottom: Math.max(cvData.styles.marginV - 10, 10),
      left: cvData.styles.marginH,
      right: cvData.styles.marginH,
    },
    {
      throttle: 200,
      beforeRender: async () => {
        // Inject CSS
        injectCss("resume-editor", cvData.css.replaceAll("vue-smart-pages", "react-smart-pages"));
      },
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
              fontFamily: cvData.styles.fontEN?.fontFamily || "Arial, sans-serif",
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

import { useAtom } from "jotai";
import { useRef } from "react";
import { Zoom } from "@/components/shared/Zoom";
import { MM_TO_PX, PAPER_SIZES } from "@/constants";
import { PreviewControls } from "@/features/editor/components/PreviewControls";
import { useInjectPreviewStyles } from "@/features/editor/hooks/use-inject-preview-styles";
import { usePreviewZoom } from "@/features/editor/hooks/use-preview-zoom";
import { cvDataAtom } from "@/features/editor/stores/cv-data";
import { useSmartPages } from "@/hooks/useSmartPages";
import { sanitizeHtml } from "@/utils/dompurify";
import { injectCss } from "@/utils/dynamic-css";
import { markdownService } from "@/utils/markdown";

export function Preview() {
  const [cvData] = useAtom(cvDataAtom);
  const containerRef = useRef<HTMLDivElement>(null);

  const size = PAPER_SIZES[cvData.styles.paper] || PAPER_SIZES.A4;
  const widthPx = size.w * MM_TO_PX;
  const heightPx = size.h * MM_TO_PX;

  // Hooks
  useInjectPreviewStyles(cvData.styles);

  const { scale, zoomIn, zoomOut, fitWidth, fitHeight } = usePreviewZoom<HTMLDivElement>(
    containerRef as React.RefObject<HTMLDivElement>,
    {
      contentWidth: widthPx,
      contentHeight: heightPx,
      padding: 64,
    }
  );

  // Render resume markdown to HTML (includes front matter header parsing)
  const dirtyHtml = markdownService.renderResume(cvData.markdown || "");
  const html = sanitizeHtml(dirtyHtml);

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
        injectCss("resume-editor", cvData.css);
      },
    }
  );

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

      <PreviewControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitWidth={fitWidth}
        onFitHeight={fitHeight}
      />
    </div>
  );
}


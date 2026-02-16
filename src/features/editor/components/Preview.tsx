import { useAtom } from "jotai";
import { useRef, useMemo } from "react";
import { Zoom } from "@/components/shared/Zoom";
import { PreviewControls } from "@/features/editor/components/PreviewControls";
import { useResumePagination } from "@/hooks/use-resume-pagination";
import { usePreviewZoom } from "@/features/editor/hooks/use-preview-zoom";
import { cvDataAtom } from "@/features/editor/stores/cv-data";
import { sanitizeHtml } from "@/utils/dompurify";
import { markdownService } from "@/utils/markdown";

export function Preview() {
  const [cvData] = useAtom(cvDataAtom);
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  const html = useMemo(() => {
    const dirtyHtml = markdownService.renderResume(cvData.markdown || "");
    return sanitizeHtml(dirtyHtml);
  }, [cvData.markdown]);

  const { hostRef, dims } = useResumePagination(
    cvData.styles,
    cvData.css,
    html
  );

  const { scale, ...controls } = usePreviewZoom(zoomContainerRef as React.RefObject<HTMLElement>, {
    contentWidth: dims.widthPx,
    contentHeight: dims.heightPx,
    padding: 64,
  });

  return (
    <div ref={zoomContainerRef} className="relative h-full bg-secondary overflow-hidden">
      <Zoom scale={scale} className="h-full">
        <div className="h-full overflow-auto flex justify-center p-8">
          <div
            ref={hostRef}
            style={{
              fontFamily: cvData.styles.fontEN?.fontFamily,
            }}
          />
        </div>
      </Zoom>

      <PreviewControls
        onZoomIn={controls.zoomIn}
        onZoomOut={controls.zoomOut}
        onFitWidth={controls.fitWidth}
        onFitHeight={controls.fitHeight}
      />
    </div>
  );
}

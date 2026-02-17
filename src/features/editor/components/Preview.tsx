import { useAtom } from "jotai";
import { useRef, useMemo, useEffect } from "react";
import { Zoom } from "@/components/shared/Zoom";
import { PreviewControls } from "@/features/editor/components/PreviewControls";
import { useResumePagination } from "@/hooks/use-resume-pagination";
import { usePreviewZoom } from "@/features/editor/hooks/use-preview-zoom";
import { resumeAtom } from "@/features/editor/stores/cv-data";
import { markdownService } from "@/utils/markdown";

export function Preview() {
  const [cvData] = useAtom(resumeAtom);
  const { configuration, customCss } = cvData;
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  const html = useMemo(() => {
    return markdownService.renderResume(cvData.markdown);
  }, [cvData.markdown]);

  const { hostRef, dims } = useResumePagination(
    configuration,
    customCss,
    html
  );

  const { scale, ...controls } = usePreviewZoom(zoomContainerRef as React.RefObject<HTMLElement>, {
    contentWidth: dims.widthPx,
    contentHeight: dims.heightPx,
    padding: 64,
  });

  useEffect(() => {
    const handlePrint = () => {
      if (hostRef.current) {
        import("@/utils/print-service").then(({ printResume }) => {
          printResume(hostRef.current, cvData.resumeName || "Resume", configuration.paper);
        });
      }
    };

    globalThis.addEventListener("resume:print", handlePrint);
    return () => globalThis.removeEventListener("resume:print", handlePrint);
  }, [cvData.resumeName, hostRef, configuration.paper]);

  return (
    <div ref={zoomContainerRef} className="relative h-full overflow-clip bg-secondary border-2 border-black">
      <Zoom scale={scale} className="h-full">
        <div className="h-full overflow-visible flex justify-center">
          <div ref={hostRef}/>
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


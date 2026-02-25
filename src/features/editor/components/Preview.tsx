import { useAtom } from "jotai";
import { useRef, useMemo } from "react";
import { X } from "lucide-react";
import { Zoom } from "@/components/shared/Zoom";
import { PreviewControls } from "@/features/editor/components/PreviewControls";
import { useResumePagination } from "@/hooks/use-resume-pagination";
import { usePreviewZoom } from "@/features/editor/hooks/use-preview-zoom";
import { resumeAtom } from "@/features/editor/stores/cv-data";
import { isPreviewOpenAtom } from "@/features/editor/stores/ui-state";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { markdownService } from "@/utils/markdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";


function PreviewContent({ cvData, zoomContainerRef }: {
  cvData: any;
  zoomContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const html = useMemo(() => {
    return markdownService.renderResume(cvData.markdown);
  }, [cvData.markdown]);

  const { hostRef, dims } = useResumePagination(
    cvData.configuration,
    cvData.customCss,
    html
  );

  const previewControls = usePreviewZoom(zoomContainerRef as React.RefObject<HTMLElement>, {
    contentWidth: dims.widthPx,
    contentHeight: dims.heightPx,
    padding: 64,
  });

  useEffect(() => {
    const handlePrint = () => {
      if (hostRef.current) {
        import("@/utils/print-service").then(({ printResume }) => {
          printResume(hostRef.current, "FirstName_LastName_Role_Resume", cvData.configuration.paper);
        });
      }
    };

    globalThis.addEventListener("resume:print", handlePrint);
    return () => globalThis.removeEventListener("resume:print", handlePrint);
  }, [cvData.resumeName, hostRef, cvData.configuration.paper]);
  return (
    <>
      <div ref={zoomContainerRef} className="h-full w-full overflow-auto">
        <Zoom scale={previewControls.scale} className="h-full">
          <div className="min-h-full overflow-visible flex justify-center py-4 sm:py-8 px-2">
            <div ref={hostRef} />
          </div>
        </Zoom>
      </div>

      <PreviewControls
        onZoomIn={previewControls.zoomIn}
        onZoomOut={previewControls.zoomOut}
        onFitWidth={previewControls.fitWidth}
        onFitHeight={previewControls.fitHeight}
      />
    </>
  );
}

export function Preview() {
  const [cvData] = useAtom(resumeAtom);
  const [isPreviewOpen, setIsPreviewOpen] = useAtom(isPreviewOpenAtom);
  const isMobile = useIsMobile();
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  // Mobile modal
  if (isMobile) {
    return (
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="w-full h-full max-w-none p-0 border-0 bg-background">
          <Button
            size="icon" variant="ghost" className="absolute top-2 right-2 z-50 bg-background/50 backdrop-blur"
            onClick={() => setIsPreviewOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="relative h-full bg-muted/30 overflow-hidden">
            <PreviewContent
              cvData={cvData}
              zoomContainerRef={zoomContainerRef}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Desktop preview - only show when open
  if (!isPreviewOpen) {
    return <div className="w-0 h-full flex-shrink-0" />;
  }

  // Desktop / fullscreen preview
  return (
    <div className="w-[500px] h-full flex-shrink-0 relative bg-muted/30 overflow-hidden">
      <PreviewContent
        cvData={cvData}
        zoomContainerRef={zoomContainerRef}
      />
    </div>
  );
}

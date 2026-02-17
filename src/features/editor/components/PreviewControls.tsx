import { Button } from "@/components/ui/button";
import { Maximize, Maximize2, ZoomIn, ZoomOut } from "lucide-react";

interface PreviewControlsProps {
  readonly onZoomIn: () => void;
  readonly onZoomOut: () => void;
  readonly onFitWidth: () => void;
  readonly onFitHeight: () => void;
}

export function PreviewControls({
                                  onZoomIn,
                                  onZoomOut,
                                  onFitWidth,
                                  onFitHeight,
                                }: PreviewControlsProps) {
  const buttonBaseClass =
    "h-7 w-7 sm:h-8 sm:w-8 p-0 flex items-center justify-center rounded-sm text-foreground hover:bg-foreground/10 [&_svg]:w-3.5 [&_svg]:h-3.5 sm:[&_svg]:w-4 sm:[&_svg]:h-4";

  return (
    <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 bg-background/90 backdrop-elevated border border-border/60 rounded-sm shadow-elevated flex items-center z-10 p-1 gap-0.5">
      <Button
        variant="ghost"
        onClick={onZoomIn}
        className={buttonBaseClass}
        title="Zoom In"
        data-umami-event="preview-zoom-in"
      >
        <ZoomIn />
      </Button>
      <Button
        variant="ghost"
        onClick={onZoomOut}
        className={buttonBaseClass}
        title="Zoom Out"
        data-umami-event="preview-zoom-out"
      >
        <ZoomOut />
      </Button>
      <Button
        variant="ghost"
        onClick={onFitWidth}
        className={`${buttonBaseClass} hidden sm:flex`} // Changed sm:block to sm:flex to maintain centering
        title="Fit Width"
        data-umami-event="preview-fit-width"
      >
        <Maximize2 />
      </Button>
      <Button
        variant="ghost"
        onClick={onFitHeight}
        className={`${buttonBaseClass} hidden sm:flex`} // Changed sm:block to sm:flex to maintain centering
        title="Fit Height"
        data-umami-event="preview-fit-height"
      >
        <Maximize />
      </Button>
    </div>
  );
}

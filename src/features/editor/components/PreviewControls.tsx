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
  return (
    <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 bg-background/90 backdrop-elevated border border-border/60 rounded-sm shadow-elevated flex z-10 p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomIn}
        className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-sm text-foreground hover:bg-foreground/10"
        title="Zoom In"
      >
        <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomOut}
        className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-sm text-foreground hover:bg-foreground/10"
        title="Zoom Out"
      >
        <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onFitWidth}
        className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-sm text-foreground hover:bg-foreground/10 hidden sm:block"
        title="Fit Width"
      >
        <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onFitHeight}
        className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-sm text-foreground hover:bg-foreground/10 hidden sm:block"
        title="Fit Height"
      >
        <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </Button>
    </div>
  );
}

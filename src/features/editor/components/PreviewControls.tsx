import { Button } from "@/components/ui/button";
import { Maximize, Maximize2, ZoomIn, ZoomOut } from "lucide-react";

interface PreviewControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onFitWidth: () => void;
    onFitHeight: () => void;
}

export function PreviewControls({
    onZoomIn,
    onZoomOut,
    onFitWidth,
    onFitHeight,
}: PreviewControlsProps) {
    return (
        <div className="absolute bottom-4 left-4 bg-blue-500 text-white rounded-full shadow-lg flex z-10">
            <Button
                variant="ghost"
                size="sm"
                onClick={onZoomIn}
                className="text-white hover:bg-blue-600 p-2"
                title="Zoom In"
            >
                <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={onZoomOut}
                className="text-white hover:bg-blue-600 p-2"
                title="Zoom Out"
            >
                <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={onFitWidth}
                className="text-white hover:bg-blue-600 p-2"
                title="Fit Width"
            >
                <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={onFitHeight}
                className="text-white hover:bg-blue-600 p-2"
                title="Fit Height"
            >
                <Maximize className="w-4 h-4" />
            </Button>
        </div>
    );
}

import { type RefObject, useEffect, useState } from "react";

interface UsePreviewZoomOptions {
  contentWidth: number;
  contentHeight: number;
  padding?: number;
}

export function usePreviewZoom<T extends HTMLElement>(
  containerRef: RefObject<T>,
  { contentWidth, contentHeight, padding = 64 }: UsePreviewZoomOptions
) {
  const [scale, setScale] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, [containerRef]);

  // Auto-fit width on mount/change
  useEffect(() => {
    if (containerSize.width > 0 && contentWidth > 0) {
      const availableWidth = containerSize.width - padding;
      const fitScale = availableWidth / contentWidth;
      setScale(fitScale);
    }
  }, [containerSize.width, contentWidth, padding]);

  const zoomIn = () => setScale((prev) => prev * 1.1);
  const zoomOut = () => setScale((prev) => prev / 1.1);

  const fitWidth = () => {
    if (containerSize.width > 0) {
      const availableWidth = containerSize.width - padding;
      setScale(availableWidth / contentWidth);
    }
  };

  const fitHeight = () => {
    if (containerSize.height > 0) {
      const availableHeight = containerSize.height - padding;
      setScale(availableHeight / contentHeight);
    }
  };

  return {
    scale,
    zoomIn,
    zoomOut,
    fitWidth,
    fitHeight,
  };
}

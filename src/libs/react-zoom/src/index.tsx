import { useRef, useMemo, type ReactNode } from "react";

export interface ZoomProps {
  readonly children: ReactNode;
  readonly scale: number;
  readonly className?: string;
}

export function Zoom({ children, scale, className = "" }: ZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  // Calculate left offset for horizontal centering
  const left = useMemo(() => {
    if (!containerRef.current || !zoomRef.current) return 0;
    const containerWidth = containerRef.current.clientWidth;
    const zoomWidth = zoomRef.current.clientWidth;
    return Math.max(0, (containerWidth - scale * zoomWidth) / 2);
  }, [scale, containerRef.current?.clientWidth, zoomRef.current?.clientWidth]);

  return (
    <div
      ref={containerRef}
      className={`react-zoom-container ${className}`}
      style={{ height: "100%" }}
    >
      <div
        ref={zoomRef}
        className="react-zoom"
        style={{
          width: "fit-content",
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          marginLeft: `${left}px`
        }}
      >
        {children}
      </div>
    </div>
  );
}

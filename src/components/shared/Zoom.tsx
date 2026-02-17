import { type ReactNode, useEffect, useRef, useState } from "react";

export interface ZoomProps {
  readonly children: ReactNode;
  readonly scale: number;
  readonly className?: string;
}

export function Zoom({ children, scale, className = "" }: ZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const updateCentering = () => {
      if (!containerRef.current || !zoomRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const zoomWidth = zoomRef.current.offsetWidth;
      const offset = (containerWidth - zoomWidth * scale) / 2;
      setLeft(Math.max(0, offset));
    };

    updateCentering();
    const observer = new ResizeObserver(updateCentering);

    if (containerRef.current) observer.observe(containerRef.current);
    if (zoomRef.current) observer.observe(zoomRef.current);

    return () => observer.disconnect();
  }, [scale]);

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
          marginLeft: `${left}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

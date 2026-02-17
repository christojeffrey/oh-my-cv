import { useEffect, useRef, useState } from "react";

interface ResizeHandleProps {
  readonly direction: "horizontal" | "vertical";
}

export function ResizeHandle({ direction }: ResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current?.parentElement;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = container.clientWidth;
      const startHeight = container.clientHeight;

      const handleMouseMove = (e: MouseEvent) => {
        if (direction === "horizontal") {
          const newWidth = startWidth + (e.clientX - startX);
          if (newWidth > 200 && newWidth < window.innerWidth - 200) {
            container.style.width = `${newWidth}px`;
          }
        } else {
          const newHeight = startHeight + (e.clientY - startY);
          if (newHeight > 100 && newHeight < window.innerHeight - 100) {
            container.style.height = `${newHeight}px`;
          }
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleElement = containerRef.current;
    if (handleElement) {
      handleElement.addEventListener("mousedown", handleMouseDown);
    }

    return () => {
      if (handleElement) {
        handleElement.removeEventListener("mousedown", handleMouseDown);
      }
    };
  }, [direction]);

  const horizontalClass = "absolute top-0 bottom-0 left-0 w-[3px] cursor-ew-resize hover:bg-foreground/20 transition-all duration-200 after:content-[''] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-4 after:h-8 after:-ml-2 after:-mt-4 after:hover:bg-foreground/5 after:rounded-sm";
  const verticalClass = "absolute top-0 bottom-0 left-0 right-0 h-[3px] cursor-ns-resize hover:bg-foreground/20 transition-all duration-200";

  return (
    <div
      ref={containerRef}
      className={`${direction === "horizontal" ? horizontalClass : verticalClass} ${isDragging ? "bg-foreground/30" : "bg-border/60"}`}
      title={direction === "horizontal" ? "Drag to resize width" : "Drag to resize height"}
    />
  );
}

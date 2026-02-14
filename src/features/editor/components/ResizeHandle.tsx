import { useEffect, useRef, useState } from "react";

interface ResizeHandleProps {
  direction: "horizontal" | "vertical";
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
          const deltaX = e.clientX - startX;
          const newWidth = startWidth + deltaX;
          if (newWidth > 200 && newWidth < window.innerWidth - 200) {
            container.style.width = `${newWidth}px`;
          }
        } else if (direction === "vertical") {
          const deltaY = e.clientY - startY;
          const newHeight = startHeight + deltaY;
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

  return (
    <div
      ref={containerRef}
      className={`${
        direction === "horizontal"
          ? "absolute top-0 bottom-0 left-0 w-1 cursor-ew-resize hover:bg-primary/20 transition-colors"
          : "absolute top-0 bottom-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-primary/20 transition-colors"
      } ${isDragging ? "bg-primary" : "bg-border"}`}
      title={direction === "horizontal" ? "Drag to resize width" : "Drag to resize height"}
    />
  );
}

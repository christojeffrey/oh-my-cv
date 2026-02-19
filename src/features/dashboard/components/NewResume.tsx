import { Plus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useResumes } from "@/features/dashboard";
import { useState, useRef, useEffect } from "react";

export function NewResume() {
  const navigate = useNavigate();
  const { createResume } = useResumes();
  const [cardWidth, setCardWidth] = useState(210);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    const measureWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth - 24; // padding
        setCardWidth(Math.max(180, Math.min(280, width)));
      }
    };

    checkMobile();
    measureWidth();

    const resizeObserver = new ResizeObserver(() => {
      checkMobile();
      measureWidth();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const handleCreate = async () => {
    const id = await createResume();
    if (id) {
      navigate({ to: `/editor/${id}` });
    }
  };

  // Mobile: show simple button
  if (isMobile) {
    return (
      <button
        onClick={handleCreate}
        className="w-full p-3 border border-dashed border-border/40 rounded-sm bg-muted/10 hover:bg-muted/20 hover:border-border/60 transition-all duration-200 flex items-center justify-center gap-2"
        data-umami-event="create-new-resume"
      >
        <Plus className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">New Resume</span>
      </button>
    );
  }

  // Desktop: show preview-style card
  return (
    <div className="w-full flex flex-col items-center">
      <div
        ref={containerRef}
        className="w-full flex items-center justify-center p-3"
      >
        <button
          className="group flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 border border-dashed border-border/40 hover:border-border/60 rounded-sm shadow-subtle hover:shadow-elevated transition-all duration-300 focus:ring-1 focus:ring-ring focus:outline-none focus:border-border overflow-hidden cursor-pointer"
          style={{ width: `${cardWidth}px`, height: `${cardWidth * 297 / 210}px` }}
          aria-label="Create new resume"
          onClick={async () => {
            await handleCreate();
          }}
          type="button"
          data-umami-event="create-new-resume"
        >
          <div className="flex flex-col items-center gap-3">
            <Plus className="w-12 h-12 text-muted-foreground/60 group-hover:text-foreground transition-colors duration-200" />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
              New Resume
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

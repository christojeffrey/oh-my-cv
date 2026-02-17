import { useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useEffect, useState } from "react";
import { useResumePagination } from "@/hooks/use-resume-pagination";
import type { DbResume } from "@/types/resume";
import { markdownService } from "@/utils/markdown";
import { FileText } from "lucide-react";

const CARD_ONLY_CSS = `[data-part="page"]:not(:first-child) { display: none; }`;

interface ResumeCardProps {
  readonly resume: DbResume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const navigate = useNavigate();
  const [cardWidth, setCardWidth] = useState(210);
  const containerRef = useRef<HTMLDivElement>(null);

  const html = useMemo(() => markdownService.renderResume(resume.markdown || ""), [resume.markdown]);

  const { hostRef, dims } = useResumePagination(
    resume.configuration,
    resume.customCss || "",
    html,
    CARD_ONLY_CSS
  );

  // Measure container width for responsive scaling
  useEffect(() => {
    const measureWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth - 24; // padding
        setCardWidth(Math.max(180, Math.min(280, width)));
      }
    };

    measureWidth();

    const resizeObserver = new ResizeObserver(measureWidth);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const scale = cardWidth / dims.widthPx;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Mobile: List item - always shown, styled with CSS */}
      <button
        onClick={() => navigate({ to: `/editor/${resume.id}` })}
        className="sm:hidden w-full p-4 border border-border/40 rounded-sm bg-background hover:bg-accent/50 transition-colors duration-200 text-left"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-sm bg-muted/40 flex-shrink-0">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">{resume.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(resume.created_at || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>
      </button>

      {/* Desktop: Preview card - shown with CSS, not JS */}
      <div className="hidden sm:flex w-full flex-col items-center">
        <div
          ref={containerRef}
          className="w-full relative flex items-center justify-center p-3"
        >
          <div
            className="border border-border/40 rounded-sm overflow-hidden bg-white shadow-subtle hover:shadow-elevated transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate({ to: `/editor/${resume.id}` })}
            style={{ width: `${cardWidth}px`, height: `${cardWidth * 297 / 210}px` }}
          >
            <div
              className="origin-top-left"
              style={{
                width: `${dims.widthPx}px`,
                height: `${dims.heightPx}px`,
                transform: `scale(${scale})`,
              }}
            >
              <div ref={hostRef} />
            </div>
          </div>
        </div>
        <div className="mt-3 text-center w-full px-2">
          <p className="text-sm font-medium truncate text-foreground">{resume.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(resume.created_at || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useResumePagination } from "@/hooks/use-resume-pagination";
import type { DbResume } from "@/types/resume";
import { markdownService } from "@/utils/markdown";

const CARD_ONLY_CSS = `[data-part="page"]:not(:first-child) { display: none; }`;

interface ResumeCardProps {
  readonly resume: DbResume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const navigate = useNavigate();
  const html = useMemo(() => markdownService.renderResume(resume.markdown || ""), [resume.markdown]);

  const { hostRef, dims } = useResumePagination(
    resume.styles,
    resume.css || "",
    html,
    CARD_ONLY_CSS
  );

  return (
    <div className="w-56 group/card flex flex-col items-center">
      <div className="h-80 relative flex items-center justify-center w-full">
        <div
          className="border rounded-md overflow-hidden bg-white shadow-sm"
          style={{ width: "210px", height: "297px" }}
        >
          <div
            className="cursor-pointer origin-top-left"
            onClick={() => navigate({ to: `/editor/${resume.id}` })}
            style={{
              width: `${dims.widthPx}px`,
              height: `${dims.heightPx}px`,
              transform: `scale(${210 / dims.widthPx})`,
            }}
          >
            <div ref={hostRef} style={{ fontFamily: resume.styles.fontEN?.fontFamily }} />
          </div>
        </div>
      </div>
      <div className="mt-2 text-center">
        <p className="text-sm font-medium truncate w-48">{resume.name}</p>
      </div>
    </div>
  );
}

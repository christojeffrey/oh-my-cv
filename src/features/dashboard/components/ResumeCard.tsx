import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useResumePagination } from "@/hooks/use-resume-pagination";
import { useResumePreview } from "@/features/dashboard/hooks/use-resume-preview";
import type { DbResume } from "@/types/resume";
import { markdownService } from "@/utils/markdown";

export function ResumeCard({ resume, onUpdate }: { resume: DbResume; onUpdate: () => void }) {
  const navigate = useNavigate();
  const { isLoaded } = useResumePreview(resume);

  // Thumbnail CSS: Hide pages after the first one
  const cardOnlyCss = `[data-part="page"]:not(:first-child) { display: none; }`;
  const html = useMemo(() => markdownService.renderResume(resume.markdown || ""), [resume.markdown]);

  const { hostRef, dims } = useResumePagination(
    resume.styles,
    resume.css || "",
    html,
    cardOnlyCss
  );

  // Calculate dynamic scale to fit the 210x297 preview container
  const thumbnailScale = 210 / dims.widthPx;

  if (!isLoaded) {
    return <Card className="w-[210px] h-[299px] bg-secondary animate-pulse mx-auto" />;
  }

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
              transform: `scale(${thumbnailScale})`,
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

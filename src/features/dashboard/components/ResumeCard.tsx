import { useNavigate } from "@tanstack/react-router";
import { Copy, MoreHorizontal, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEFAULT_STYLES, MM_TO_PX, PAPER_SIZES } from "@/constants";
import { useResumeActions } from "@/features/dashboard/hooks/use-resume-actions";
import { useResumePreview } from "@/features/dashboard/hooks/use-resume-preview";
import { useSmartPages } from "@/hooks/useSmartPages";
import type { DbResume } from "@/services/storage";
import { markdownService } from "@/utils/markdown";

interface ResumeCardProps {
  resume: DbResume;
  onUpdate: () => void;
}

const SCALE_FACTOR = 1 / MM_TO_PX; // Scale down for card preview

export function ResumeCard({ resume, onUpdate }: Readonly<ResumeCardProps>) {
  const navigate = useNavigate();
  const { isLoaded } = useResumePreview(resume);
  const { duplicate, deleteResume } = useResumeActions(onUpdate);
  const [showActions, setShowActions] = useState(false);

  // Ensure styles exists, use defaults if not
  const styles = resume.styles || DEFAULT_STYLES;

  const size = PAPER_SIZES[styles.paper] || PAPER_SIZES.A4;
  const widthPx = size.w * MM_TO_PX;
  const heightPx = size.h * MM_TO_PX;

  // Render resume markdown to HTML (includes front matter header parsing)
  const html = markdownService.renderResume(resume.markdown || "");

  // Use smart pages for pagination - show first page only
  // Note: useSmartPages expects width in mm, height in px (matching vue-smart-pages behavior)
  const { containerRef } = useSmartPages(
    html,
    { width: size.w, height: heightPx },
    {
      top: styles.marginV,
      bottom: Math.max(styles.marginV - 10, 10),
      left: styles.marginH,
      right: styles.marginH,
    },
    {
      throttle: 200,
    }
  );

  useEffect(() => {
    // Inject custom CSS
    const css = `
        .resume-content {
          margin: ${styles.marginV}px ${styles.marginH}px;
          line-height: ${styles.lineHeight};
          font-size: ${styles.fontSize}px;
        }
        .resume-content h2,
        .resume-content h3 {
          margin-bottom: ${styles.paragraphSpace}px;
        }
        .resume-content .resume-header h1 {
          color: ${styles.themeColor};
          margin-bottom: 20px;
          text-align: center;
        }
        .resume-content .resume-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .resume-content .resume-header-item:not(.no-separator)::after {
          content: " | ";
          margin: 0 8px;
        }
        .resume-content h2 {
          border-bottom: 1px solid ${styles.themeColor};
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        .resume-content h3 {
          margin-top: 20px;
        }
        .resume-content ul {
          list-style-type: circle;
          padding-left: 20px;
        }
        .resume-content ol {
          list-style-type: decimal;
          padding-left: 20px;
        }
        .resume-content li {
          margin-bottom: 5px;
        }
        .resume-content p {
          margin-bottom: 10px;
        }
        .resume-content strong {
          font-weight: bold;
        }
        .resume-content em {
          font-style: italic;
        }
      `;

    const styleId = `toolbar-${resume.id}`;
    const styleElement = document.getElementById(styleId);
    if (styleElement) {
      styleElement.textContent = css;
    } else {
      const newStyleElement = document.createElement("style");
      newStyleElement.id = styleId;
      newStyleElement.textContent = css;
      document.head.appendChild(newStyleElement);
    }

    // Inject custom CSS from resume
    const customCssStyleId = `custom-css-${resume.id}`;
    const customCssStyleElement = document.getElementById(customCssStyleId);
    if (customCssStyleElement) {
      customCssStyleElement.textContent = resume.css;
    } else {
      const newCustomCssElement = document.createElement("style");
      newCustomCssElement.id = customCssStyleId;
      newCustomCssElement.textContent = resume.css;
      document.head.appendChild(newCustomCssElement);
    }
  }, [resume, styles]);

  const handleEdit = () => {
    navigate({ to: `/editor/${resume.id}` });
  };

  const handleDuplicate = () => duplicate(resume.id);

  const handleDelete = () => deleteResume(resume.id, resume.name);

  if (!isLoaded) {
    return (
      <div className="w-56">
        <div className="h-80">
          <Card className="w-[210px] h-[299px] bg-secondary animate-pulse mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-56 group/card flex flex-col items-center">
      <div className="h-80 relative flex items-center justify-center w-full">
        <div
          className="resume-card-wrapper border rounded-md flex items-center justify-center mx-auto bg-white dark:bg-gray-900"
          style={{
            width: "210px",
            height: "297px",
            overflow: "hidden",
          }}
        >
          <div
            className="resume-card cursor-pointer peer shrink-0"
            role="button"
            tabIndex={0}
            onClick={handleEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleEdit();
              }
            }}
            style={{
              width: `${widthPx}px`,
              height: `${heightPx}px`,
              transform: `scale(${SCALE_FACTOR})`,
              transformOrigin: "center center",
            }}
          >
            {/* Hide all pages except the first one */}
            <style>{`
              #resume-preview-${resume.id} [data-part="page"]:not(:first-child) {
                display: none;
              }
            `}</style>
            <div
              id={`resume-preview-${resume.id}`}
              ref={containerRef}
              className="resume-content"
              style={{
                fontFamily: styles.fontEN?.fontFamily || "Arial, sans-serif",
                width: `${widthPx}px`,
                height: `${heightPx}px`,
              }}
            />
          </div>
        </div>

        <DropdownMenu open={showActions} onOpenChange={setShowActions}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-3 opacity-0 group-hover/card:opacity-100 group-focus-within/card:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-2 px-2 text-center">
        <p className="text-sm font-medium truncate">{resume.name}</p>
        <p className="text-xs text-muted-foreground">
          Updated: {new Date(resume.updated_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

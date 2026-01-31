import { markdownService } from "@/utils/markdown";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className = "" }: MarkdownProps) {
  const html = markdownService.renderMarkdown(content);

  return (
    <div
      className={`resume-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

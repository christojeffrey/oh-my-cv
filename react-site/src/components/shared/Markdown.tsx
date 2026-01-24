// Markdown processing with full oh-my-cv pipeline
import { markdownService } from '@/utils/markdown'

interface MarkdownProps {
  content: string
}

export function Markdown({ content }: MarkdownProps) {
  const html = markdownService.renderResume(content)

  return (
    <div
      className="prose prose-sm max-w-none resume-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
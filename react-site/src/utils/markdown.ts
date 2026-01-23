// Markdown utilities - basic implementations
export function processMarkdown(content: string): string {
  // Basic processing - in real app, use remark/rehype
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}
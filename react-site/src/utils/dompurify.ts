import DOMPurify from "dompurify";

// Create a configured instance for HTML-only content (no SVG/MathML)
// This restricts attack surface since markdown rendering only produces HTML
const dompurifyInstance = DOMPurify();
dompurifyInstance.setConfig({
  USE_PROFILES: { html: true },
  KEEP_CONTENT: true // Preserve element content when element is removed
});

export function sanitizeHtml(dirtyHtml: string): string {
  return dompurifyInstance.sanitize(dirtyHtml);
}

export { dompurifyInstance };

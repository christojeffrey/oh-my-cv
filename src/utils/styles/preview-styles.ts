import type { ResumeStyles } from "@/types/resume";

export function generatePreviewStyles(styles: ResumeStyles) {
  return `
      .resume-content {
        line-height: ${styles.lineHeight};
        font-size: ${styles.fontSize}px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding-bottom: 40px;
      }
      [data-scope="react-smart-pages"][data-part="page"] {
        box-sizing: border-box;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background-color: white;
      }
      .resume-content p,
      .resume-content li {
        margin-bottom: ${styles.paragraphSpace}px;
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
}

import type { ResumeStyles } from "@/types/resume";

export function generatePreviewStyles(styles: ResumeStyles) {
  return `
@layer resume-config {
    .resume-content {
      line-height: ${styles.lineHeight};
      font-size: ${styles.fontSize}px;

      p, li {
        margin-bottom: ${styles.paragraphSpace}px;
      }

      h2, h3 {
        margin-bottom: ${styles.paragraphSpace}px;
      }

      .resume-header h1 {
        color: ${styles.themeColor};
      }

      h2 {
        border-bottom: 1px solid ${styles.themeColor};
      }
    }
}
  `;
}

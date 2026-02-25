import type { Resume } from "@/types/resume";
import { markdownService } from "./markdown";
import { coreStyles as coreCss } from "@/utils/styles/core-styles";
import { generateConfigurationStyles as generateConfigCss } from "@/utils/styles/preview-styles";
import { applyPagination, createStyledContainer } from "./pagination";

/**
 * Handles printing of the resume by rendering data directly into a temporary iframe.
 * Uses shared pagination utility with styled container for accurate measurements.
 */
export const printResume = (cvData: Resume, title: string) => {
  // Create a hidden iframe
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.top = "0";
  iframe.style.left = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.visibility = "hidden";

  // Appending to body is necessary for contentWindow to exist
  document.body.appendChild(iframe);

  const contentWindow = iframe.contentWindow;
  const contentDocument = iframe.contentDocument;

  if (!contentWindow || !contentDocument) {
    console.error("Cannot print: Failed to access iframe content");
    iframe.remove();
    return;
  }

  // Set the title for the print job
  contentDocument.title = title;

  // Render the resume HTML
  const resumeHtml = markdownService.renderResume(cvData.markdown);

  // Generate CSS
  const css = `
    ${coreCss}
    ${generateConfigCss(cvData.configuration)}
    ${cvData.customCss || ""}
  `;

  // Create a styled container with CSS applied (ensures measurements match Preview)
  const { container: tempContainer } = createStyledContainer(
    cvData.configuration,
    cvData.customCss
  );

  // Add content wrapper for pagination
  const contentWrapper = document.createElement("div");
  tempContainer.appendChild(contentWrapper);

  // Apply shared pagination logic (CSS is already applied via createStyledContainer)
  applyPagination(contentWrapper, resumeHtml, cvData.configuration);

  // Get the paginated HTML
  const paginatedHtml = contentWrapper.innerHTML;

  // Clean up temp container
  document.body.removeChild(tempContainer);

  // Build the complete HTML document
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page {
            margin: 0;
            size: ${cvData.configuration.paper};
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white;
            width: 100%;
            height: 100%;
          }
          /* Ensure pages break correctly */
          [data-scope="react-smart-pages"][data-part="page"] {
            break-after: page;
            page-break-after: always;
            break-inside: avoid;
            page-break-inside: avoid;

            /* Crucial for preventing blank pages */
            display: block !important;
            overflow: hidden !important;
            height: 100% !important; /* Force exact fit */
            max-height: 100% !important;

            margin: 0 !important;
            box-shadow: none !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          /* Hide the last page break */
          [data-scope="react-smart-pages"][data-part="page"]:last-child {
            break-after: auto;
            page-break-after: auto;
            margin-bottom: 0 !important;
          }
        </style>
        <style>${css}</style>
      </head>
      <body>
        ${paginatedHtml}
      </body>
    </html>
  `;

  // Open the document to write
  contentDocument.open();
  contentDocument.write(html);
  contentDocument.close();

  // Wait for content to load before printing
  const finish = () => {
    try {
      contentWindow.focus();
      contentWindow.print();
    } catch (e) {
      console.error("Print failed", e);
    } finally {
      // Remove iframe after printing
      setTimeout(() => {
        iframe.remove();
      }, 1000);
    }
  };

  if (contentDocument.readyState === 'complete') {
    finish();
  } else {
    contentWindow.onload = finish;
  }
};

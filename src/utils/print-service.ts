/**
 * Handles printing of the resume content by creating a temporary iframe.
 * This ensures only the resume content is printed, not the entire editor UI.
 */
export const printResume = (hostElement: HTMLElement, title: string, pageSize: string = "auto") => {
  if (!hostElement?.shadowRoot) {
    console.error("Cannot print: Host element or shadow root not found");
    return;
  }

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

  // Clone the shadow root content
  // We need to verify if we can simply copy innerHTML or if we need deep cloning
  // For styles and simple structure, innerHTML is usually sufficient and faster
  const shadowContent = hostElement.shadowRoot.innerHTML;

  // Open the document to write
  contentDocument.open();
  contentDocument.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page {
            margin: 0;
            size: ${pageSize};
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
      </head>
      <body>
        ${shadowContent}
      </body>
    </html>
  `);
  contentDocument.close();

  // Wait for content (especially images/fonts) to load before printing
  // Since we are copying raw HTML/CSS from an already rendered shadow DOM, 
  // resources might be cached, but a small delay or load event is safer.

  const finish = () => {
    try {
      contentWindow.focus();
      contentWindow.print();
    } catch (e) {
      console.error("Print failed", e);
    } finally {
      // Remove iframe after printing (or if user cancels)
      // Note: Chrome removes the iframe immediately if we don't wait, 
      // but 'onafterprint' is not reliably supported across all browsers for cleanup.
      // A timeout is a simple workaround to allow the print dialog to open.
      setTimeout(() => {
        iframe.remove();
      }, 1000);
    }
  };

  // If there are images, we might want to wait for them. 
  // For now, we assume styles are inline or text-based.
  if (contentDocument.readyState === 'complete') {
    finish();
  } else {
    contentWindow.onload = finish;
  }
};

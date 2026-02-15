export const coreStyles = `
@layer resume-core, resume-config, resume-custom;

@layer resume-core {
  .resume-content {
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
    color: black;
    text-align: justify;
    hyphens: auto;
  }

  .resume-content .resume-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .resume-content .resume-header h1 {
    margin-bottom: 20px;
    text-align: center;
  }

  .resume-content .resume-header-item:not(.no-separator)::after {
    content: " | ";
    margin: 0 8px;
  }

  .resume-content h2 {
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

  /* Dark mode for resume preview within the editor */
  .dark .resume-content [data-scope="react-smart-pages"][data-part="page"] {
    background-color: hsl(213, 12%, 15%);
    color: hsl(216, 12%, 84%);
  }

  @media print {
    .dark .resume-content [data-scope="react-smart-pages"][data-part="page"] {
      background-color: white;
      color: black;
    }
  }
}
`;

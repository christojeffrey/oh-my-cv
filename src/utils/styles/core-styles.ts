export const coreStyles = `
/* 1. Page & Layout Containers */
[data-scope="react-smart-pages"][data-part="page"] {
  box-sizing: border-box;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background-color: white;
  color: black;
  text-align: justify;
  hyphens: auto;
  page-break-after: always;
  margin-bottom: 20px;
  padding: 1em; /* Added for standard spacing */
}

/* 2. Resume Header Section */
.resume-header {
  text-align: center;
  margin-bottom: 1px;
}

.resume-header h1 {
  line-height: 1;
  margin-bottom: 8px;
  font-size: 1.2em;
}

.resume-header-item:not(.no-separator)::after {
  content: " | ";
  margin: 0 8px;
}

/* 3. Typography & Headings */
h2, h3 {
  margin-top: 20px;
  margin-bottom: 5px;
  font-size: 1.2em;
}

h2 {
  padding-bottom: 5px;
  border-bottom: 1px solid #eee; /* Common for resumes, optional */
}

p, li, dl {
  margin: 0 0 10px 0; /* Standardized bottom margin */
}

/* 4. Lists & Definitions */
ul, ol {
  padding-left: 1.5em;
  margin: 0.2em 0;
}

ul { list-style-type: circle; }
ol { list-style-type: decimal; }

li { margin-bottom: 5px; }

dl { display: flex; }
dl dt, dl dd:not(:last-child) {
  flex: 1;
}

/* 5. Components (Images, Icons, Math) */
img { max-width: 100%; }

svg.iconify { vertical-align: -0.2em; }

:not(span.katex-display) > span.katex {
  font-size: 1em !important;
}

/* 6. Citations & Cross-references */
[data-scope="cross-ref"][data-part="definitions"] { padding-left: 1.2em; }
[data-scope="cross-ref"][data-part="definition"] p { margin-left: 0.5em; }
[data-scope="cross-ref"][data-part="definition"]::marker { content: attr(data-label); }
[data-scope="cross-ref"][data-part="reference"] { font-size: 100%; }
`;

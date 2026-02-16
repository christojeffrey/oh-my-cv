export const coreStyles = `
[data-scope="react-smart-pages"][data-part="page"] {
  box-sizing: border-box;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background-color: white;
  color: black;
  text-align: justify;
  hyphens: auto;
  page-break-after: always;
  display: block;
  margin-bottom: 20px;
}

.resume-header {
  text-align: center;
  margin-bottom: 30px;
}

.resume-header h1 {
  margin-bottom: 20px;
  text-align: center;
}

.resume-header-item:not(.no-separator)::after {
  content: " | ";
  margin: 0 8px;
}

h2 {
  padding-bottom: 5px;
  margin-bottom: 10px;
}

h3 {
  margin-top: 20px;
}

ul {
  list-style-type: circle;
  padding-left: 20px;
}

ol {
  list-style-type: decimal;
  padding-left: 20px;
}

li {
  margin-bottom: 5px;
}

p {
  margin-bottom: 10px;
}

strong {
  font-weight: bold;
}

em {
  font-style: italic;
}
`;

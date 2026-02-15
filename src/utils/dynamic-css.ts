// Dynamic CSS injection service - replicating Vue version
const sheetsMap = new Map<string, HTMLStyleElement>();

/**
 * Dynamically injects CSS into the document.
 * @param id To make sure the CSS won't override each other.
 * @param content A string of CSS to inject.
 */
export const injectCss = (id: string, content: string) => {
  let style = sheetsMap.get(id);

  if (!style) {
    style = document.createElement("style");

    style.setAttribute("type", "text/css");
    style.setAttribute("data-dynamic-css-id", id);
    style.textContent = content;

    document.head.appendChild(style);
  } else {
    style.textContent = content;
  }

  sheetsMap.set(id, style);
};

/**
 * Remove the CSS from the document.
 * @param id The ID of the CSS to remove.
 */
export const removeCss = (id: string) => {
  const style = sheetsMap.get(id);

  if (style) {
    document.head.removeChild(style);
    sheetsMap.delete(id);
  }
};

import type MarkdownIt from "markdown-it";

// Minimal Token interface since importing it directly can be tricky with some setups
interface Token {
  attrGet: (name: string) => string | null;
  attrSet: (name: string, value: string) => void;
  content: string;
  type: string;
  tag: string;
  markup: string;
  info: string;
  nesting: number;
  level: number;
  block: boolean;
  hidden: boolean;
}

export default function MarkdownItIconify(md: MarkdownIt) {
  // Simple icon renderer for common icons
  const iconifyRender = (tokens: Token[], idx: number) => {
    const token = tokens[idx];
    const content = token.attrGet("content") || "";

    // Common shortcuts for resume icons
    const iconMap: Record<string, string> = {
      ":email:": "✉️",
      ":phone:": "📞",
      ":website:": "🌐",
      ":location:": "📍",
      ":github:": "📦",
      ":linkedin:": "💼",
      ":twitter:": "🐦",
      ":globe:": "🌍",
      ":home:": "🏠",
      ":calendar:": "📅",
      ":download:": "⬇️",
    };

    for (const [key, emoji] of Object.entries(iconMap)) {
      if (content.includes(key)) {
        return `${content.replace(key, emoji)}`;
      }
    }

    return content;
  };

  // Parser rule to detect :shortcode:
  const iconRule = (state: any, silent: boolean): boolean => {
    const start = state.pos;

    // Check for starting colon
    if (state.src.charCodeAt(start) !== 0x3a /* : */) return false;

    // Find the next colon
    const max = state.posMax;
    let pos = start + 1;
    let found = false;

    while (pos < max) {
      const ch = state.src.charCodeAt(pos);

      if (ch === 0x3a /* : */) {
        found = true;
        break;
      }

      // Allow alphanumeric, underscore, hyphen, plus
      if (!/[a-zA-Z0-9_\-+]/.test(String.fromCharCode(ch))) {
        return false;
      }
      pos++;
    }

    if (!found || pos === start + 1) return false;

    const content = state.src.slice(start, pos + 1); // e.g. :email:

    if (!silent) {
      const token = state.push("icon", "span", 0);
      token.attrSet("content", content);
      token.markup = ":";
      token.content = content;
    }

    state.pos = pos + 1;
    return true;
  };

  md.renderer.rules.icon = iconifyRender;
  md.inline.ruler.push("icon", iconRule);

  return md;
}

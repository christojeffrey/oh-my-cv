// Simple markdown-it plugin to support Iconify-like syntax
// Usage: :iconify-iconset:icon-name: or common emoji shortcuts

import type MarkdownIt from "markdown-it";

export default function MarkdownItIconify(md: MarkdownIt) {
  type Token = MarkdownIt.Token;

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

  md.renderer.rules.icon = iconifyRender;
  md.inline.ruler.push(iconifyRender, {
    alt: [],
  });

  return md;
}

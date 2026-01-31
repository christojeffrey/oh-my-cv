// Simple markdown-it plugin to support Iconify-like syntax
// Usage: :iconify-iconset:icon-name: or common emoji shortcuts

export default function MarkdownItIconify(md: any) {
  // Simple icon renderer for common icons
  const iconifyRender = (tokens: any[], idx: number) => {
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
      ":download:": "⬇️"
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
    alt: []
  });

  return md;
}

// Front matter parsing - using gray-matter equivalent

interface FrontMatterResult {
  frontmatter: Record<string, string>;
  body: string;
}

export function parseFrontMatter(content: string): FrontMatterResult {
  const lines = content.split("\n");
  if (lines[0] !== "---") {
    return { frontmatter: {}, body: content };
  }

  const endIndex = lines.slice(1).findIndex((line) => line === "---") + 1;
  if (endIndex === 0) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterStr = lines.slice(1, endIndex).join("\n");
  const body = lines.slice(endIndex + 1).join("\n");

  // Simple YAML-like parsing (basic implementation)
  const frontmatter: Record<string, string> = {};
  frontmatterStr.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length) {
      frontmatter[key.trim()] = valueParts.join(":").trim();
    }
  });

  return { frontmatter, body };
}

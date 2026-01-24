// Enhanced markdown processing with proper front-matter parsing

interface ResumeHeaderItem {
  text: string;
  link?: string;
  newLine?: boolean;
}

interface ResumeFrontMatter {
  name?: string;
  header?: ResumeHeaderItem[];
}

export class MarkdownService {
  public renderResume(md: string): string {
    const { body, frontMatter } = this._parseFrontMatter(md);

    const content = this._renderBasicMarkdown(body);
    const header = this._renderHeader(frontMatter);

    return header + content;
  }

  private _parseFrontMatter(md: string): { body: string; frontMatter: ResumeFrontMatter } {
    const frontMatterMatch = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontMatterMatch) {
      return { body: md, frontMatter: {} };
    }

    const frontMatterStr = frontMatterMatch[1];
    const body = frontMatterMatch[2];

    const frontMatter = this._parseYAML(frontMatterStr);

    return { body, frontMatter };
  }

  private _parseYAML(yaml: string): ResumeFrontMatter {
    const frontMatter: ResumeFrontMatter = {};

    // Parse name
    const nameMatch = yaml.match(/name:\s*(.+)/);
    if (nameMatch) {
      frontMatter.name = nameMatch[1].trim().replace(/^["']|["']$/g, '');
    }

    // Parse header array - simplified for the specific format used
    const headerMatch = yaml.match(/header:\s*\n((?:\s*-.*\n?)*)/);
    if (headerMatch) {
      frontMatter.header = [];
      const headerYaml = headerMatch[1];

      // Split by lines starting with '  - '
      const headerItems = headerYaml.split(/\n\s*-\s/).filter(item => item.trim());

      for (const itemStr of headerItems) {
        const item: ResumeHeaderItem = { text: '' };

        // Parse text (can be multiline)
        const textMatch = itemStr.match(/text:\s*(\|?\n?(?:.|\n)*?)(?=\n\s*(?:link|newLine|\n\s*-|\n*$))/);
        if (textMatch) {
          let text = textMatch[1].trim();
          if (text.startsWith('|')) {
            // Multiline text
            text = text.substring(1).trim();
          }
          item.text = text.replace(/^["']|["']$/g, '');
        }

        // Parse link
        const linkMatch = itemStr.match(/link:\s*(.+)/);
        if (linkMatch) {
          item.link = linkMatch[1].trim().replace(/^["']|["']$/g, '');
        }

        // Parse newLine
        const newLineMatch = itemStr.match(/newLine:\s*(.+)/);
        if (newLineMatch) {
          item.newLine = newLineMatch[1].trim() === 'true';
        }

        frontMatter.header.push(item);
      }
    }

    return frontMatter;
  }

  private _renderHeader(frontMatter: ResumeFrontMatter): string {
    if (!frontMatter.name && (!frontMatter.header || frontMatter.header.length === 0)) {
      return '';
    }

    let content = '';

    if (frontMatter.name) {
      content += `<h1>${frontMatter.name}</h1>\n`;
    }

    if (frontMatter.header) {
      for (let i = 0; i < frontMatter.header.length; i++) {
        const item = frontMatter.header[i];
        const hasSeparator = i !== frontMatter.header.length - 1 && !frontMatter.header[i + 1].newLine;

        const textContent = item.link
          ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.text}</a>`
          : item.text;

        const classes = `resume-header-item${hasSeparator ? '' : ' no-separator'}`;
        content += `<span class="${classes}">${textContent}</span>`;

        if (item.newLine) {
          content += '<br>\n';
        }
      }
    }

    return `<div class="resume-header">${content}</div>`;
  }

  private _renderBasicMarkdown(md: string): string {
    // Enhanced markdown processing
    let html = md
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Lists
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
      // Line breaks and paragraphs
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // Wrap in paragraph tags
    if (!html.startsWith('<')) {
      html = '<p>' + html;
    }
    if (!html.endsWith('</p>') && !html.endsWith('</ul>')) {
      html += '</p>';
    }

    return html;
  }
}

export const markdownService = new MarkdownService();
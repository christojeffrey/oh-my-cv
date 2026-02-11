import { FrontMatterParser } from "@ohmycv/front-matter";
import MarkdownItCite from "@ohmycv/markdown-it-cross-ref";
import MarkdownItKatex from "@ohmycv/markdown-it-katex";
import MarkdownItLatexCmds from "@ohmycv/markdown-it-latex-cmds";
import MarkdownIt from "markdown-it";
import MarkdownItDeflist from "markdown-it-deflist";
import LinkAttributes from "markdown-it-link-attributes";
import { sanitizeHtml } from "./dompurify.ts";
// import MarkdownItIconify from "./markdown-it-iconify";

export interface ResumeHeaderItem {
  text: string;
  link?: string;
  newLine?: boolean;
}

export interface ResumeFrontMatter {
  name?: string;
  header?: ResumeHeaderItem[];
}

export class MarkdownService {
  private md: MarkdownIt;
  private frontMatterParser: FrontMatterParser<ResumeFrontMatter>;

  constructor() {
    this.md = this.setupMarkdownIt();
    this.frontMatterParser = new FrontMatterParser<ResumeFrontMatter>({
      errorBehavior: "last",
    });
  }

  private setupMarkdownIt(): MarkdownIt {
    const md = new MarkdownIt({
      html: true,
    });

    md.use(MarkdownItDeflist);
    md.use(MarkdownItKatex);
    md.use(MarkdownItCite);
    md.use(MarkdownItLatexCmds);
    // md.use(MarkdownItIconify);
    md.use(LinkAttributes, {
      matcher: (link: string) => /^https?:\/\//.test(link),
      attrs: {
        target: "_blank",
        rel: "noopener",
      },
    });

    return md;
  }

  public renderMarkdown(md: string): string {
    const dirtyHtml = this.md.render(md);
    return sanitizeHtml(dirtyHtml);
  }

  /**
   * Convert
   *
   *  <dt>...</dt>
   *  <dd>...</dd>
   *  <dt>...</dt>
   *  <dd>...</dd>
   *
   * (this would happen if two deflists are adjacent)
   *
   * to
   *
   * <dl>
   *   <dt>...</dt>
   *   <dd>...</dd>
   * </dl>
   * <dl>
   *   <dt>...</dt>
   *   <dd>...</dd>
   * </dl>
   *
   * @param html HTML string
   * @returns HTML string with resolved deflists
   */
  private resolveDeflist(html: string): string {
    return html.replace(/<dl>([\s\S]*?)<\/dl>/g, (match) =>
      match.replace(/<\/dd>\n<dt>/g, "</dd>\n</dl>\n<dl>\n<dt>")
    );
  }

  private renderHeaderItem(item: ResumeHeaderItem, hasSeparator: boolean): string {
    const content = item.link
      ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.text}</a>`
      : item.text;

    const element = `<span class="resume-header-item ${hasSeparator ? "" : "no-separator"}">
      ${content}
    </span>`;

    return item.newLine ? `<br>\n${element}` : element;
  }

  public renderHeader(frontMatter: ResumeFrontMatter): string {
    const content = [
      frontMatter.name ? `<h1>${frontMatter.name}</h1>\n` : "",
      (frontMatter.header ?? [])
        .map((item, i, array) =>
          this.renderHeaderItem(item, i !== array.length - 1 && !array[i + 1].newLine)
        )
        .join("\n"),
    ].join("");

    return `<div class="resume-header">${content}</div>`;
  }

  public renderResume(md: string): string {
    const { body, frontMatter } = this.frontMatterParser.parse(md);

    const content = this.resolveDeflist(this.renderMarkdown(body));
    const header = this.renderHeader(frontMatter);

    return header + content;
  }
}

export const markdownService = new MarkdownService();

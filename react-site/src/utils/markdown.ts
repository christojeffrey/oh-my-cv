import MarkdownIt from "markdown-it";
// @ts-ignore
import MarkdownItDeflist from "markdown-it-deflist";
import LinkAttributes from "markdown-it-link-attributes";
import MarkdownItKatex from "@ohmycv/markdown-it-katex";
import MarkdownItCite from "@ohmycv/markdown-it-cross-ref";
import MarkdownItLatexCmds from "@ohmycv/markdown-it-latex-cmds";
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

  constructor() {
    this.md = this.setupMarkdownIt();
  }

  private setupMarkdownIt(): MarkdownIt {
    const md = new MarkdownIt({
      html: true
    });

    md.use(MarkdownItDeflist as any);
    md.use(MarkdownItKatex as any);
    md.use(MarkdownItCite as any);
    md.use(MarkdownItLatexCmds as any);
    // md.use(MarkdownItIconify as any);
    md.use(LinkAttributes as any, {
      matcher: (link: string) => /^https?:\/\//.test(link),
      attrs: {
        target: "_blank",
        rel: "noopener"
      }
    });

    return md;
  }

  public renderMarkdown(md: string): string {
    return this.md.render(md);
  }
}

export const markdownService = new MarkdownService();

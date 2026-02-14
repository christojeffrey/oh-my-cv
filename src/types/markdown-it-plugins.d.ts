// Type declarations for markdown-it plugins

declare module "markdown-it-deflist" {
  import { PluginSimple } from "markdown-it";
  const deflist: PluginSimple;
  export default deflist;
}

declare module "markdown-it-link-attributes" {
  import { PluginWithOptions } from "markdown-it";

  interface LinkAttributesOptions {
    matcher?: (href: string) => boolean;
    attrs?: Record<string, string>;
  }

  const linkAttributes: PluginWithOptions<LinkAttributesOptions>;
  export default linkAttributes;
}

declare module "@ohmycv/markdown-it-katex" {
  import { PluginSimple } from "markdown-it";
  const katex: PluginSimple;
  export default katex;
}

declare module "@ohmycv/markdown-it-cross-ref" {
  import { PluginSimple } from "markdown-it";
  const crossRef: PluginSimple;
  export default crossRef;
}

declare module "@ohmycv/markdown-it-latex-cmds" {
  import { PluginSimple } from "markdown-it";
  const latexCmds: PluginSimple;
  export default latexCmds;
}

// Adapted from and improved upon https://github.com/jxson/front-matter

import yaml from "js-yaml";

const OPTIONAL_BYTE_ORDER_MARK = "\\ufeff?";
// Use \r? to handle both Windows (CRLF) and Unix (LF) line endings
const PATTERN =
  "^(" +
  OPTIONAL_BYTE_ORDER_MARK +
  "(= yaml =|---)" +
  "$([\\s\\S]*?)" +
  "^(?:\\2|\\.\\.\\.)\\s*" +
  "$" +
  "\\r?" + // Optional carriage return for Windows compatibility
  "(?:\\n)?)";

export interface FrontMatterResults<T> {
  /**
   * Body content (without front matter).
   */
  readonly body: string;

  /**
   * Line number where the body begins.
   */
  readonly bodyBegin: number;

  /**
   * Parsed front matter object.
   */
  readonly frontMatter: T;

  /**
   * Front matter string.
   */
  readonly frontMatterString?: string;
}

export interface FrontMatterOptions {
  /**
   * Behavior when an error occurs while parsing the front matter YAML.
   * - "last": Returns the last successfully parsed front matter.
   * - "empty": Returns an empty front matter object.
   * - "error": Throws an error.
   * @default "error"
   */
  errorBehavior?: "last" | "empty" | "error";
}

export class FrontMatterParser<T = Record<string, unknown>> {
  private options: FrontMatterOptions;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private _lastFrontMatter: T = {} as T;

  constructor(options: FrontMatterOptions = {}) {
    this.options = options;
    this.options.errorBehavior = options.errorBehavior || "error";
  }

  private _emptyResults = (body: string) => ({
    frontMatter: {} as T,
    body,
    bodyBegin: 1,
  });

  /**
   * Get the line number where the body begins.
   */
  private _bodyBegin(match: RegExpExecArray, content: string) {
    const offset = match.index + match[0].length;
    const lines = content.slice(0, offset).split("\n");
    return lines.length;
  }

  /**
   * Split the content into front matter and body.
   *
   * @param content Markdown content, including front matter and body.
   * @returns
   * - `false` if the content does not contain front matter
   * - `{ frontMatterString, body, bodyBegin }` if contains
   * @see {@link FrontMatterResults}
   */
  public split(content: string) {
    const regex = new RegExp(PATTERN, "m");
    const match = regex.exec(content);

    if (!match) return false;

    const frontMatterString = match[match.length - 1].trim();
    const body = content.slice(match[0].length);
    const bodyBegin = this._bodyBegin(match, content);

    return {
      frontMatterString,
      body,
      bodyBegin,
    };
  }

  private _parse(content: string): FrontMatterResults<T> {
    const split = this.split(content);

    if (!split) return this._emptyResults(content);

    try {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const frontMatter = (yaml.load(split.frontMatterString) || {}) as T;
      this._lastFrontMatter = frontMatter;

      return { ...split, frontMatter };
    } catch (e) {
      const frontMatter =
        this.options.errorBehavior === "error"
          ? (() => {
              throw e;
            })()
          : this.options.errorBehavior === "last"
            ? this._lastFrontMatter
            : ({} as T);

      return { ...split, frontMatter };
    }
  }

  /**
   * Extract and parse front matter from a markdown document. A front matter should look like:
   *
   * ```
   * ---
   * key: value
   * ---
   * ```
   *
   * @param content Markdown content, including front matter and body.
   * @returns `{ body, bodyBegin, frontMatter, frontMatterString }`
   * @see {@link FrontMatterResults}
   */
  public parse(content: string): FrontMatterResults<T> {
    const lines = content.split(/(\r?\n)/);

    if (lines[0] && /= yaml =|---/.test(lines[0])) {
      return this._parse(content);
    }
    return this._emptyResults(content);
  }
}

export default FrontMatterParser;

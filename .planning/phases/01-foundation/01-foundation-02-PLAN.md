---
phase: 01-foundation
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - react-site/package.json
  - react-site/src/utils/dompurify.ts
  - react-site/src/utils/markdown.ts
  - react-site/src/components/editor/Preview.tsx
autonomous: true
user_setup: []

must_haves:
  truths:
    - All markdown-rendered HTML is sanitized before injection
    - DOMPurify is configured with HTML-only profile
    - XSS attacks are prevented in resume preview
  artifacts:
    - path: "react-site/package.json"
      contains: '"dompurify"'
    - path: "react-site/src/utils/dompurify.ts"
      exists: true
      exports: ["sanitizeHtml", "dompurifyInstance"]
    - path: "react-site/src/utils/markdown.ts"
      contains: "sanitizeHtml"
    - path: "react-site/src/components/editor/Preview.tsx"
      not_contains: "dangerouslySetInnerHTML.*{.*__html:.*html.*}"
  key_links:
    - from: "react-site/src/utils/dompurify.ts"
      to: "DOMPurify library"
      via: "configured instance with USE_PROFILES"
      pattern: "USE_PROFILES.*html.*true"
    - from: "react-site/src/utils/markdown.ts"
      to: "react-site/src/utils/dompurify.ts"
      via: "import and use sanitizeHtml function"
      pattern: "from.*dompurify"
    - from: "react-site/src/components/editor/Preview.tsx"
      to: "react-site/src/utils/dompurify.ts"
      via: "useSmartPages with sanitized HTML"
      pattern: "sanitizeHtml.*html"
---

<objective>
Integrate DOMPurify to sanitize all markdown-rendered HTML before injection into the DOM, preventing XSS attacks.

Purpose: User-generated markdown content must be sanitized to prevent malicious scripts from executing in the browser.

Output: DOMPurify configured and integrated with markdown rendering, all HTML is sanitized before display.
</objective>

<execution_context>
@C:/Users/jeff/.config/opencode/get-shit-done/workflows/execute-plan.md
@C:/Users/jeff/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-foundation/01-foundation-RESEARCH.md
@react-site/src/utils/markdown.ts
@react-site/src/components/editor/Preview.tsx
@react-site/package.json
@.planning/codebase/STRUCTURE.md
</context>

<tasks>

<task type="auto">
  <name>Install DOMPurify</name>
  <files>react-site/package.json</files>
  <action>
    Install DOMPurify in react-site:
    pnpm add --save-exact dompurify@^3.3.1 --filter=react-site

    DOMPurify is the industry-standard XSS sanitization library for the browser.

  </action>
  <verify>grep "dompurify" react-site/package.json</verify>
  <done>dompurify 3.3.1 is installed in react-site/package.json</done>
</task>

<task type="auto">
  <name>Create DOMPurify utility module</name>
  <files>react-site/src/utils/dompurify.ts</files>
  <action>
    Create react-site/src/utils/dompurify.ts with:

    import DOMPurify from 'dompurify';

    // Create a configured instance for HTML-only content (no SVG/MathML)
    // This restricts attack surface since markdown rendering only produces HTML
    const dompurifyInstance = DOMPurify({
      USE_PROFILES: { html: true },
      KEEP_CONTENT: true, // Preserve element content when element is removed
    });

    export function sanitizeHtml(dirtyHtml: string): string {
      return dompurifyInstance.sanitize(dirtyHtml);
    }

    export { dompurifyInstance };

    Per research recommendations: Restrict to HTML profile since markdown only produces HTML, not SVG or MathML.

  </action>
  <verify>cat react-site/src/utils/dompurify.ts</verify>
  <done>dompurify.ts exports sanitizeHtml function and dompurifyInstance</done>
</task>

  <task type="auto">
   <name>Integrate DOMPurify into MarkdownService</name>
   <files>react-site/src/utils/markdown.ts</files>
   <action>
     Update react-site/src/utils/markdown.ts:
     1. Add import: import { sanitizeHtml } from './dompurify';
     2. Remove the @ts-ignore comment on line 3 (this type issue will be addressed in plan 01-06)
     3. Update renderMarkdown method to sanitize output:
        Change:
          public renderMarkdown(md: string): string {
            return this.md.render(md);
          }
        To:
          public renderMarkdown(md: string): string {
            const dirtyHtml = this.md.render(md);
            return sanitizeHtml(dirtyHtml);
          }

     Note: The markdown-it plugins are registered with `as any` type assertions. These will be removed in plan 01-06.

   </action>
   <verify>grep "sanitizeHtml" react-site/src/utils/markdown.ts</verify>
   <done>MarkdownService.renderMarkdown uses sanitizeHtml on all output</done>
 </task>

<task type="auto">
  <name>Update Preview component to use sanitized HTML</name>
  <files>react-site/src/components/editor/Preview.tsx</files>
  <action>
    Update react-site/src/components/editor/Preview.tsx:
    1. Add import: import { sanitizeHtml } from '@/utils/dompurify';
    2. Update the html variable (line 48) to use sanitized HTML:
       Change:
         const html = markdownService.renderResume(cvData.markdown || "");
       To:
         const dirtyHtml = markdownService.renderResume(cvData.markdown || "");
         const html = sanitizeHtml(dirtyHtml);

    The useSmartPages hook receives sanitized HTML, so no XSS can execute when content is rendered.

    Note: The Preview component currently doesn't directly use dangerouslySetInnerHTML - it passes HTML to useSmartPages which injects it. The sanitization happens before this injection.

  </action>
  <verify>grep "sanitizeHtml" react-site/src/components/editor/Preview.tsx</verify>
  <done>Preview.tsx sanitizes HTML before passing to useSmartPages</done>
</task>

</tasks>

<verification>
After completion:
1. Verify tsc completes without new errors (existing @ts-ignore will be addressed in plan 01-06)
2. Verify pnpm run build succeeds
3. Manually test: Create a resume with malicious markdown like "<img src=x onerror=alert(1)//>" and verify no alert appears
</verification>

<success_criteria>

1. DOMPurify 3.3.1 is installed
2. dompurify.ts utility module exists with HTML-only profile configuration
3. MarkdownService.renderMarkdown sanitizes all output
4. Preview.tsx sanitizes HTML before rendering
5. XSS attack vectors (onerror, javascript:, etc.) are neutralized
6. Build succeeds
7. TypeScript compiles successfully (ignoring existing @ts-ignore)
   </success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-02-SUMMARY.md`
</output>

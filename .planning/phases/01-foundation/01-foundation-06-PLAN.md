---
phase: 01-foundation
plan: 06
type: execute
wave: 3
depends_on: ["01-04"]
files_modified:
  - react-site/src/utils/markdown.ts
  - react-site/src/components/editor/Preview.tsx
  - packages/*/src/**/*.ts
  - packages/*/src/**/*.tsx
autonomous: true
user_setup: []

must_haves:
  truths:
    - All @ts-ignore comments are removed from codebase
    - All explicit `any` types are replaced with proper TypeScript types
    - Type assertions are replaced with proper type definitions
  artifacts:
    - path: "react-site/src/utils/markdown.ts"
      not_contains: "@ts-ignore"
      not_contains: "as any"
    - path: "react-site/src/components/editor/Preview.tsx"
      not_contains: "@ts-ignore"
      not_contains: "as any"
  key_links:
    - from: "react-site/src/utils/markdown.ts"
      to: "TypeScript types for markdown-it plugins"
      via: "proper type definitions instead of any"
      pattern: "import.*from.*markdown-it"
---

<objective>
Remove all @ts-ignore comments and any type assertions from the codebase, replacing them with proper TypeScript types.

Purpose: @ts-ignore and any types undermine TypeScript's type safety benefits. This plan removes all such suppressions and defines proper types for third-party libraries and dynamic data.

Output: Codebase with no @ts-ignore comments or any type assertions, all properly typed.
</objective>

<execution_context>
@C:/Users/jeff/.config/opencode/get-shit-done/workflows/execute-plan.md
@C:/Users/jeff/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-foundation/01-RESEARCH.md
@.planning/phases/01-foundation/01-foundation-04-PLAN.md
@react-site/src/utils/markdown.ts
@react-site/src/components/editor/Preview.tsx
@.planning/codebase/CONCERNS.md
@.planning/codebase/CONVENTIONS.md
</context>

<tasks>

<task type="auto">
  <name>Find all @ts-ignore and any type usages</name>
  <files>react-site/src,packages</files>
  <action>
    Search the codebase for all instances of @ts-ignore and any type assertions:
    1. Run: grep -r "@ts-ignore" react-site/src packages/*/src --include="*.ts" --include="*.tsx"
    2. Run: grep -r "as any" react-site/src packages/*/src --include="*.ts" --include="*.tsx"
    3. Run: grep -r ": any" react-site/src packages/*/src --include="*.ts" --include="*.tsx"

    Record all files and line numbers for fixing in subsequent tasks.

    Note: From plan 02, we know there is a @ts-ignore on line 3 of react-site/src/utils/markdown.ts and `as any` type assertions for markdown-it plugin registration.

  </action>
  <verify>grep -r "@ts-ignore\|as any\|: any" react-site/src packages/*/src --include="*.ts" --include="*.tsx" | wc -l</verify>
  <done>All @ts-ignore and any type usages identified</done>
</task>

<task type="auto">
  <name>Fix @ts-ignore and any types in react-site</name>
  <files>react-site/src/utils/markdown.ts,react-site/src/components/editor/Preview.tsx</files>
  <action>
    Fix all @ts-ignore and any type usages in react-site/src:

    For react-site/src/utils/markdown.ts:
    1. Remove @ts-ignore comment on line 3
    2. Replace `as any` type assertions on markdown-it plugin registration with proper types:
       - Create type definitions for each plugin (e.g., interface MarkdownItCrossRefPlugin extends MarkdownIt.PluginWithOptions<any> { ... })
       - Use the proper types when registering plugins

    For react-site/src/components/editor/Preview.tsx:
    1. Remove any @ts-ignore comments
    2. Replace any types with proper type definitions

    If third-party library types are missing, install @types packages or create local type declarations.

    Per research: Use `unknown` type if truly uncertain, then use type guards for runtime validation. Avoid `any` at all costs.

  </action>
  <verify>grep "@ts-ignore\|as any\|: any" react-site/src/utils/markdown.ts react-site/src/components/editor/Preview.tsx || echo "No @ts-ignore or any found"</verify>
  <done>react-site has no @ts-ignore or any types</done>
</task>

<task type="auto">
  <name>Fix @ts-ignore and any types in packages</name>
  <files>packages/*/src</files>
  <action>
    Fix all @ts-ignore and any type usages in packages/*/src:
    1. For each file found in task 1:
       - Remove @ts-ignore comments
       - Replace any types with proper TypeScript types
       - If type is truly unknown, use `unknown` type instead
       - Add type guards for runtime validation if necessary

    If third-party library types are missing, install @types packages or create local type declarations in .d.ts files.

    Note: Check each package directory for type issues:
    - packages/case-police
    - packages/dynamic-css
    - packages/front-matter
    - packages/google-fonts-loader
    - packages/markdown-it-cross-ref
    - packages/markdown-it-katex
    - packages/markdown-it-latex-cmds
    - packages/utils

  </action>
  <verify>grep -r "@ts-ignore\|as any\|: any" packages/*/src --include="*.ts" --include="*.tsx" || echo "No @ts-ignore or any found in packages"</verify>
  <done>packages have no @ts-ignore or any types</done>
</task>

<task type="auto">
  <name>Verify build passes with no type suppressions</name>
  <files>react-site,packages</files>
  <action>
    Verify the build passes with all type suppressions removed:
    1. Run: pnpm run build (builds react-site and all packages)
    2. Run: pnpm run lint:biome (verifies Biome linting)
    3. If there are type errors, fix them by defining proper types
    4. DO NOT add @ts-ignore or any types - fix the underlying type issue

    If third-party library types are incorrect or missing:
    - Try installing @types packages
    - Create local .d.ts type declarations
    - Use type guards for runtime validation

  </action>
  <verify>pnpm run build && pnpm run lint:biome</verify>
  <done>Build and lint pass with no @ts-ignore or any types</done>
</task>

</tasks>

<verification>
After completion:
1. Verify no @ts-ignore comments exist in codebase
2. Verify no as any type assertions exist
3. Verify build passes with strict TypeScript
4. Verify Biome lint passes
</verification>

<success_criteria>

1. No @ts-ignore comments in react-site/src or packages/\*/src
2. No as any type assertions in codebase
3. No explicit : any types in codebase
4. Build passes with strict TypeScript (plan 04 enabled strict options)
5. Biome lint passes with strict rules (plan 04 configured strict rules)
6. Proper TypeScript types defined for all third-party libraries
   </success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-06-SUMMARY.md`
</output>
